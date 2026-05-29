export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  read_minutes: number;
  body: string;
  category: string;
}

export const BLOG_CATEGORIES = [
  "Hazırlık",
  "Trend",
  "Anılar",
  "Vendor",
  "Pratik",
] as const;

export const POSTS: BlogPost[] = [
  {
    slug: "dugun-hazirlik-checklist-6-ay",
    title: "Düğün Hazırlık Checklist'i — 6 Ay → Düğün Günü",
    excerpt:
      "Düğüne 6 ay kala başlamanız gereken hazırlıkları aydan aya planladık. Stresi azaltacak bu listeyi yanınızda bulundurun.",
    cover_image: "https://picsum.photos/seed/blog-checklist/1200/600",
    published_at: "2026-01-15",
    read_minutes: 6,
    category: "Hazırlık",
    body: `Düğün hazırlığı maraton gibi: ne kadar erken başlarsanız, gün geldiğinde o kadar rahat olursunuz. Aşağıdaki ay-ay checklist, eksik kalan adımları öne çıkarır.

## 6 Ay Kala
- **Bütçeyi netleştirin.** Toplam rakam, kalemler ve esneklik payı.
- **Davetli sayısını netleştirin.** Mekan kapasitesi buradan belirlenir.
- **Mekanı rezerve edin.** Popüler mekanlar 1 yıl önceden tükenebilir.

## 4 Ay Kala
- **Fotoğrafçı, çiçek, müzik.** Beğendiğiniz kişilerle ön görüşme yapın, kaparo verin.
- **Dijital davetiye.** BiKareBırak gibi premium dijital davetiye hizmetleriyle çalışın — kağıt bağımlılığı ortadan kalkar, misafirlerle iletişim WhatsApp'a taşınır.

## 2 Ay Kala
- **LCV (katılım) sürecini başlatın.** Dijital davetiye linkini WhatsApp'tan paylaşın; geri sayım ve katılım bildirimleri otomatik gelsin.
- **Düğün günü programını yazın.** Saatlik akış (nikah, kokteyl, yemek, müzik).

## Düğün Haftası
- **Masa düzeni ve QR yerleşimi.** Misafirlerin fotoğraf paylaşımı için masa kartlarını yazdırın.
- **Telefonunuzu şarjda tutmak için power bank bulundurun.**

## Düğün Sonrası 1 Hafta
- **Tüm fotoğrafları indirin.** Dijital galeriniz birkaç gün sonra otomatik silinir; ZIP olarak indirmeyi unutmayın.
- **Teşekkür mesajı.** Anı defterindeki dilekleri okuyun, misafirlere kısa bir not gönderin.

Hazırlıkla ilgili sorularınız için bize WhatsApp'tan yazabilirsiniz; ürünümüzü düğününüze nasıl uyarladığımızı 5 dakikada anlatıyoruz.`,
  },
  {
    slug: "dijital-davetiye-trendleri-2026",
    title: "Dijital Davetiye Trendleri 2026",
    excerpt:
      "Bu yıl çiftler kağıt davetiyeyi tamamen bırakıyor. İşte 2026'da dikkat çeken dijital davetiye trendleri.",
    cover_image: "https://picsum.photos/seed/blog-trends/1200/600",
    published_at: "2026-02-01",
    read_minutes: 4,
    category: "Trend",
    body: `Kağıt davetiyenin yerini tamamen aldıkça dijital davetiyeler de kendi içinde olgunlaştı. 2026'da öne çıkan trendler:

## 1. Canlı Geri Sayım
Statik tarihler yerine geri sayımlı davetiyeler artık standart. Misafir linki açtığında "12 gün 4 saat 22 dakika kaldı" görüyor.

## 2. Karekod Fotoğraf Havuzları
Davetiye sayfasında "Misafir fotoğraflarımız buraya akıyor" başlıklı canlı galeri linki. Düğün günü misafirler masa karekodundan foto atıyor.

## 3. Çift Anı Defteri
Misafirin dileğini bırakabildiği mini bir form. Çift hem RSVP hem de dilek alıyor.

## 4. Düğün Şarkısı Player'ı
Davetiyenin sağ alt köşesinde çiftin seçtiği şarkıyı çalan ufak bir player. Premium hissi.

## 5. Tema Seçenekleri
Klasik altın, romantik gül, modern bej gibi 3-4 tema arasından çift tercih yapıyor.

BiKareBırak bu trendlerin hepsini standart pakete dahil ediyor; hangi temaları beğeniyorsanız ekran görüntülerini WhatsApp'tan paylaşalım.`,
  },
  {
    slug: "misafir-fotograflarini-toplama-rehberi",
    title: "Misafirlerinizden Fotoğraf Toplamanın En Güzel Yolu",
    excerpt:
      "WhatsApp grupları, hashtag'ler, Drive klasörleri… Hepsinin sorunu var. Doğru yöntemle düğün gecesinin tüm karelerini biriktirebilirsiniz.",
    cover_image: "https://picsum.photos/seed/blog-photos/1200/600",
    published_at: "2026-02-12",
    read_minutes: 5,
    category: "Anılar",
    body: `Düğün gecesi 200 misafiriniz var; her birinin telefonunda ortalama 8-10 foto. Bu 2000 kareyi nasıl toplarsınız?

## Yanlış yöntemler
- **WhatsApp grup**: Yüksek çözünürlük kaybolur, kaos olur.
- **Hashtag (Instagram)**: Misafirin %30'u Instagram kullanmaz; herkes gizli profilden paylaşır.
- **Drive klasör linki**: Yaşlı misafir 'klasöre yükleme' yapmaz.

## Doğru yöntem: Masada QR Kod
- Çiftinize özel bir link üretiyoruz: \`bikarebirak.com/cift-slug/yukle\`
- Masalardaki QR'ı misafir telefonundan okutuyor
- Tek tıkla galerisi veya kamerası açılıyor
- iPhone HEIC otomatik JPEG'e dönüştürülüyor
- Düğün salonundaki dev ekrana yansıyan canlı galeride foto saniyeler içinde belirir

Sonuç: 200 misafir → 1500+ kare → tek ZIP dosyası.

## Düğün sonrası
Galeriniz 7 gün aktif kalır. Bu sürede çift portalden tüm fotoğrafları ZIP indirir. İsterseniz '30 günlük arşiv' premium add-on'u ile süreyi uzatırsınız.`,
  },
  {
    slug: "dugun-tedarikci-rehberi",
    title: "Düğün Tedarikçilerini Seçerken Dikkat Edilecekler",
    excerpt:
      "Organizatör, fotoğrafçı, çiçekçi, mekan… Doğru ekiple çalışmak düğünün başarısının yarısı. Vendor seçim rehberi.",
    cover_image: "https://picsum.photos/seed/blog-vendor/1200/600",
    published_at: "2026-02-22",
    read_minutes: 5,
    category: "Vendor",
    body: `İyi tedarikçi düğünü kolaylaştırır, kötü tedarikçi en güzel günü stresle doldurur. Seçerken bakacağınız şeyler:

## Organizatör
- Daha önce yaptığı 5-10 düğünün portfolyosunu isteyin
- Referansları arayın, "stres anında nasıldı?" sorun
- Sözleşmede iptal ve değişiklik şartlarını okuyun

## Fotoğrafçı
- Düğün boyu mu çalışıyor, paket dışı saat ücreti var mı?
- Ham foto teslimat süresi (genelde 3-6 ay)
- Misafirlerin kendi yükledikleri fotoğraflarla nasıl etkileşeceğini sorun — modern fotoğrafçılar BiKareBırak gibi havuzları sahiplenir.

## Çiçekçi
- Mevsime uygun mu? Şubat-Mart'ta egzotik çiçekler ithal, pahalı.
- Reused (yeniden kullanım) — nikah masasındaki çiçekler yemek masasına geçirilebilir mi?

## Mekan
- A planı/B planı (yağmur durumu)
- Misafir Wi-Fi gücü — dijital davetiye/fotoğraf yükleme için kritik
- Otopark, vale, ulaşım

[Partnerlerimiz sayfamızda](/partnerler) güvendiğimiz tedarikçilerin listesini bulabilirsiniz.`,
  },
  {
    slug: "lcv-nedir-nasil-yonetilir",
    title: "LCV Nedir, Nasıl Yönetilir?",
    excerpt:
      "LCV (Lutfen Cevap Veriniz) misafirden katılım bildirimi almak demek. Doğru yöneten çift menü ve oturma planını sorunsuz çıkarır.",
    cover_image: "https://picsum.photos/seed/blog-lcv/1200/600",
    published_at: "2026-03-05",
    read_minutes: 3,
    category: "Pratik",
    body: `LCV, Fransızca *Répondez s'il vous plaît* (lütfen yanıtlayın) ifadesinden gelir. Türkiye'de "Lütfen Cevap Veriniz" olarak benimsenmiştir.

## Neden Önemli?
- **Menü siparişi**: Catering kişi başı fiyatlandırır. ±10 misafir ciddi tutar.
- **Oturma düzeni**: Kim kimle aynı masada olacak? Önceden planlanmazsa düğün gecesi kaos.
- **Bütçe**: Kişi sayısı net olunca çiçek, ikram, hediye sayıları doğru çıkar.

## Dijital LCV'nin Avantajları
- Misafir WhatsApp'tan linke tıklar, 30 saniyede "Evet, 2 kişi geliyorum" der.
- Çift gerçek zamanlı bildirim alır: kaç katılım, kaç gelemiyor, toplam kişi.
- CSV/Excel olarak listeyi indirip mekana iletir.

## İdeal Zamanlama
- Davetiyeyi gönderdikten 2-3 hafta sonra kapatın (son LCV tarihi).
- Hatırlatma: kapanış tarihinden 5 gün önce yanıtlamayanlara WhatsApp.

BiKareBırak panelinde LCV listesini istediğin an Excel olarak indirebilirsin.`,
  },
  {
    slug: "dugun-salonu-secerken-7-madde",
    title: "Düğün Salonu Seçerken Dikkat Edilecek 7 Madde",
    excerpt:
      "Salon seçimi düğünün konumlandırıcısı. Yanlış mekan, mükemmel organizasyonu bile gölgeleyebilir.",
    cover_image: "https://picsum.photos/seed/blog-salon/1200/600",
    published_at: "2026-03-18",
    read_minutes: 4,
    category: "Hazırlık",
    body: `Düğün salonu, düğününüzün karakterini belirleyen en önemli karar. 7 madde:

## 1. Misafir Kapasitesi
"Şu kadar masa sığıyor" yetmez. Dans pisti, kokteyl alanı, çocuk köşesi varsa kapasite düşer.

## 2. Konum & Ulaşım
Misafir İstanbul'un öbür ucundan gelecekse en az 1.5 saat erken yolda. Şehir merkezindeki bir salon, kıyıdaki "rüya salondan" daha pratik olabilir.

## 3. Açık Hava / Kapalı Alan
Yağmur planı zorunlu. Açık alana çadır kurulabiliyor mu? B planı maliyeti hesaba katın.

## 4. Wi-Fi Gücü
Modern düğünde misafir fotoğraf yüklüyor, davetiye linkini açıyor, canlı yayında izliyor. Salon Wi-Fi'sini önceden test edin.

## 5. Catering Esnekliği
"Mecbursunuz" cümlesinden kaçının. Catering seçimi açık olan salonlar genelde uygun.

## 6. Ses Sistemi
Müzik grubu, DJ, sunucu için yeterli mi? Düğün gecesi yarısında bozulan ses sistemi unutulmuyor.

## 7. Otopark
Misafirin %70'i araç ile gelir. Vale hizmeti var mı? Salon ücreti otopark dahil mi?

BiKareBırak'ın mekan ortakları için [partnerler sayfamızı](/partnerler) ziyaret edin.`,
  },
];
