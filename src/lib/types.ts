export interface Couple {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue_name: string;
  venue_maps_url: string | null;
  welcome_message: string | null;
  cover_image_url: string | null;
  /** Çiftin portalına erişim için random URL-safe token (Faz D). */
  portal_token: string;
  /** Misafirler için kıyafet kodu önerisi. */
  dress_code: string | null;
  /** Düğün günü programı (saatlik akış). */
  program_items: ProgramItem[] | null;
  /** Çiftin şarkısı — opsiyonel müzik player için Storage public URL. */
  music_url: string | null;
  /** "Sigur Rós — Hoppípolla" gibi şarkı etiketi. */
  music_label: string | null;
  /** "Bizim Hikayemiz" timeline (tanışma, nişan, vb.). */
  story_items: StoryItem[] | null;
  /** Davetiye hero'sunda dönen nişan/sevgili fotoğrafları. */
  engagement_photos: string[] | null;
  /** Renk teması — null veya "classic-gold" varsayılan. */
  theme: ThemeName | null;
  /** Kapak/nişan fotoğraflarına uygulanan filtre. */
  cover_filter: CoverFilter | null;
  /** Çiftin favori olarak işaretlediği foto id'leri. */
  favorite_photo_ids: string[] | null;
  /** Fotoğraf saklama süresi (gün). null = varsayılan 7. */
  retention_days: number | null;
  created_at: string;
}

export type ThemeName = "classic-gold" | "romantic-rose" | "modern-beige";
export type CoverFilter = "none" | "bw" | "vintage" | "soft";

export type VendorCategory =
  | "organizer"
  | "photographer"
  | "florist"
  | "venue"
  | "music"
  | "dress"
  | "other";

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  city: string | null;
  description: string;
  logo_url: string | null;
  website_url: string;
  whatsapp: string | null;
  weight: number; // 1-10, daha yüksek = öncelikli gösterim
  active: boolean;
  expires_at: string | null; // ISO; geçerse otomatik gizlenir
  created_at: string;
}

export interface ProgramItem {
  time: string;
  label: string;
}

export interface StoryItem {
  date: string;
  title: string;
  description: string | null;
}

export interface GuestMessage {
  id: string;
  couple_id: string;
  full_name: string;
  message: string;
  created_at: string;
  /** Misafirlerin kalp sayısı. */
  heart_count?: number;
}

export interface GuestRsvp {
  id: string;
  couple_id: string;
  full_name: string;
  attending: boolean;
  guest_count: number;
  created_at: string;
}

export interface Photo {
  id: string;
  couple_id: string;
  storage_path: string;
  public_url: string;
  created_at: string;
  /** Bu tarihten sonra otomatik silinir (yükleme + saklama süresi). */
  expire_at?: string;
  /** Opsiyonel: foto'yu yükleyen misafirin adı. */
  uploader_name?: string | null;
  /** Misafirlerin kalp sayısı. */
  like_count?: number;
}

/** couples tablosuna yeni kayıt eklerken kullanılan alanlar. */
export type NewCoupleInput = Omit<Couple, "id" | "created_at">;
