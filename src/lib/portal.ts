import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getCoupleBySlug } from "@/lib/queries";
import { isCoupleAuthenticated } from "@/lib/couple-auth";
import type { Couple } from "@/lib/types";

/**
 * Çift portalı erişim kapısı:
 * 1) Cookie geçerliyse çifti döndürür.
 * 2) Yoksa ama `?key=` portal_token ile eşleşiyorsa, auth route'una
 *    yönlendirir (orada cookie set edilir, ardından `next`'e geri döner).
 * 3) Hiçbiri olmazsa /p/{slug}/gecersiz'e yönlendirir.
 */
export async function ensurePortalAccess(
  slug: string,
  key: string | undefined,
  nextPath: string
): Promise<Couple> {
  const couple = await getCoupleBySlug(slug);
  if (!couple) notFound();

  if (await isCoupleAuthenticated(couple.id, couple.portal_token)) {
    return couple;
  }

  if (key && couple.portal_token && key === couple.portal_token) {
    redirect(
      `/p/${slug}/auth?key=${encodeURIComponent(
        key
      )}&next=${encodeURIComponent(nextPath)}`
    );
  }

  redirect(`/p/${slug}/gecersiz`);
}
