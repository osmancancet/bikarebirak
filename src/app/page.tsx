import Link from "next/link";
import {
  Camera,
  Heart,
  QrCode,
  MessageCircle,
  Sparkles,
  Images,
  ShieldCheck,
  Zap,
  Check,
  MapPin,
  Clock,
  ScanLine,
  X,
  Lock,
  Moon,
  Star,
  ArrowRight,
  Eye,
  Calendar,
  Quote,
} from "lucide-react";
import { FauxInvitationPreview } from "@/components/landing/FauxInvitationPreview";
import { StatCounter } from "@/components/landing/StatCounter";
import { MiniGalleryPreview } from "@/components/landing/MiniGalleryPreview";
import { MobileStickyCTA } from "@/components/landing/MobileStickyCTA";
import { PolaroidStrip } from "@/components/landing/PolaroidStrip";
import { VendorStrip } from "@/components/VendorStrip";

// Satışların yapıldığı WhatsApp numarası
const WHATSAPP_NUMBER = "905548364486";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Merhaba, BiKareBırak hakkında bilgi almak istiyorum."
)}`;

const steps = [
  {
    icon: MessageCircle,
    title: "Sipariş & Kurulum",
    desc: "WhatsApp'tan bize ulaşırsınız. Çiftinize özel dijital davetiye, link ve QR kodları biz hazırlarız. Hiçbir teknik bilgi gerekmez.",
  },
  {
    icon: Heart,
    title: "Davetiye & Katılım (LCV)",
    desc: "Şık davetiye linkini misafirlerinize WhatsApp'tan gönderirsiniz. Geri sayım, mekan haritası ve tek dokunuşla katılım bildirimi.",
  },
  {
    icon: ScanLine,
    title: "Düğün Günü: Fotoğraf",
    desc: "Masalardaki QR'ı okutan misafir, doğrudan yükleme ekranına gelir. Şifre yok, uygulama yok — herkesin anlayacağı kadar basit.",
  },
  {
    icon: Images,
    title: "Canlı Galeri",
    desc: "Salondaki dev ekrana yansıyan galeri, misafirler fotoğraf yükledikçe sayfa yenilenmeden anında güncellenir.",
  },
];

const features = [
  {
    icon: Camera,
    title: "Tek Fotoğraf Havuzu",
    desc: "Yüzlerce misafirin çektiği her kare; profesyonel fotoğrafçının kaçırdığı o anlar dahil, tek bir yerde toplanır.",
  },
  {
    icon: Zap,
    title: "Sıfır Sürtünme",
    desc: "Üyelik, indirme, şifre yok. QR'ı okut, butona bas, yükle. Dede de yapar, çocuk da.",
  },
  {
    icon: Sparkles,
    title: "Canlı & Büyüleyici",
    desc: "Karanlık moda uygun zarif galeri, projeksiyonda gerçek zamanlı akar. Gece boyu kendini yeniler.",
  },
  {
    icon: ShieldCheck,
    title: "Anahtar Teslim",
    desc: "Kurulumu, QR üretimini, her şeyi biz yaparız. Siz sadece linki paylaşın ve gününüzün tadını çıkarın.",
  },
];

const before = [
  "WhatsApp gruplarında dağılan, kayıp fotoğraflar",
  "Misafirlerin tek tek 'siz çekmiş miydiniz?' soruları",
  "Profesyonel fotoğrafçının kaçırdığı anlar yok",
  "Düğün gecesi tek bir paylaşım deneyimi yok",
];

const after = [
  "Tüm fotoğraflar tek havuzda — tek tıkla ZIP indirme",
  "QR'ı okutan misafir doğrudan yükleme ekranında",
  "Profesyonelin kaçırdığı anlar misafirlerden geliyor",
  "Düğün ekranına yansıyan canlı, ortak galeri",
];

const included = [
  "Çiftinize özel dijital davetiye sayfası",
  "Geri sayım, mekan haritası ve karşılama metni",
  "LCV (katılım) formu ve yönetim paneli",
  "Sınırsız misafir fotoğraf yüklemesi",
  "Düğün günü canlı galeri ekranı",
  "Masalar için baskıya hazır QR kodlar",
  "Anı Defteri — misafirlerden dilek mesajları",
  "Düğün sonrası tüm fotoğrafları ZIP olarak indirme",
];

const testimonials = [
  {
    initials: "AB",
    name: "Ayşe & Burak",
    when: "Eylül 2025",
    color: "from-rose-200 to-rose-300 text-rose-700",
    quote:
      "Düğün gecesi salonda kocaman ekrana yansıyan galeride misafirlerin attığı fotoğrafları görmek müthişti. Bizim göremediğimiz onlarca anı yakalandı.",
  },
  {
    initials: "ZE",
    name: "Zeynep & Emir",
    when: "Ekim 2025",
    color: "from-amber-200 to-amber-300 text-amber-700",
    quote:
      "QR kodu okutan herkes saniyeler içinde foto attı. Üyelik, indirme falan olmayınca yaşlı akrabalar bile rahatlıkla kullandı. Konsept çok başarılı.",
  },
  {
    initials: "MD",
    name: "Merve & Deniz",
    when: "Kasım 2025",
    color: "from-violet-200 to-violet-300 text-violet-700",
    quote:
      "Davetiye sayfası o kadar şık ki misafirlerimiz 'bunu nereden buldunuz?' diye sordu. LCV yönetimi de inanılmaz pratik. Şiddetle öneriyorum.",
  },
];

const faqs = [
  {
    q: "Misafirlerin uygulama indirmesi veya üye olması gerekiyor mu?",
    a: "Hayır. Misafir QR kodu okutur veya linke tıklar, doğrudan yükleme ekranı açılır. Şifre, üyelik, uygulama — hiçbiri yok. Yaşlılar dahil herkes saniyeler içinde fotoğraf paylaşabilir.",
  },
  {
    q: "Fotoğraflar ne kadar süre saklanıyor?",
    a: "Düğün sonrası 7 gün boyunca galeride kalır, ardından otomatik silinir. Düğünden sonra çiftin özel panelinden tek tıkla tüm fotoğrafları ZIP olarak indirebilirsiniz. İsterseniz '30 günlük arşiv' eklemesi de yapabiliriz.",
  },
  {
    q: "Kurulumu kendim mi yapacağım?",
    a: "Hayır. Sistem 'anahtar teslim' çalışır. Bilgileri bizimle paylaşırsınız, davetiye sayfanızı, QR kodlarınızı ve özel linkinizi biz hazırlayıp size teslim ederiz. Genelde aynı gün içinde her şey hazır olur.",
  },
  {
    q: "Düğünden önce davetiyeyi ne zaman göndermeli?",
    a: "Yaygın bir uygulama, düğünden 3-4 hafta önce davetiye linkini misafirlere WhatsApp'tan iletmektir. Geri sayım, mekan ve harita misafiri ısıtır; LCV erkenden gelmeye başlar.",
  },
  {
    q: "Misafirin telefonunda internet yoksa ne olur?",
    a: "QR kodu okutmak için fotoğraf yüklemenin her aşamasında internet gerekir. Düğün mekanlarının çoğunda Wi-Fi misafirlere açık olur; biz de davetiyede 'Düğün Wi-Fi: …' bilgisini eklemenizi öneriyoruz.",
  },
  {
    q: "Fotoğraflar profesyonel fotoğrafçımı etkiler mi?",
    a: "Tam tersi — birbirini tamamlar. Profesyonel fotoğrafçı sanatsal pozları çekerken, misafirler de samimi, anlık kareleri yakalar. Düğün sonunda elinizde iki farklı arşiv olur.",
  },
  {
    q: "Tüm fotoğrafları toplu indirebilir miyim?",
    a: "Evet. Çiftin özel paneline (size verilen link) girip 'Tüm Fotoğrafları İndir (ZIP)' butonuna basmanız yeter. Birkaç saniye içinde tek dosyada bilgisayarınıza iner.",
  },
  {
    q: "Veri güvenliği nasıl sağlanıyor?",
    a: "KVKK uyumlu çalışıyoruz. Veriler Google Cloud'un Türkiye'ye yakın Avrupa veri merkezlerinde saklanır. Çift paneline sadece size verilen özel link ile erişilebilir; misafir yüklemeleri abusedan korunmuş API'lar üzerinden yapılır.",
  },
  {
    q: "Nasıl satın alabilirim?",
    a: "Tek yol WhatsApp. Aşağıdaki butondan bize yazın, düğün detaylarını konuşalım, ödemenizi alıp aynı gün kurulumu yapalım. Banka havalesi veya kredi kartı ile ödeme alıyoruz.",
  },
  {
    q: "İade veya iptal hakkım var mı?",
    a: "Düğün tarihinizden 14 gün önceye kadar kurulum yapılmamışsa iade alabilirsiniz. Kurulum sonrası iade mümkün olmaz ancak destek/değişiklik konusunda esnek davranıyoruz.",
  },
];

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bikarebirak.com";

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BiKareBırak",
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description:
      "Premium dijital düğün asistanı — dijital davetiye, LCV ve canlı fotoğraf galerisi.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+90 554 836 44 86",
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-beige/70 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-serif text-2xl text-gold-gradient">
            BiKareBırak
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-ink-soft sm:flex">
            <a href="#nasil" className="transition-colors hover:text-ink">
              Nasıl Çalışır
            </a>
            <a href="#ozellikler" className="transition-colors hover:text-ink">
              Özellikler
            </a>
            <a href="#fiyat" className="transition-colors hover:text-ink">
              Fiyat
            </a>
            <Link href="/blog" className="transition-colors hover:text-ink">
              Blog
            </Link>
            <a href="#sss" className="transition-colors hover:text-ink">
              SSS
            </a>
          </nav>
          <a
            href={WHATSAPP_LINK}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" />
            İletişim
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-5 pt-16 pb-20 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-gold-soft/25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-44 -z-10 h-72 w-72 rounded-full bg-rose-gold/15 blur-[110px]"
        />
        <PolaroidStrip />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-float-up text-center lg:text-left">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-beige bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Premium Dijital Düğün Asistanı
            </span>
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] sm:text-7xl lg:text-[5.5rem]">
              Düğününüzün her karesi
              <br />
              <span className="text-gold-gradient">tek bir havuzda.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0 mx-auto">
              Yüzlerce misafirin telefonundaki o eşsiz anlar kaybolmasın.
              Dijital davetiye, katılım yönetimi ve düğün boyunca akan canlı
              bir fotoğraf galerisi — hepsi bir arada, hepsi zahmetsiz.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <a
                href={WHATSAPP_LINK}
                className="inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-8 text-base font-medium text-white shadow-lg shadow-gold/25 transition-all hover:brightness-105 active:scale-[0.98] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp'tan Bilgi Al
              </a>
              <Link
                href="/ornek"
                className="inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-sand bg-white/70 px-8 text-base font-medium text-ink transition-all hover:bg-ivory active:scale-[0.98] sm:w-auto"
              >
                <Eye className="h-5 w-5 text-gold" />
                Örnek Davetiyeyi Gör
              </Link>
            </div>
            <p className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-ink-soft lg:justify-start">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-gold" /> Anahtar teslim kurulum
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-gold" /> Üyelik & uygulama yok
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-gold" /> Tek seferlik ödeme
              </span>
            </p>
          </div>

          {/* Telefon + TV mockup */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-soft/20 blur-3xl"
            />

            {/* TV/Projeksiyon (arkada) */}
            <div className="absolute -right-4 top-8 hidden h-52 w-72 rotate-3 rounded-2xl border-[10px] border-[#3b362f] bg-[#14110d] p-2 shadow-2xl xl:block">
              <div className="grid h-full grid-cols-3 gap-1.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://picsum.photos/seed/tv${i}/100/120)`,
                    }}
                  />
                ))}
              </div>
              <div className="-mb-2 mt-1 h-1 w-12 mx-auto rounded-full bg-[#3b362f]/60" />
            </div>

            {/* Telefon (önde) */}
            <div className="relative z-10 h-[490px] w-60 -rotate-6 rounded-[2.5rem] border-[12px] border-[#3b362f] bg-cream shadow-2xl shadow-gold/30">
              <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-[#3b362f]" />
              <div className="h-full w-full overflow-hidden rounded-[1.75rem]">
                <FauxInvitationPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Band */}
      <section className="border-y border-beige bg-white/60 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-7 gap-y-1.5 px-5 text-xs text-ink-soft sm:text-sm">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gold" /> KVKK uyumlu
          </span>
          <span className="flex items-center gap-1.5">
            <Moon className="h-3.5 w-3.5 text-gold" /> 7 gün sonra otomatik silme
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold" /> Avrupa veri merkezi
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Anahtar teslim
          </span>
        </div>
      </section>

      {/* Journey Strip */}
      <section className="mx-auto w-full max-w-5xl px-5 py-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Sipariş", icon: MessageCircle },
            { label: "Davetiye", icon: Heart },
            { label: "Düğün Günü", icon: QrCode },
            { label: "Anılar", icon: Images },
          ].map((s, i, arr) => (
            <div key={s.label} className="relative flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-beige bg-white/70 text-gold">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {s.label}
                </p>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="absolute -right-2 top-4 hidden h-4 w-4 text-gold/50 sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-md gold-divider" />

      {/* Nasıl Çalışır */}
      <section id="nasil" className="mx-auto w-full max-w-6xl px-5 py-20">
        <SectionHeading
          kicker="4 Basit Adım"
          title="Nasıl Çalışır?"
          subtitle="Sizin için tasarlanmış, baştan sona düşünülmüş bir deneyim."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="surface-card relative rounded-card p-7 transition-transform hover:-translate-y-1"
            >
              <span className="absolute right-5 top-5 font-serif text-5xl font-semibold text-beige">
                {i + 1}
              </span>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-gold">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Önce / Sonra */}
      <section className="bg-ivory/60 py-20">
        <div className="mx-auto w-full max-w-5xl px-5">
          <SectionHeading
            kicker="Karşılaştırma"
            title="Geleneksel yöntem vs. BiKareBırak"
            subtitle="Düğün fotoğraflarınızın gerçekten size kalması arasındaki fark."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-card border border-rose-200/70 bg-white/70 p-7">
              <p className="text-xs uppercase tracking-[0.25em] text-rose-gold">
                Geleneksel Yöntem
              </p>
              <h3 className="mt-2 font-serif text-2xl">Dağınık ve unutuluyor</h3>
              <ul className="mt-5 space-y-3">
                {before.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-ink-soft">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-gold" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-gold/40 bg-white p-7 shadow-lg shadow-gold/10">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                BiKareBırak ile
              </p>
              <h3 className="mt-2 font-serif text-2xl">Tek havuz, premium hissi</h3>
              <ul className="mt-5 space-y-3">
                {after.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sayısal istatistikler */}
      <section className="mx-auto w-full max-w-5xl px-5 py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-card border border-beige bg-white/70 p-7 text-center">
            <p className="text-5xl font-serif font-semibold text-gold-gradient">
              <StatCounter target={500} suffix="+" duration={1400} />
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              Düğün başına ortalama paylaşılan an
            </p>
          </div>
          <div className="rounded-card border border-beige bg-white/70 p-7 text-center">
            <p className="text-5xl font-serif font-semibold text-gold-gradient">
              <StatCounter prefix="%" target={99} duration={1400} />
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              Misafirin tek dokunuşta yükleme tamamlama oranı
            </p>
          </div>
          <div className="rounded-card border border-beige bg-white/70 p-7 text-center">
            <p className="text-5xl font-serif font-semibold text-gold-gradient">
              <StatCounter target={0} duration={1000} />
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              Uygulama indirme zorunluluğu
            </p>
          </div>
        </div>
      </section>

      {/* Mini Canlı Galeri Preview */}
      <section className="bg-[#0f0d0a] py-20">
        <div className="mx-auto w-full max-w-5xl px-5">
          <div className="text-center text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-gold-soft">
              Canlı Galeri
            </p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
              Düğün gecesi ekranınız böyle görünecek
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/60">
              Misafir QR'ı okutup foto yüklediği an, salondaki dev ekranınızda
              anılar büyümeye başlar.
            </p>
          </div>
          <div className="mt-10">
            <MiniGalleryPreview />
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section id="ozellikler" className="bg-ivory/60 py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <SectionHeading
            kicker="Neden BiKareBırak"
            title="Anılarınız hak ettiği özende"
            subtitle="Profesyonel fotoğrafçının kaçırdığı, misafirlerin kalbinde kalan anlar."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex gap-5 rounded-card border border-beige bg-white/70 p-7"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivory text-gold">
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{f.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Deep dive 3 section */}
          <div className="mt-20 space-y-16">
            <DeepDive
              kicker="Detaylı bakış"
              title="Canlı Galeri Nasıl Çalışır?"
              body="Çiftinizin slug'ı ile özelleştirilen galeri URL'i salondaki projeksiyona yansıtılır. Misafirler masadaki QR'dan foto yüklediğinde Firestore realtime ile galeri sayfa yenilenmeden kareyi gösterir. Üstelik 'slayt modu' ile yatay tam ekran otomatik döndürmeye geçilebilir."
              bullets={[
                "Anında akış — fotoğraf yüklendiği saniye galerinize düşer",
                "Slayt modu — 5 saniyede bir Ken Burns efekti",
                "Karanlık moda uyumlu zarif tasarım",
              ]}
              visual={
                <div className="aspect-video rounded-2xl border-8 border-[#3b362f] bg-[#14110d] p-3 shadow-xl">
                  <div className="grid h-full grid-cols-4 gap-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded bg-cover bg-center"
                        style={{
                          backgroundImage: `url(https://picsum.photos/seed/dv${i}/200/250)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              }
            />

            <DeepDive
              kicker="Misafir Akışı"
              title="QR Kurulumu ve Yükleme"
              body="Çiftinize özel ürettiğimiz QR kodları, baskıya hazır PDF olarak teslim ederiz. Çift bunları masalara yerleştirir. Misafir telefonun kamerasıyla okuttuğu an direkt yükleme ekranı açılır — tek butonla foto seçer, ilerleme çubuğu görünür, bitince konfeti animasyonu çıkar."
              bullets={[
                "iPhone HEIC fotoları otomatik JPEG'e dönüştürülür",
                "Tarayıcıda sıkıştırma ile yükleme 3-5x hızlanır",
                "Yüklenirken iletişim kesilirse, başarısız dosyalar tekrar denenir",
              ]}
              visual={
                <div className="mx-auto h-72 w-48 rounded-[2rem] border-8 border-[#3b362f] bg-cream p-4 shadow-xl">
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <Camera className="h-12 w-12 text-gold" />
                    <p className="font-serif text-base text-ink">
                      Fotoğraf Yükle
                    </p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-beige">
                      <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-gold to-rose-gold" />
                    </div>
                    <p className="text-[10px] text-ink-soft">3 / 4 fotoğraf</p>
                  </div>
                </div>
              }
              reverse
            />

            <DeepDive
              kicker="Güvenlik & Saklama"
              title="7 Gün Otomatik Saklama"
              body="Misafirlerin yüklediği her foto, yükleme zamanından itibaren 7 gün galeride durur. Bu sürede çift, kendi paneline girip tüm fotoğrafları ZIP olarak indirebilir. 7. günün sonunda otomatik temizlik servisi devreye girer — bu sayede gizliliğiniz korunur, bandwidth düşük tutulur, fiyat sabit kalır."
              bullets={[
                "Her fotoğrafın kendi expire damgası var — aynı hafta 5 düğüne hizmet etsek bile karışmaz",
                "Çift ZIP'i indirmeyi unutursa, son 24 saatte hatırlatma mesajı atarız",
                "Gerekirse '30 günlük arşiv' eklemesi alabilirsiniz",
              ]}
              visual={
                <div className="rounded-card border border-beige bg-white p-6 shadow-lg">
                  <p className="mb-3 text-xs uppercase tracking-widest text-gold">
                    Saklama Takvimi
                  </p>
                  {[1, 3, 5, 7].map((d, i) => (
                    <div key={d} className="flex items-center gap-3 py-1.5">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ivory font-serif text-sm text-gold">
                        {d}
                      </span>
                      <span className="text-sm text-ink">
                        {i === 0 && "Misafir foto yüklüyor"}
                        {i === 1 && "Galeri canlı akıyor"}
                        {i === 2 && "Çift ZIP'i indiriyor"}
                        {i === 3 && "Otomatik silme"}
                      </span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* Sosyal Kanıt - Testimonials */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <SectionHeading
          kicker="Erken kullanıcılarımızdan"
          title="Çiftlerimiz ne söylüyor"
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="surface-card rounded-card p-7"
            >
              <Quote className="h-8 w-8 text-gold/40" />
              <div className="mt-3 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-gold"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="mt-3 leading-relaxed text-ink">
                “{t.quote}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} font-medium`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.when}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fiyat */}
      <section id="fiyat" className="bg-ivory/60 py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <SectionHeading
            kicker="Şeffaf Fiyat"
            title="Tek seferlik, sürprizsiz"
            subtitle="Aylık abonelik yok, gizli ücret yok. Düğününüz için tek ödeme."
          />

          <p className="mt-6 text-center text-sm text-ink-soft">
            Ürünü canlı görmek mi istiyorsunuz?{" "}
            <Link
              href="/ornek"
              className="font-medium text-gold underline decoration-gold/40 hover:text-rose-gold"
            >
              Örnek davetiyemizi inceleyin →
            </Link>
          </p>

          <div className="mx-auto mt-12 max-w-lg">
            <div className="relative overflow-hidden rounded-card border border-sand bg-white/80 p-8 shadow-xl shadow-gold/10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-soft/20 blur-3xl"
              />
              <p className="text-sm uppercase tracking-[0.2em] text-gold">
                Anahtar Teslim Paket
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-serif text-6xl font-semibold">5.000</span>
                <span className="mb-2 text-2xl text-ink-soft">₺</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                Düğün başına tek ödeme · KDV dahil
              </p>

              <div className="my-7 gold-divider" />

              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-ink">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={WHATSAPP_LINK}
                className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] text-base font-medium text-white shadow-lg shadow-gold/25 transition-all hover:brightness-105 active:scale-[0.98]"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp'tan Satın Al
              </a>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
                <Clock className="h-3.5 w-3.5" />
                Genellikle aynı gün kurulum
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor / Partnerler */}
      <section className="mx-auto w-full max-w-6xl px-5">
        <VendorStrip
          title="Düğün Hazırlıklarınızda Ortaklarımız"
          subtitle="BiKareBırak'ın seçtiği güvenilir vendor'lar. Tek tıkla web sitelerine ulaşın."
          limit={8}
        />
        <div className="mb-12 -mt-6 text-center">
          <Link
            href="/partnerler"
            className="inline-flex items-center gap-1.5 text-sm text-gold underline decoration-gold/40 hover:text-rose-gold"
          >
            Tüm partnerlerimizi gör →
          </Link>
        </div>
      </section>

      {/* About / Hikayemiz */}
      <section className="mx-auto w-full max-w-4xl px-5 py-20">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto_2fr]">
          <Heart className="hidden h-20 w-20 text-rose-gold md:block" fill="currentColor" />
          <div className="hidden h-32 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:block" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Hikayemiz
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Bir karenizi bile kaçırmamak için
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Yıllar önce kendi düğünümüzde misafirlerin telefonunda kalan
              yüzlerce güzel fotoğrafı toplamaya çalışırken WhatsApp gruplarının
              ne kadar kaotik olduğunu gördük. O gün BiKareBırak fikri doğdu:
              herkesin paylaşabildiği, çiftin tek dosya olarak indirebildiği,
              salonda da canlı olarak izlenen bir foto havuzu.
            </p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Bugün düğün hazırlığı yapan çiftlere "premium ama sade" bir
              deneyim sunuyoruz — kurulum bizden, hatırlanan anlar sizden.
            </p>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="bg-ivory/60 py-20">
        <div className="mx-auto w-full max-w-2xl px-5">
          <SectionHeading kicker="SSS" title="Merak edilenler" />
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-beige bg-white/70 p-5 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 font-medium text-ink list-none">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#3b362f] to-[#5a5046] px-8 py-16 text-center text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl"
          />
          <QrCode className="mx-auto h-10 w-10 text-gold-soft" />
          <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
            Bir karenizi bile kaçırmayın
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/70">
            Düğününüz tek bir gün. O günün tüm anlarını sonsuza dek saklayın.
          </p>
          <a
            href={WHATSAPP_LINK}
            className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-medium text-ink transition-all hover:bg-ivory active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            Hemen WhatsApp'tan Yazın
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-beige py-10 text-center text-sm text-ink-soft">
        <p className="font-serif text-2xl text-gold-gradient">BiKareBırak</p>
        <p className="mt-2 flex items-center justify-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> Türkiye'nin dört bir yanında
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <Link href="/ornek" className="hover:text-ink">
            Örnek davetiye
          </Link>
          <span className="text-beige">·</span>
          <a href={WHATSAPP_LINK} className="hover:text-ink">
            İletişim
          </a>
        </div>
        <p className="mt-4 text-xs text-ink-soft/70">
          © {new Date().getFullYear()} BiKareBırak · Tüm hakları saklıdır
        </p>
      </footer>

      {/* Mobil sticky CTA */}
      <MobileStickyCTA href={WHATSAPP_LINK} />
    </main>
  );
}

function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-gold">{kicker}</p>
      <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">{subtitle}</p>
      )}
    </div>
  );
}

function DeepDive({
  kicker,
  title,
  body,
  bullets,
  visual,
  reverse,
}: {
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{kicker}</p>
        <h3 className="mt-3 font-serif text-3xl">{title}</h3>
        <p className="mt-4 leading-relaxed text-ink-soft">{body}</p>
        <ul className="mt-5 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}
