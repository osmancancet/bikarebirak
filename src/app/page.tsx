import Link from "next/link";
import { Camera, Heart, QrCode, MessageCircle, Sparkles } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Dijital Davetiye & LCV",
    desc: "Şık davetiye sayfası, geri sayım ve tek dokunuşla katılım bildirimi.",
  },
  {
    icon: QrCode,
    title: "QR ile Anında Erişim",
    desc: "Masadaki QR'ı okutan misafir, saniyeler içinde fotoğraf yükleme ekranında.",
  },
  {
    icon: Camera,
    title: "Tek Fotoğraf Havuzu",
    desc: "Üyelik, şifre, uygulama yok. Herkesin çektiği her kare tek bir yerde toplanır.",
  },
  {
    icon: Sparkles,
    title: "Canlı Galeri",
    desc: "Düğün ekranına yansıyan galeri, yeni fotoğraflarla anında güncellenir.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pt-24 pb-20 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-beige bg-white/60 px-4 py-1.5 text-xs font-medium tracking-widest text-ink-soft uppercase">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          Premium Dijital Düğün Asistanı
        </span>
        <h1 className="max-w-3xl text-5xl leading-tight font-semibold sm:text-6xl">
          Düğününüzün her karesi
          <br />
          <span className="text-gold-gradient">tek bir havuzda.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          Dijital davetiye, katılım yönetimi ve misafirlerinizin çektiği tüm
          fotoğraflar için canlı galeri. Hepsi bir arada, hepsi zahmetsiz.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/905555555555?text=Merhaba%2C%20BiKareB%C4%B1rak%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-8 text-base font-medium text-white shadow-md transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp'tan Bilgi Al
          </a>
          <Link
            href="/admin"
            className="inline-flex h-14 items-center justify-center rounded-full border border-sand bg-white/60 px-8 text-base font-medium text-ink transition-all hover:bg-ivory active:scale-[0.98]"
          >
            Yönetici Girişi
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          Anahtar teslim kurulum · 2.500 ₺ · Satın alım WhatsApp üzerinden
        </p>
      </section>

      <div className="mx-auto w-full max-w-md gold-divider" />

      {/* Özellikler */}
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-6 py-20 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="surface-card rounded-card p-7 transition-transform hover:-translate-y-1"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-gold">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-medium">{title}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{desc}</p>
          </div>
        ))}
      </section>

      <footer className="mt-auto border-t border-beige py-8 text-center text-sm text-ink-soft">
        <p className="font-serif text-lg text-gold-gradient">BiKareBırak</p>
        <p className="mt-1">Bir karenizi bile kaçırmayın.</p>
      </footer>
    </main>
  );
}
