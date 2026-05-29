import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { assertRateLimit, RateLimitError, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MessageBody {
  couple_id?: unknown;
  full_name?: unknown;
  message?: unknown;
  honeypot?: unknown;
}

const MAX_MESSAGE_LEN = 400;

export async function POST(request: Request) {
  let body: MessageBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  // Honeypot
  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const coupleId = typeof body.couple_id === "string" ? body.couple_id : "";
  const fullName =
    typeof body.full_name === "string" ? body.full_name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    !coupleId ||
    fullName.length < 2 ||
    fullName.length > 80 ||
    message.length < 1 ||
    message.length > MAX_MESSAGE_LEN
  ) {
    return NextResponse.json(
      { error: "Geçersiz form verisi." },
      { status: 400 }
    );
  }

  // Rate-limit: IP + couple başına saatte 5
  const ip = getClientIp(request);
  try {
    await assertRateLimit(`guest_msg::${ip}`, coupleId, 5, 3600);
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }
    throw err;
  }

  try {
    await getAdminDb().collection("guest_messages").add({
      couple_id: coupleId,
      full_name: fullName,
      message,
      created_at: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json(
      { error: `Mesaj kaydedilemedi: ${errMsg}` },
      { status: 500 }
    );
  }
}
