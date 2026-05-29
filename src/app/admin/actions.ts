"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { getAdminDb, getAdminBucket } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin-auth";
import { slugify, parseProgramItems, parseStoryItems } from "@/lib/utils";
import { logAdminAction } from "@/lib/audit";
import { randomUUID } from "crypto";

/** URL-safe rastgele token üretir (çift portalı erişim anahtarı). */
function generatePortalToken(): string {
  return randomBytes(16).toString("base64url");
}

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
  const dressCode = String(formData.get("dress_code") ?? "").trim();
  const programRaw = String(formData.get("program") ?? "");
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

  const programItems = parseProgramItems(programRaw);

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

    const ref = await db.collection("couples").add({
      slug,
      bride_name: brideName,
      groom_name: groomName,
      wedding_date: new Date(weddingDate).toISOString(),
      venue_name: venueName,
      venue_maps_url: venueMapsUrl || null,
      welcome_message: welcomeMessage || null,
      cover_image_url: null,
      portal_token: generatePortalToken(),
      dress_code: dressCode || null,
      program_items: programItems.length > 0 ? programItems : null,
      created_at: FieldValue.serverTimestamp(),
    });
    await logAdminAction("couple.created", {
      couple_id: ref.id,
      couple_label: `${groomName} & ${brideName}`,
      slug,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Kayıt başarısız: ${message}` };
  }

  revalidatePath("/admin");
  return { success: `Çift oluşturuldu! Link: /${slug}` };
}

/** Mevcut çift bilgilerini günceller. */
export async function updateCoupleAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const brideName = String(formData.get("bride_name") ?? "").trim();
  const groomName = String(formData.get("groom_name") ?? "").trim();
  const weddingDate = String(formData.get("wedding_date") ?? "").trim();
  const venueName = String(formData.get("venue_name") ?? "").trim();
  const venueMapsUrl = String(formData.get("venue_maps_url") ?? "").trim();
  const welcomeMessage = String(formData.get("welcome_message") ?? "").trim();
  const dressCode = String(formData.get("dress_code") ?? "").trim();
  const programRaw = String(formData.get("program") ?? "");
  const storyRaw = String(formData.get("story") ?? "");
  let slug = String(formData.get("slug") ?? "").trim();

  if (!id || !brideName || !groomName || !weddingDate || !venueName) {
    return { error: "Lütfen zorunlu alanları doldurun." };
  }

  slug = slugify(slug || `${groomName}-${brideName}`);
  const programItems = parseProgramItems(programRaw);
  const storyItems = parseStoryItems(storyRaw);

  try {
    const db = getAdminDb();

    // Slug değiştiyse benzersizlik kontrolü (kendisini hariç tutarak)
    const existing = await db
      .collection("couples")
      .where("slug", "==", slug)
      .limit(2)
      .get();
    const conflict = existing.docs.find((d) => d.id !== id);
    if (conflict) {
      return { error: `"${slug}" linki başka bir çiftte kullanılıyor.` };
    }

    await db.collection("couples").doc(id).update({
      slug,
      bride_name: brideName,
      groom_name: groomName,
      wedding_date: new Date(weddingDate).toISOString(),
      venue_name: venueName,
      venue_maps_url: venueMapsUrl || null,
      welcome_message: welcomeMessage || null,
      dress_code: dressCode || null,
      program_items: programItems.length > 0 ? programItems : null,
      story_items: storyItems.length > 0 ? storyItems : null,
    });
    await logAdminAction("couple.updated", {
      couple_id: id,
      couple_label: `${groomName} & ${brideName}`,
      slug,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Güncelleme başarısız: ${message}` };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
  revalidatePath(`/${slug}`);
  return { success: "Çift bilgileri güncellendi." };
}

