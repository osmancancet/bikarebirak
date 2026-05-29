import { NextResponse } from "next/server";
import { getCoupleBySlug } from "@/lib/queries";
import { setCoupleCookie } from "@/lib/couple-auth";

export const dynamic = "force-dynamic";

/**
 * Token doğrulanırsa çift cookie'si set edilir, sonra `next` parametresine
 * (ya da varsayılan portala) yönlendirilir.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const next = url.searchParams.get("next") || `/p/${slug}`;

  const couple = await getCoupleBySlug(slug);
  if (!couple || !key || key !== couple.portal_token) {
    return NextResponse.redirect(new URL(`/p/${slug}/gecersiz`, request.url));
  }

  await setCoupleCookie(couple.id, key);
  return NextResponse.redirect(new URL(next, request.url));
}
