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
  created_at: string;
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
}

/** couples tablosuna yeni kayıt eklerken kullanılan alanlar. */
export type NewCoupleInput = Omit<Couple, "id" | "created_at">;
