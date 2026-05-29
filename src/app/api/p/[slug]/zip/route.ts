import { NextResponse } from "next/server";
import { Readable } from "stream";
import archiver from "archiver";
import { getCoupleBySlug, getPhotos } from "@/lib/queries";
import { getAdminBucket } from "@/lib/firebase/admin";
import { isCoupleAuthenticated } from "@/lib/couple-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 dakika

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  if (!couple) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  // Erişim: cookie ile YA DA querystring key ile
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const ok =
    (await isCoupleAuthenticated(couple.id, couple.portal_token)) ||
    (!!key && key === couple.portal_token);
  if (!ok) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const photos = await getPhotos(couple.id);
  if (photos.length === 0) {
    return NextResponse.json({ error: "Henüz fotoğraf yok" }, { status: 404 });
  }

  const bucket = getAdminBucket();
  const archive = archiver("zip", { zlib: { level: 6 } });

  // archive hatalarını logla
  archive.on("warning", (err) => console.warn("archive warning:", err));
  archive.on("error", (err) => console.error("archive error:", err));

  // Her fotoğrafı stream olarak ekle
  photos.forEach((photo, idx) => {
    const ext = (photo.storage_path.split(".").pop() ?? "jpg").toLowerCase();
    const name = `bikare-${String(idx + 1).padStart(4, "0")}.${ext}`;
    archive.append(bucket.file(photo.storage_path).createReadStream(), {
      name,
    });
  });

  archive.finalize();

  // Node Readable -> Web ReadableStream (Node 22+)
  const webStream = Readable.toWeb(archive) as ReadableStream<Uint8Array>;

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="fotograflar-${couple.slug}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
