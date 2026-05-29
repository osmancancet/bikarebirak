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
  const file = formData.get("cover") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json(
      { error: "Bir görsel seçin." },
      { status: 400 }
    );
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Görsel 8 MB'den küçük olmalı." },
      { status: 400 }
    );
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Sadece görsel kabul ediyoruz." },
      { status: 400 }
    );
  }

  try {
    const bucket = getAdminBucket();
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `covers/${slug}/cover-${Date.now()}.${ext}`;
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
      .update({ cover_image_url: url });
    revalidatePath(`/${slug}`);
    revalidatePath(`/p/${slug}/duzenle`);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
