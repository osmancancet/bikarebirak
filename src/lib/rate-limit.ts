import { getAdminDb } from "@/lib/firebase/admin";

export class RateLimitError extends Error {
  constructor(message = "Çok fazla istek. Lütfen daha sonra tekrar deneyin.") {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Firestore tabanlı sliding window rate-limit.
 * Doc id: `${bucket}::${key}`, alanlar: { count, window_start (epoch ms) }.
 *
 * Pencere içindeki istek sayısı `limit`'i geçerse `RateLimitError` fırlatılır.
 */
export async function assertRateLimit(
  bucket: string,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<void> {
  const db = getAdminDb();
  const docRef = db.collection("rate_limits").doc(`${bucket}::${key}`);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    const now = Date.now();
    if (!snap.exists) {
      tx.set(docRef, { count: 1, window_start: now });
      return;
    }
    const d = snap.data() ?? {};
    const windowStart =
      typeof d.window_start === "number" ? d.window_start : now;
    if (now - windowStart > windowSeconds * 1000) {
      // Pencere geçti, sıfırla
      tx.set(docRef, { count: 1, window_start: now });
      return;
    }
    const next = (typeof d.count === "number" ? d.count : 0) + 1;
    if (next > limit) {
      throw new RateLimitError();
    }
    tx.update(docRef, { count: next });
  });
}

/** İstek header'larından IP adresini çıkarır (Vercel/Cloudflare ile uyumlu). */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf;
  const real = headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
