import { getAdminDb } from "@/lib/firebase/admin";
import type { Couple, GuestRsvp, Photo } from "@/lib/types";
import type {
  DocumentData,
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
