import { NextResponse } from "next/server";
import { Readable, PassThrough } from "stream";
import PDFDocument from "pdfkit";
import { getCoupleBySlug, getPhotos, getPhotosByIds } from "@/lib/queries";
import { getAdminBucket } from "@/lib/firebase/admin";
import { isCoupleAuthenticated } from "@/lib/couple-auth";
import { formatWeddingDate } from "@/lib/utils";
import type { Photo } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function fetchBuffer(path: string): Promise<Buffer> {
  const file = getAdminBucket().file(path);
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    file
      .createReadStream()
      .on("data", (c) => chunks.push(c as Buffer))
      .on("end", () => resolve(Buffer.concat(chunks)))
      .on("error", (e) => reject(e));
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  if (!couple) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const ok =
    (await isCoupleAuthenticated(couple.id, couple.portal_token)) ||
    (!!key && key === couple.portal_token);
  if (!ok) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  // Favoriler varsa onlar, yoksa son 100 foto
  let photos: Photo[] = [];
  if (couple.favorite_photo_ids && couple.favorite_photo_ids.length > 0) {
    photos = await getPhotosByIds(couple.favorite_photo_ids);
  } else {
    const all = await getPhotos(couple.id);
    photos = all.slice(0, 100);
  }

  if (photos.length === 0) {
    return NextResponse.json(
      { error: "Henüz albüme alınacak fotoğraf yok." },
      { status: 404 }
    );
  }

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: `${couple.bride_name} & ${couple.groom_name} — Düğün Albümü`,
      Author: "BiKareBırak",
    },
  });
  const pass = new PassThrough();
  doc.pipe(pass);

  // Kapak sayfası
  const cream = "#fdfbf7";
  const gold = "#c2a14d";
  const ink = "#3b362f";

  doc.rect(0, 0, doc.page.width, doc.page.height).fill(cream);
  doc.fillColor(ink);

  // Üst kicker
  doc
    .fillColor(gold)
    .fontSize(10)
    .font("Helvetica")
    .text("EVLENİYORUZ", 0, 200, { align: "center", characterSpacing: 6 });

  // İsim
  doc
    .fillColor(ink)
    .fontSize(60)
    .font("Times-Italic")
    .text(`${couple.groom_name}`, 0, 240, { align: "center" });
  doc
    .fillColor(gold)
    .fontSize(48)
    .text("&", 0, 320, { align: "center" });
  doc
    .fillColor(ink)
    .fontSize(60)
    .text(`${couple.bride_name}`, 0, 380, { align: "center" });

  // Ayraç
  doc
    .moveTo(doc.page.width / 2 - 80, 470)
    .lineTo(doc.page.width / 2 + 80, 470)
    .stroke(gold);

  // Tarih
  doc
    .fillColor(ink)
    .fontSize(14)
    .font("Helvetica")
    .text(formatWeddingDate(couple.wedding_date), 0, 490, { align: "center" });

  // Alt
  doc
    .fillColor(gold)
    .fontSize(10)
    .text("BiKareBırak · Düğün Albümü", 0, doc.page.height - 80, {
      align: "center",
      characterSpacing: 4,
    });

  // Foto sayfaları — A4'te 2x2 = 4 foto/sayfa
  const cellsPerPage = 4;
  for (let i = 0; i < photos.length; i += cellsPerPage) {
    doc.addPage();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(cream);
    doc.fillColor(ink);

    // Üst başlık
    doc
      .fillColor(gold)
      .fontSize(9)
      .font("Helvetica")
      .text(
        `${couple.bride_name} & ${couple.groom_name}`,
        50,
        30,
        { align: "left", characterSpacing: 2 }
      );
    doc.text(
      `Sayfa ${Math.floor(i / cellsPerPage) + 1}`,
      0,
      30,
      { align: "right", characterSpacing: 2 }
    );

    const cellW = (doc.page.width - 100 - 20) / 2;
    const cellH = (doc.page.height - 100 - 40) / 2;
    const slice = photos.slice(i, i + cellsPerPage);

    for (let j = 0; j < slice.length; j++) {
      const col = j % 2;
      const row = Math.floor(j / 2);
      const x = 50 + col * (cellW + 20);
      const y = 60 + row * (cellH + 20);

      try {
        const buf = await fetchBuffer(slice[j].storage_path);
        doc.image(buf, x, y, {
          fit: [cellW, cellH],
          align: "center",
          valign: "center",
        });
      } catch (err) {
        console.error("PDF image error:", err);
        doc
          .rect(x, y, cellW, cellH)
          .stroke(gold)
          .fillColor(ink)
          .fontSize(10)
          .text("Görsel yüklenemedi", x, y + cellH / 2 - 5, {
            width: cellW,
            align: "center",
          });
      }
    }
  }

  doc.end();

  const webStream = Readable.toWeb(pass) as ReadableStream<Uint8Array>;
  return new Response(webStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="album-${couple.slug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
