import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCoupleBySlug } from "@/lib/queries";
import { isCoupleAuthenticated } from "@/lib/couple-auth";
import { getAdminBucket, getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  if (!couple)
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  if (!(await isCoupleAuthenticated(couple.id, couple.portal_token)))
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
  const file = formData.get("music") as File | null;
  const label = String(formData.get("music_label") ?? "").trim();
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Müzik seçin." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Müzik 10 MB'den küçük olmalı." },
      { status: 400 }
    );
  }
  if (!file.type.startsWith("audio/")) {
    return NextResponse.json(
      { error: "Sadece ses dosyası." },
      { status: 400 }
    );
  }

  try {
    const bucket = getAdminBucket();
    await bucket.deleteFiles({ prefix: `music/${slug}/` }).catch(() => {});
    const ext = (file.name.split(".").pop() ?? "mp3").toLowerCase();
    const path = `music/${slug}/song-${Date.now()}.${ext}`;
    const ref = bucket.file(path);
    await ref.save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
    await ref.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${path}`;
    await getAdminDb()
      .collection("couples")
      .doc(couple.id)
      .update({ music_url: url, music_label: label || null });
    revalidatePath(`/${slug}`);
    revalidatePath(`/p/${slug}/duzenle`);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  if (!couple)
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  if (!(await isCoupleAuthenticated(couple.id, couple.portal_token)))
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    await getAdminBucket()
      .deleteFiles({ prefix: `music/${slug}/` })
      .catch(() => {});
    await getAdminDb()
      .collection("couples")
      .doc(couple.id)
      .update({ music_url: null, music_label: null });
    revalidatePath(`/${slug}`);
    revalidatePath(`/p/${slug}/duzenle`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
