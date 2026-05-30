export interface SocialCaption {
  variant: string;
  caption: string;
  hashtags: string[];
}

const COMMON_HASHTAGS = [
  "BiKareBırak",
  "DijitalDavetiye",
  "DüğünHazırlığı",
  "2026Düğünü",
  "DüğünFotoğrafçısı",
  "WeddingGoals",
  "İstanbulDüğünü",
  "AnkaraDüğünü",
  "İzmirDüğünü",
  "AntalyaDüğünü",
];

const TREND_HASHTAGS = [
  "DüğünTrendleri",
  "DüğünKonseptleri",
  "DüğünTarzı",
  "DüğünPlanlama",
  "LCV",
  "DüğünDavetiyesi",
  "PremiumDüğün",
  "DüğünKonsepti",
  "DüğünOrganizasyon",
  "Düğün",
  "GelinDamat",
  "WeddingPlanner",
];

export const CAPTIONS: SocialCaption[] = [
  {
    variant: "hero",
    caption: `Düğününüzün her karesi tek bir havuzda 🤍

Yüzlerce misafirin telefonundaki o eşsiz anlar kaybolmasın. Dijital davetiye, katılım yönetimi ve düğün boyunca akan canlı bir fotoğraf galerisi — hepsi bir arada, hepsi zahmetsiz.

✨ Anahtar teslim kurulum
📱 Üyelik & uygulama yok
💎 Tek seferlik 5.000 ₺

Detaylar için DM ya da WhatsApp 👉 link bio'da`,
    hashtags: [...COMMON_HASHTAGS, ...TREND_HASHTAGS],
  },
  {
    variant: "pricing",
    caption: `Tek seferlik 5.000 ₺ · Anahtar Teslim 💎

Aylık abonelik yok, gizli ücret yok. Düğününüz için tek bir ödeme:
✓ Dijital davetiye sayfanız (özel link + tasarım)
✓ Geri sayım, mekan haritası, karşılama metni
✓ LCV (katılım) formu + yönetim paneli
✓ Sınırsız misafir fotoğraf yüklemesi
✓ Düğün günü canlı galeri ekranı
✓ Masalar için baskıya hazır QR kodlar
✓ Anı Defteri + WhatsApp paylaşım şablonu
✓ Düğün sonrası tüm fotoğrafları ZIP olarak indirme

Genellikle aynı gün kurulum ⚡
DM 'den yazın, başlayalım 💌`,
    hashtags: [
      "BiKareBırak",
      "DijitalDavetiye",
      "DüğünFiyatları",
      "AnahtarTeslimDüğün",
      "DüğünHazırlığı",
      "PremiumDüğün",
      "DüğünBütçesi",
      "2026Düğünü",
      "DüğünDavetiyesi",
      "DüğünOrganizasyon",
      "İstanbulDüğünü",
      "AnkaraDüğünü",
      "İzmirDüğünü",
      "WeddingPlanner",
      "DüğünPlanlama",
      "LCV",
    ],
  },
  {
    variant: "how-it-works",
    caption: `4 basit adımda düğününüz dijitalleşiyor ✨

1️⃣ Sipariş — WhatsApp'tan bize ulaşırsınız, ödemeyi alıp aynı gün başlatırız.
2️⃣ Davetiye — Çiftinize özel davetiye linkini misafirlerinize WhatsApp'tan iletirsiniz. LCV otomatik gelir.
3️⃣ Düğün Günü — Masalardaki QR'ları okutan misafir saniyeler içinde foto yüklemeye başlar. Şifre yok, üyelik yok.
4️⃣ Anılar — Salondaki dev ekranda akan canlı galeri + düğün sonrası tüm karelerin ZIP olarak elinizde.

Anlatması bizden, uygulaması bizden 💎
Detaylar için DM 👉`,
    hashtags: [...COMMON_HASHTAGS, ...TREND_HASHTAGS],
  },
  {
    variant: "comparison",
    caption: `Geleneksel yöntem 👉 BiKareBırak 🤍

❌ WhatsApp grupları kayboluyor, foto'lar dağınık
✓ Tüm fotolar tek havuzda, tek ZIP olarak indir

❌ Misafirler "siz çekmiş miydiniz?" diye soruyor
✓ QR'ı okutan misafir saniyeler içinde yüklüyor

❌ Profesyonel fotoğrafçının kaçırdığı anlar yok
✓ Misafirlerin yakaladığı samimi, anlık kareler

❌ Düğün gecesi tek bir paylaşım deneyimi yok
✓ Salondaki dev ekrana yansıyan canlı galeri

Premium düğün hak ettiğiniz ürün ile 💎`,
    hashtags: [...COMMON_HASHTAGS, ...TREND_HASHTAGS, "DüğünDeneyimi"],
  },
  {
    variant: "demo-invite",
    caption: `Davetiyeniz şöyle olabilir 💌

Çiftinize özel slug + zarif tasarım. Misafiriniz linke tıkladığı anda geri sayım, mekan haritası ve katılım formu önünde.

Bizden bir örnek 👉 bikarebırak.com/ornek

Daha fazlası için DM açık 🤍`,
    hashtags: [
      "BiKareBırak",
      "DijitalDavetiye",
      "DavetiyeTasarımı",
      "DüğünDavetiyesi",
      "ModerDavetiye",
      "DüğünHazırlığı",
      "2026Düğünü",
      "GelinDamat",
      "WeddingInvite",
      "PremiumDavetiye",
      "MinimalDavetiye",
      "AltınDavetiye",
      "İstanbulDüğünü",
      "AntalyaDüğünü",
      "DüğünTarzı",
      "WeddingGoals",
    ],
  },
  {
    variant: "testimonial",
    caption: `"Düğün gecesi salondaki dev ekrana yansıyan galeride misafirlerin attığı fotoğrafları görmek müthişti. Bizim göremediğimiz onlarca anı yakalandı." — Ayşe & Burak 🤍

Erken kullanıcılarımızdan bir not. Düğün ekosistemine yeni bir soluk getiriyoruz — siz de aramıza katılın 💎

DM 👈 5.000 ₺ ile başlıyoruz`,
    hashtags: [
      "BiKareBırak",
      "DijitalDavetiye",
      "MüşteriYorumu",
      "DüğünYorumları",
      "Düğün",
      "DüğünHazırlığı",
      "2026Düğünü",
      "WeddingGoals",
      "GelinDamat",
      "PremiumDüğün",
      "DüğünDeneyimi",
      "Davetiye",
      "İstanbulDüğünü",
      "AnkaraDüğünü",
      "WeddingPlanner",
    ],
  },
  {
    variant: "gallery-preview",
    caption: `Düğün gecesi salondaki ekranınız bu olacak 🌙

Misafirleriniz QR'ı okutup foto yükledikçe galeriniz canlı olarak büyüyor. Karanlık moda uyumlu, projeksiyona zarif yansıyan masonry grid.

Tüm anlar, gerçek zamanlı, ortak bir vitrinde ✨

5.000 ₺ ile anahtar teslim 👉 DM`,
    hashtags: [...COMMON_HASHTAGS, "CanlıGaleri", "DüğünFotoğrafları", "ProjeksiyonDüğün"],
  },
  {
    variant: "feature-music",
    caption: `Davetiyenizin kendi şarkısı olsun 🎵

Çift olarak seçtiğiniz şarkı, davetiye sayfanızın sağ alt köşesinde sessizce bekliyor. Misafiriniz linki açar açmaz "♫" düğmesine basıp ortamın atmosferine girer.

Premium hissi, küçük bir dokunuş ile ✨`,
    hashtags: [
      "BiKareBırak",
      "DijitalDavetiye",
      "DüğünŞarkısı",
      "DüğünPlaylist",
      "ÇiftinŞarkısı",
      "WeddingSong",
      "DüğünHazırlığı",
      "2026Düğünü",
      "PremiumDüğün",
      "DüğünDavetiyesi",
      "DavetiyeTasarımı",
      "DüğünMüziği",
      "WeddingGoals",
      "GelinDamat",
    ],
  },
  {
    variant: "hero-story",
    caption: `Premium dijital düğün asistanı 💎
Detaylar bio'da · DM 👉`,
    hashtags: [...COMMON_HASHTAGS, ...TREND_HASHTAGS],
  },
  {
    variant: "countdown-story",
    caption: `Şevval & Abdurrahman'ın düğününe az kaldı 🤍
BiKareBırak ile tüm anlar tek havuzda.`,
    hashtags: [
      "BiKareBırak",
      "DüğünGeriSayım",
      "Şevval",
      "Abdurrahman",
      "2026Düğünü",
      "DijitalDavetiye",
      "Düğün",
      "GelinDamat",
      "İstanbulDüğünü",
      "WeddingGoals",
    ],
  },
  {
    variant: "qr-story",
    caption: `Masadaki QR'ı okutun, anılarınızı paylaşın 📸
Uygulama yok · Üyelik yok · Şifre yok.`,
    hashtags: [
      "BiKareBırak",
      "MasadaQR",
      "DüğünQR",
      "MisafirFotoğrafları",
      "DüğünFotoğrafları",
      "DijitalDavetiye",
      "Düğün",
      "2026Düğünü",
      "WeddingHack",
      "DüğünHazırlığı",
    ],
  },
  {
    variant: "feature-story-story",
    caption: `Bizim Hikayemiz — davetiyenize özel timeline 🤍
Tanıştığınız günden düğüne tüm anlar.`,
    hashtags: [
      "BiKareBırak",
      "BizimHikayemiz",
      "ÇiftinHikayesi",
      "DüğünHikayesi",
      "DijitalDavetiye",
      "DavetiyeTasarımı",
      "PremiumDüğün",
      "2026Düğünü",
      "GelinDamat",
      "Düğün",
      "WeddingGoals",
    ],
  },
];

/** Variant key'ine göre caption getir, yoksa null. */
export function captionFor(variant: string): SocialCaption | null {
  return CAPTIONS.find((c) => c.variant === variant) ?? null;
}

/** Caption + hashtag birleştirilmiş tek string. Instagram'a kopyala-yapıştır. */
export function fullCaptionText(c: SocialCaption): string {
  const hashLine = c.hashtags.map((h) => `#${h}`).join(" ");
  return `${c.caption}\n\n${hashLine}`;
}