/** Çiftin kapak görselini Storage'a yükler ve cover_image_url'i günceller. */
export async function uploadCoverImageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const file = formData.get("cover") as File | null;
  if (!id || !slug || !file || file.size === 0) {
    return { error: "Lütfen bir kapak görseli seçin." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "Kapak görseli 8 MB'den küçük olmalı." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Sadece görsel dosyası yükleyebilirsiniz." };
  }

  try {
    const bucket = getAdminBucket();
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `covers/${slug}/cover-${Date.now()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const fileRef = bucket.file(path);
    await fileRef.save(Buffer.from(arrayBuffer), {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;

    await getAdminDb().collection("couples").doc(id).update({
      cover_image_url: publicUrl,
    });
    await logAdminAction("cover.uploaded", {
      couple_id: id,
      slug,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Kapak yüklenemedi: ${message}` };
  }

  revalidatePath(`/admin/${id}`);
  revalidatePath(`/${slug}`);
  return { success: "Kapak görseli güncellendi." };
}

/** Tek bir fotoğrafı hem Storage'tan hem Firestore'dan siler. */
export async function deletePhotoAction(photoId: string): Promise<ActionState> {
  if (!photoId) return { error: "Geçersiz fotoğraf." };
  try {
    const db = getAdminDb();
    const docRef = db.collection("photos").doc(photoId);
    const snap = await docRef.get();
    if (!snap.exists) return { error: "Fotoğraf bulunamadı." };
    const path = snap.data()?.storage_path as string | undefined;
    const coupleId = snap.data()?.couple_id as string | undefined;
    if (path) {
      await getAdminBucket().file(path).delete({ ignoreNotFound: true });
    }
    await docRef.delete();
    await logAdminAction("photo.deleted", {
      couple_id: coupleId,
      note: path ?? undefined,
    });
    if (coupleId) revalidatePath(`/admin/${coupleId}/fotograflar`);
    return { success: "Fotoğraf silindi." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Silinemedi: ${message}` };
  }
}

/** Çifti ve tüm bağımlı verilerini (fotolar, RSVP, kapak) kademeli siler. */
export async function deleteCoupleAction(coupleId: string): Promise<void> {
  if (!coupleId) return;

  const db = getAdminDb();
  const bucket = getAdminBucket();

  // 1) Fotoğraflar
  const photos = await db
    .collection("photos")
    .where("couple_id", "==", coupleId)
    .get();
  await Promise.allSettled(
    photos.docs.map((d) => {
      const path = d.data().storage_path as string | undefined;
      return path
        ? bucket.file(path).delete({ ignoreNotFound: true })
        : Promise.resolve();
    })
  );
  // Firestore batch limiti 500
  for (let i = 0; i < photos.docs.length; i += 400) {
    const batch = db.batch();
    photos.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }

  // 2) LCV kayıtları
  const rsvps = await db
    .collection("guests_rsvp")
    .where("couple_id", "==", coupleId)
    .get();
  for (let i = 0; i < rsvps.docs.length; i += 400) {
    const batch = db.batch();
    rsvps.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }

  // 3) Kapak, müzik, nişan foto klasörlerini temizle
  const coupleSnap = await db.collection("couples").doc(coupleId).get();
  const slug = coupleSnap.data()?.slug as string | undefined;
  if (slug) {
    for (const prefix of [`covers/${slug}/`, `engagement/${slug}/`, `music/${slug}/`]) {
      await bucket.deleteFiles({ prefix }).catch(() => {});
    }
  }

  // 4) Çift belgesi
  await db.collection("couples").doc(coupleId).delete();

  await logAdminAction("couple.deleted", {
    couple_id: coupleId,
    slug,
  });

  revalidatePath("/admin");
  redirect("/admin");
}

/** Çiftin şarkısını (MP3) Storage'a yükler ve music_url'i günceller. */
export async function uploadMusicAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const label = String(formData.get("music_label") ?? "").trim();
  const file = formData.get("music") as File | null;
  if (!id || !slug || !file || file.size === 0) {
    return { error: "Lütfen bir müzik dosyası seçin." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "Müzik dosyası 10 MB'den küçük olmalı." };
  }
  if (!file.type.startsWith("audio/")) {
    return { error: "Sadece ses dosyası yükleyebilirsiniz." };
  }

  try {
    const bucket = getAdminBucket();
    const ext = (file.name.split(".").pop() ?? "mp3").toLowerCase();
    // Eski müziği sil
    await bucket.deleteFiles({ prefix: `music/${slug}/` }).catch(() => {});
    const path = `music/${slug}/song-${Date.now()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const fileRef = bucket.file(path);
    await fileRef.save(Buffer.from(arrayBuffer), {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;

    await getAdminDb().collection("couples").doc(id).update({
      music_url: publicUrl,
      music_label: label || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Müzik yüklenemedi: ${message}` };
  }

  revalidatePath(`/admin/${id}`);
  revalidatePath(`/${slug}`);
  return { success: "Müzik güncellendi." };
}

/** Müziği kaldırır (Storage + Firestore). */
export async function removeMusicAction(
  coupleId: string,
  slug: string
): Promise<ActionState> {
  if (!coupleId) return { error: "Geçersiz çift." };
  try {
    await getAdminBucket()
      .deleteFiles({ prefix: `music/${slug}/` })
      .catch(() => {});
    await getAdminDb().collection("couples").doc(coupleId).update({
      music_url: null,
      music_label: null,
    });
    revalidatePath(`/admin/${coupleId}`);
    revalidatePath(`/${slug}`);
    return { success: "Müzik kaldırıldı." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Kaldırılamadı: ${message}` };
  }
}

/** Nişan fotoğrafı yükler ve engagement_photos dizisine ekler. */
export async function uploadEngagementPhotoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const file = formData.get("photo") as File | null;
  if (!id || !slug || !file || file.size === 0) {
    return { error: "Lütfen bir fotoğraf seçin." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "Görsel 8 MB'den küçük olmalı." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Sadece görsel dosyası yükleyebilirsiniz." };
  }

  try {
    const bucket = getAdminBucket();
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `engagement/${slug}/${randomUUID()}.${ext}`;
    const fileRef = bucket.file(path);
    await fileRef.save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;

    await getAdminDb()
      .collection("couples")
      .doc(id)
      .update({
        engagement_photos: FieldValue.arrayUnion(publicUrl),
      });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Yüklenemedi: ${message}` };
  }

  revalidatePath(`/admin/${id}`);
  revalidatePath(`/${slug}`);
  return { success: "Nişan fotoğrafı eklendi." };
}

/** Dizideki tek bir nişan fotoğrafını kaldırır (URL ile). */
export async function removeEngagementPhotoAction(
  coupleId: string,
  slug: string,
  url: string
): Promise<ActionState> {
  if (!coupleId || !url) return { error: "Geçersiz istek." };
  try {
    const bucket = getAdminBucket();
    // URL'den Storage path'ini çıkar
    const m = url.match(/storage\.googleapis\.com\/[^/]+\/(.+)$/);
    const path = m?.[1];
    if (path) {
      await bucket.file(path).delete({ ignoreNotFound: true });
    }
    await getAdminDb()
      .collection("couples")
      .doc(coupleId)
      .update({
        engagement_photos: FieldValue.arrayRemove(url),
      });
    revalidatePath(`/admin/${coupleId}`);
    revalidatePath(`/${slug}`);
    return { success: "Nişan fotoğrafı kaldırıldı." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Kaldırılamadı: ${message}` };
  }
}

/** Çiftin arşiv saklama süresini günlerle değiştirir (7/30/365 ya da custom). */
export async function setRetentionAction(
  coupleId: string,
  days: number | null
): Promise<ActionState> {
  if (!coupleId) return { error: "Geçersiz çift." };
  const value =
    typeof days === "number" && Number.isFinite(days) && days > 0
      ? Math.min(3650, Math.floor(days))
      : null;
  try {
    await getAdminDb().collection("couples").doc(coupleId).update({
      retention_days: value,
    });
    await logAdminAction("couple.updated", {
      couple_id: coupleId,
      note: `retention:${value ?? "default"}`,
    });
    revalidatePath(`/admin/${coupleId}`);
    return {
      success: value
        ? `Arşiv süresi ${value} gün olarak güncellendi.`
        : "Arşiv süresi varsayılana (7 gün) sıfırlandı.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Güncellenemedi: ${message}` };
  }
}

// ============================================================
// VENDOR (Reklam) ACTIONS
// ============================================================

const VALID_VENDOR_CATEGORIES = [
  "organizer",
  "photographer",
  "florist",
  "venue",
  "music",
  "dress",
  "other",
] as const;

function parseVendorForm(formData: FormData): {
  name: string;
  category: string;
  city: string;
  description: string;
  website_url: string;
  whatsapp: string;
  weight: number;
  expires_at: string;
  active: boolean;
} {
  return {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "other").trim(),
    city: String(formData.get("city") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    website_url: String(formData.get("website_url") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    weight: Math.min(
      10,
      Math.max(1, parseInt(String(formData.get("weight") ?? "5"), 10))
    ),
    expires_at: String(formData.get("expires_at") ?? "").trim(),
    active: formData.get("active") === "on",
  };
}

export async function createVendorAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const v = parseVendorForm(formData);
  if (!v.name || !v.website_url || !v.description) {
    return { error: "Ad, açıklama ve website zorunlu." };
  }
  if (
    !VALID_VENDOR_CATEGORIES.includes(
      v.category as (typeof VALID_VENDOR_CATEGORIES)[number]
    )
  ) {
    return { error: "Geçersiz kategori." };
  }
  let newId = "";
  try {
    const ref = await getAdminDb().collection("vendors").add({
      name: v.name,
      category: v.category,
      city: v.city || null,
      description: v.description,
      logo_url: null,
      website_url: v.website_url,
      whatsapp: v.whatsapp || null,
      weight: v.weight,
      active: v.active,
      expires_at: v.expires_at ? new Date(v.expires_at).toISOString() : null,
      created_at: FieldValue.serverTimestamp(),
    });
    newId = ref.id;
    await logAdminAction("vendor.created", {
      note: v.name,
      couple_id: ref.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Kayıt başarısız: ${message}` };
  }
  revalidatePath("/admin/reklamlar");
  revalidatePath("/");
  revalidatePath("/partnerler");
  return { success: `Vendor eklendi. ID: ${newId}` };
}

export async function updateVendorAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Geçersiz vendor." };
  const v = parseVendorForm(formData);
  if (!v.name || !v.website_url || !v.description) {
    return { error: "Ad, açıklama ve website zorunlu." };
  }
  try {
    await getAdminDb().collection("vendors").doc(id).update({
      name: v.name,
      category: v.category,
      city: v.city || null,
      description: v.description,
      website_url: v.website_url,
      whatsapp: v.whatsapp || null,
      weight: v.weight,
      active: v.active,
      expires_at: v.expires_at ? new Date(v.expires_at).toISOString() : null,
    });
    await logAdminAction("vendor.updated", {
      note: v.name,
      couple_id: id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Güncelleme başarısız: ${message}` };
  }
  revalidatePath("/admin/reklamlar");
  revalidatePath(`/admin/reklamlar/${id}/edit`);
  revalidatePath("/");
  revalidatePath("/partnerler");
  return { success: "Vendor güncellendi." };
}

export async function deleteVendorAction(vendorId: string): Promise<void> {
  if (!vendorId) return;
  const doc = await getAdminDb().collection("vendors").doc(vendorId).get();
  const name = (doc.data()?.name as string) ?? "?";
  await getAdminBucket()
    .deleteFiles({ prefix: `vendors/${vendorId}/` })
    .catch(() => {});
  await getAdminDb().collection("vendors").doc(vendorId).delete();
  await logAdminAction("vendor.deleted", {
    note: name,
    couple_id: vendorId,
  });
  revalidatePath("/admin/reklamlar");
  revalidatePath("/");
  revalidatePath("/partnerler");
  redirect("/admin/reklamlar");
}

export async function uploadVendorLogoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const file = formData.get("logo") as File | null;
  if (!id || !file || file.size === 0) {
    return { error: "Logo dosyası seçin." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { error: "Logo 2 MB'den küçük olmalı." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Sadece görsel kabul ediyoruz." };
  }
  try {
    const bucket = getAdminBucket();
    await bucket.deleteFiles({ prefix: `vendors/${id}/` }).catch(() => {});
    const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
    const path = `vendors/${id}/logo.${ext}`;
    const ref = bucket.file(path);
    await ref.save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
    await ref.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${path}`;
    await getAdminDb().collection("vendors").doc(id).update({ logo_url: url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return { error: `Yüklenemedi: ${message}` };
  }
  revalidatePath(`/admin/reklamlar/${id}/edit`);
  revalidatePath("/admin/reklamlar");
  revalidatePath("/");
  revalidatePath("/partnerler");
  return { success: "Logo güncellendi." };
}
