import { NextResponse, type NextRequest } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb, getAdminBucket } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH = 300; // her turda işlenecek fotoğraf sayısı
const MAX_BATCHES = 8; // tek çağrıda en fazla 8 tur (~2400 foto)

/**
 * Süresi dolan (expire_at <= şimdi) fotoğrafları hem Firebase Storage'dan
 * hem de Firestore'dan siler. Her fotoğraf kendi expire_at damgasına göre
 * silindiği için aynı haftadaki farklı düğünler birbirini etkilemez.
 *
 * Korumalı: Authorization: Bearer <CRON_SECRET> veya ?secret=<CRON_SECRET>.
 * Vercel Cron, CRON_SECRET tanımlıysa bu başlığı otomatik gönderir.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  const provided = bearer ?? request.nextUrl.searchParams.get("secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const db = getAdminDb();
  const bucket = getAdminBucket();

  let totalDeleted = 0;
  let failed = 0;

  try {
    for (let i = 0; i < MAX_BATCHES; i++) {
      const now = Timestamp.now();
      const snap = await db
        .collection("photos")
        .where("expire_at", "<=", now)
        .limit(BATCH)
        .get();

      if (snap.empty) break;

      // 1) Storage dosyalarını paralel sil
      const storageResults = await Promise.allSettled(
        snap.docs.map((doc) => {
          const path = doc.data().storage_path as string | undefined;
          if (!path) return Promise.resolve();
          return bucket.file(path).delete({ ignoreNotFound: true });
        })
      );
      failed += storageResults.filter((r) => r.status === "rejected").length;

      // 2) Firestore dokümanlarını toplu sil (batch limiti 500)
      const writeBatch = db.batch();
      snap.docs.forEach((doc) => writeBatch.delete(doc.ref));
      await writeBatch.commit();

      totalDeleted += snap.size;

      if (snap.size < BATCH) break; // son tur
    }

    return NextResponse.json({
      ok: true,
      deleted: totalDeleted,
      storageErrors: failed,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json(
      { ok: false, deleted: totalDeleted, error: message },
      { status: 500 }
    );
  }
}
