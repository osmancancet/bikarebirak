"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

export type ActionState = { error?: string; success?: string };

/** Admin giriş işlemi — şifre doğruysa httpOnly cookie set eder. */
export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Sunucuda ADMIN_PASSWORD tanımlı değil." };
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Şifre hatalı." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 saat
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/** Yeni çift profili oluşturur (Concierge kurulum adımı). */
export async function createCoupleAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const brideName = String(formData.get("bride_name") ?? "").trim();
  const groomName = String(formData.get("groom_name") ?? "").trim();
  const weddingDate = String(formData.get("wedding_date") ?? "").trim();
  const venueName = String(formData.get("venue_name") ?? "").trim();
  const venueMapsUrl = String(formData.get("venue_maps_url") ?? "").trim();
  const welcomeMessage = String(formData.get("welcome_message") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();

  if (!brideName || !groomName || !weddingDate || !venueName) {
    return { error: "Lütfen zorunlu alanları doldurun." };
  }

  if (!slug) {
    const year = new Date(weddingDate).getFullYear();
    slug = slugify(`${groomName}-${brideName}-${year}`);
  } else {
    slug = slugify(slug);
  }

  try {
    const db = getAdminDb();

    // Slug benzersizliğini kontrol et
    const existing = await db
      .collection("couples")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!existing.empty) {
      return { error: `"${slug}" linki zaten kullanımda. Farklı bir slug girin.` };
    }

    await db.collection("couples").add({
      slug,
      bride_name: brideName,
      groom_name: groomName,
      wedding_date: new Date(weddingDate).toISOString(),
      venue_name: venueName,
      venue_maps_url: venueMapsUrl || null,
      welcome_message: welcomeMessage || null,
      cover_image_url: null,
      created_at: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Kayıt başarısız: ${message}` };
  }

  revalidatePath("/admin");
  return { success: `Çift oluşturuldu! Link: /${slug}` };
}
