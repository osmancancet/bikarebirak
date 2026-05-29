import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getCoupleBySlug } from "@/lib/queries";
import { isCoupleAuthenticated } from "@/lib/couple-auth";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authOrFail(slug: string) {
  const couple = await getCoupleBySlug(slug);
  if (!couple) return { error: "Bulunamadı", status: 404 as const };
  if (!(await isCoupleAuthenticated(couple.id, couple.portal_token))) {
    return { error: "Yetkisiz", status: 401 as const };
  }
  return { couple };
}

async function readId(request: Request): Promise<string | null> {
  try {
    const body = (await request.json()) as { photoId?: unknown };
    return typeof body.photoId === "string" ? body.photoId : null;
  } catch {
    return null;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await authOrFail(slug);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const photoId = await readId(request);
  if (!photoId) {
    return NextResponse.json({ error: "Geçersiz photoId" }, { status: 400 });
  }
  try {
    await getAdminDb()
      .collection("couples")
      .doc(auth.couple.id)
      .update({ favorite_photo_ids: FieldValue.arrayUnion(photoId) });
    revalidatePath(`/p/${slug}/favoriler`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await authOrFail(slug);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const photoId = await readId(request);
  if (!photoId) {
    return NextResponse.json({ error: "Geçersiz photoId" }, { status: 400 });
  }
  try {
    await getAdminDb()
      .collection("couples")
      .doc(auth.couple.id)
      .update({ favorite_photo_ids: FieldValue.arrayRemove(photoId) });
    revalidatePath(`/p/${slug}/favoriler`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
