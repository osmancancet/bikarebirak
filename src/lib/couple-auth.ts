import { cookies } from "next/headers";
import { createHash } from "crypto";

/**
 * Çiftin portalına token tabanlı, parolasız erişim:
 * - Admin paylaşılabilir link verir: /p/{slug}?key={portal_token}
 * - İlk açılışta key doğruysa httpOnly cookie set edilir.
 * - Sonraki ziyaretlerde key olmadan da kapı açılır (cookie geçerli olduğu sürece).
 */
const COOKIE_PREFIX = "bkb_couple_";

function tokenHash(token: string): string {
  return createHash("sha256").update(`bkb-couple::${token}`).digest("hex");
}

function cookieName(coupleId: string): string {
  return `${COOKIE_PREFIX}${coupleId}`;
}

export async function isCoupleAuthenticated(
  coupleId: string,
  expectedToken: string
): Promise<boolean> {
  if (!expectedToken) return false;
  const store = await cookies();
  const value = store.get(cookieName(coupleId))?.value;
  return !!value && value === tokenHash(expectedToken);
}

export async function setCoupleCookie(
  coupleId: string,
  token: string
): Promise<void> {
  const store = await cookies();
  store.set(cookieName(coupleId), tokenHash(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // 30 gün — çift düğün sonrasında da bir süre erişebilsin
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCoupleCookie(coupleId: string): Promise<void> {
  const store = await cookies();
  store.delete(cookieName(coupleId));
}
