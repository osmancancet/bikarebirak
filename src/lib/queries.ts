import { getAdminDb } from "@/lib/firebase/admin";
import type {
  Couple,
  GuestRsvp,
  Photo,
  GuestMessage,
  ProgramItem,
  StoryItem,
  ThemeName,
  CoverFilter,
  Vendor,
  VendorCategory,
} from "@/lib/types";
import type {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";

/** Firestore Timestamp/Date alanını güvenle ISO string'e çevirir. */
function toIso(value: unknown): string {
  if (value && typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function mapCouple(doc: QueryDocumentSnapshot<DocumentData>): Couple {
  const d = doc.data();
  return {
    id: doc.id,
    slug: d.slug,
    bride_name: d.bride_name,
    groom_name: d.groom_name,
    wedding_date: toIso(d.wedding_date),
    venue_name: d.venue_name,
    venue_maps_url: d.venue_maps_url ?? null,
    welcome_message: d.welcome_message ?? null,
    cover_image_url: d.cover_image_url ?? null,
    portal_token: d.portal_token ?? "",
    dress_code: d.dress_code ?? null,
    program_items: Array.isArray(d.program_items)
      ? (d.program_items as ProgramItem[])
      : null,
    music_url: d.music_url ?? null,
    music_label: d.music_label ?? null,
    story_items: Array.isArray(d.story_items)
      ? (d.story_items as StoryItem[])
      : null,
    engagement_photos: Array.isArray(d.engagement_photos)
      ? (d.engagement_photos as string[])
      : null,
    theme: (typeof d.theme === "string" ? d.theme : null) as ThemeName | null,
    cover_filter: (typeof d.cover_filter === "string"
      ? d.cover_filter
      : null) as CoverFilter | null,
    favorite_photo_ids: Array.isArray(d.favorite_photo_ids)
      ? (d.favorite_photo_ids as string[])
      : null,
    retention_days:
      typeof d.retention_days === "number" ? d.retention_days : null,
    created_at: toIso(d.created_at),
  };
}

function mapRsvp(doc: QueryDocumentSnapshot<DocumentData>): GuestRsvp {
  const d = doc.data();
  return {
    id: doc.id,
    couple_id: d.couple_id,
    full_name: d.full_name,
    attending: !!d.attending,
    guest_count: d.guest_count ?? 0,
    created_at: toIso(d.created_at),
  };
}

function mapPhoto(doc: QueryDocumentSnapshot<DocumentData>): Photo {
  const d = doc.data();
  return {
    id: doc.id,
    couple_id: d.couple_id,
    storage_path: d.storage_path,
    public_url: d.public_url,
    uploader_name: d.uploader_name ?? null,
    like_count: typeof d.like_count === "number" ? d.like_count : 0,
    created_at: toIso(d.created_at),
  };
}

/** Slug'a göre çift bilgisini getirir; bulunamazsa null döner. */
export async function getCoupleBySlug(slug: string): Promise<Couple | null> {
  try {
    const snap = await getAdminDb()
      .collection("couples")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return mapCouple(snap.docs[0]);
  } catch (error) {
    console.error("getCoupleBySlug error:", error);
    return null;
  }
}

/** Doc id'sine göre çift bilgisini getirir (admin paneli). */
export async function getCoupleById(id: string): Promise<Couple | null> {
  try {
    const doc = await getAdminDb().collection("couples").doc(id).get();
    if (!doc.exists) return null;
    return mapCouple(doc as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error("getCoupleById error:", error);
    return null;
  }
}

/** Bir çiftin yüklenmiş fotoğraflarını (yeniden eskiye) getirir. */
export async function getPhotos(coupleId: string): Promise<Photo[]> {
  try {
    const snap = await getAdminDb()
      .collection("photos")
      .where("couple_id", "==", coupleId)
      .get();
    return snap.docs
      .map(mapPhoto)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  } catch (error) {
    console.error("getPhotos error:", error);
    return [];
  }
}

/** Bir çiftin LCV (katılım) listesini getirir. */
export async function getRsvps(coupleId: string): Promise<GuestRsvp[]> {
  try {
    const snap = await getAdminDb()
      .collection("guests_rsvp")
      .where("couple_id", "==", coupleId)
      .get();
    return snap.docs
      .map(mapRsvp)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  } catch (error) {
    console.error("getRsvps error:", error);
    return [];
  }
}

/** Tüm çiftleri (yeniden eskiye) getirir — admin paneli için. */
export async function getAllCouples(): Promise<Couple[]> {
  try {
    const snap = await getAdminDb().collection("couples").get();
    return snap.docs
      .map(mapCouple)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  } catch (error) {
    console.error("getAllCouples error:", error);
    return [];
  }
}

/** Verilen id'lere sahip foto kayıtlarını batch'lerde çeker (Firestore 'in' max 30). */
export async function getPhotosByIds(ids: string[]): Promise<Photo[]> {
  if (ids.length === 0) return [];
  const db = getAdminDb();
  const result: Photo[] = [];
  for (let i = 0; i < ids.length; i += 30) {
    const chunk = ids.slice(i, i + 30);
    try {
      const snap = await db
        .collection("photos")
        .where("__name__", "in", chunk)
        .get();
      result.push(...snap.docs.map(mapPhoto));
    } catch (error) {
      console.error("getPhotosByIds error:", error);
    }
  }
  // Çiftin verdiği sırada döndür
  const byId = new Map(result.map((p) => [p.id, p] as const));
  return ids.map((id) => byId.get(id)).filter((p): p is Photo => !!p);
}

/** Bir çiftin anı defteri mesajlarını (yeniden eskiye) getirir. */
export async function getGuestMessages(
  coupleId: string,
  limit?: number
): Promise<GuestMessage[]> {
  try {
    const snap = await getAdminDb()
      .collection("guest_messages")
      .where("couple_id", "==", coupleId)
      .get();
    const items = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        couple_id: d.couple_id,
        full_name: d.full_name,
        message: d.message,
        heart_count: typeof d.heart_count === "number" ? d.heart_count : 0,
        created_at: toIso(d.created_at),
      } as GuestMessage;
    });
    items.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return typeof limit === "number" ? items.slice(0, limit) : items;
  } catch (error) {
    console.error("getGuestMessages error:", error);
    return [];
  }
}

/** Bir çiftin yüklenen fotoğraf sayısını döndürür. */
export async function getPhotoCount(coupleId: string): Promise<number> {
  try {
    const snap = await getAdminDb()
      .collection("photos")
      .where("couple_id", "==", coupleId)
      .count()
      .get();
    return snap.data().count;
  } catch (error) {
    console.error("getPhotoCount error:", error);
    return 0;
  }
}

function mapVendor(doc: QueryDocumentSnapshot<DocumentData>): Vendor {
  const d = doc.data();
  return {
    id: doc.id,
    name: d.name ?? "",
    category: (d.category ?? "other") as VendorCategory,
    city: d.city ?? null,
    description: d.description ?? "",
    logo_url: d.logo_url ?? null,
    website_url: d.website_url ?? "",
    whatsapp: d.whatsapp ?? null,
    weight: typeof d.weight === "number" ? d.weight : 5,
    active: d.active !== false,
    expires_at: typeof d.expires_at === "string" ? d.expires_at : null,
    created_at: toIso(d.created_at),
  };
}

/** Aktif (ve süresi dolmamış) vendor'ları weight desc sıralı getirir. */
export async function getActiveVendors(opts: {
  category?: VendorCategory;
  city?: string;
  limit?: number;
} = {}): Promise<Vendor[]> {
  try {
    let q: Query<DocumentData> = getAdminDb()
      .collection("vendors")
      .where("active", "==", true);
    if (opts.category) {
      q = q.where("category", "==", opts.category);
    }
    const snap = await q.get();
    const now = new Date().toISOString();
    let items = snap.docs
      .map(mapVendor)
      .filter((v) => !v.expires_at || v.expires_at >= now);
    if (opts.city) {
      const lower = opts.city.toLocaleLowerCase("tr-TR");
      items = items.filter(
        (v) =>
          !v.city || v.city.toLocaleLowerCase("tr-TR").includes(lower)
      );
    }
    items.sort((a, b) => b.weight - a.weight);
    return typeof opts.limit === "number" ? items.slice(0, opts.limit) : items;
  } catch (error) {
    console.error("getActiveVendors error:", error);
    return [];
  }
}

/** Tüm vendor'ları (active dahil) admin listesi için getirir. */
export async function getAllVendors(): Promise<Vendor[]> {
  try {
    const snap = await getAdminDb().collection("vendors").get();
    return snap.docs
      .map(mapVendor)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  } catch (error) {
    console.error("getAllVendors error:", error);
    return [];
  }
}

/** Tek vendor'ı id ile getirir (edit page). */
export async function getVendorById(id: string): Promise<Vendor | null> {
  try {
    const doc = await getAdminDb().collection("vendors").doc(id).get();
    if (!doc.exists) return null;
    return mapVendor(doc as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error("getVendorById error:", error);
    return null;
  }
}
