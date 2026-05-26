import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE_NAME = "bkb_admin";

/** Şifreden sabit bir oturum jetonu üretir. */
export function adminToken(): string {
  const pwd = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(`bkb::${pwd}`).digest("hex");
}

/** Mevcut isteğin admin oturumu olup olmadığını kontrol eder. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return !!value && value === adminToken();
}

export const ADMIN_COOKIE = COOKIE_NAME;
