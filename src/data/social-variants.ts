export type SocialSize = "square" | "story";

export interface SocialVariant {
  key: string;
  label: string;
  description: string;
  size: SocialSize;
}

export const VARIANTS_SQUARE: string[] = [
  "hero",
  "pricing",
  "how-it-works",
  "comparison",
  "demo-invite",
  "testimonial",
  "gallery-preview",
  "feature-music",
];

export const VARIANTS_STORY: string[] = [
  "hero-story",
  "countdown-story",
  "qr-story",
  "feature-story-story",
];

export const VARIANTS: SocialVariant[] = [
  {
    key: "hero",
    label: "Hero",
    description: "Ana mesaj — 'Düğününüzün her karesi tek havuzda'",
    size: "square",
  },
  {
    key: "pricing",
    label: "Fiyat",
    description: "5.000 ₺ anahtar teslim paket",
    size: "square",
  },
  {
    key: "how-it-works",
    label: "Nasıl Çalışır",
    description: "4 adımlı süreç infografik",
    size: "square",
  },
  {
    key: "comparison",
    label: "Önce / Sonra",
    description: "Geleneksel yöntem vs BiKareBırak karşılaştırma",
    size: "square",
  },
  {
    key: "demo-invite",
    label: "Demo Davetiye",
    description: "Şevval & Abdurrahman davetiye kartı önizleme",
    size: "square",
  },
  {
    key: "testimonial",
    label: "Müşteri Yorumu",
    description: "5 yıldız erken kullanıcı yorumu",
    size: "square",
  },
  {
    key: "gallery-preview",
    label: "Canlı Galeri",
    description: "Düğün gecesi galerisi görseli (dark mode)",
    size: "square",
  },
  {
    key: "feature-music",
    label: "Çiftin Şarkısı",
    description: "Müzik player feature öne çıkarma",
    size: "square",
  },
  {
    key: "hero-story",
    label: "Hero (Story)",
    description: "Ana mesaj dikey story formatında",
    size: "story",
  },
  {
    key: "countdown-story",
    label: "Geri Sayım",
    description: "Şevval & Abdurrahman'a kaç gün kaldı (dinamik)",
    size: "story",
  },
  {
    key: "qr-story",
    label: "Masa QR",
    description: "Masadaki QR kod tanıtım story",
    size: "story",
  },
  {
    key: "feature-story-story",
    label: "Bizim Hikayemiz",
    description: "Story timeline feature öne çıkarma",
    size: "story",
  },
];
