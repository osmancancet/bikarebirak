import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { assertRateLimit, RateLimitError, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RsvpBody {
  couple_id?: unknown;
  full_name?: unknown;
  attending?: unknown;
  guest_count?: unknown;
  honeypot?: unknown;
}

export async function POST(request: Request) {
  let body: RsvpBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  // Honeypot: bot doldurursa sessizce başarı dön
  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const coupleId = typeof body.couple_id === "string" ? body.couple_id : "";
  const fullName =
    typeof body.full_name === "string" ? body.full_name.trim() : "";
  const attending = body.attending === true;
  const guestCountRaw =
    typeof body.guest_count === "number" ? body.guest_count : 1;
  const guestCount = Math.max(0, Math.min(20, Math.floor(guestCountRaw)));

  if (!coupleId || fullName.length < 2 || fullName.length > 80) {
    return NextResponse.json(
      { error: "Geçersiz form verisi." },
      { status: 400 }
    );
  }

  // Rate-limit: IP + couple başına saatte 5
  const ip = getClientIp(request);
  try {
    await assertRateLimit(`rsvp::${ip}`, coupleId, 5, 3600);
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }
    throw err;
  }

  try {
    await getAdminDb()
      .collection("guests_rsvp")
      .add({
        couple_id: coupleId,
        full_name: fullName,
        attending,
        guest_count: attending ? guestCount : 0,
        created_at: FieldValue.serverTimestamp(),
      });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json(
      { error: `Kayıt başarısız: ${message}` },
      { status: 500 }
    );
  }
}
