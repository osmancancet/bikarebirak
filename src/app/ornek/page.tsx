import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Countdown } from "@/components/Countdown";
import { ProgramTimeline } from "@/components/ProgramTimeline";
import { StoryTimeline } from "@/components/StoryTimeline";
import { EngagementCarousel } from "@/components/EngagementCarousel";
import {
  MapPin,
  Calendar,
  Camera,
  Images,
  Sparkles,
  BookHeart,
  ListChecks,
  Hourglass,
  Heart,
  ArrowLeft,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Örnek Davetiye — BiKareBırak",
  description: "BiKareBırak ile hazırlanabilecek bir örnek düğün davetiyesi.",
  robots: { index: false, follow: true },
};

// Demo veri — sahte çift "Aslı & Mert"
const DEMO = {
  groom_name: "Mert",
  bride_name: "Aslı",
  wedding_date: new Date(Date.now() + 60 * 86400 * 1000).toISOString(),
  venue_name: "Sait Halim Paşa Yalısı, İstanbul",
  venue_maps_url: "https://maps.google.com/?q=Sait+Halim+Pasa+Yalisi",
  welcome_message:
    "Mutluluğumuzu sizlerle paylaşmaktan onur duyarız. Sizleri aramızda görmek bizim için çok kıymetli.",
  dress_code: "Smart Casual · Beyazdan kaçınılması rica olunur",
  program_items: [
    { time: "17:30", label: "Misafir Kabulü" },
    { time: "18:00", label: "Nikah Töreni" },
    { time: "19:00", label: "Kokteyl & Müzik" },
    { time: "20:30", label: "Akşam Yemeği" },
    { time: "22:30", label: "Pasta Kesimi" },
  ],
  story_items: [
    {
      date: "2018-09",
      title: "Tanıştık",
      description: "Karaköy'de küçük bir kahvecide.",
    },
    {
      date: "2021-07",
      title: "Birlikte yaşamaya başladık",
      description: null,
    },
    {
      date: "2024-12",
      title: "Nişanlandık",
      description: "Boğaz'da gün batımında.",
    },
  ],
  engagement_photos: [
    "https://picsum.photos/seed/demoCouple1/1200/800",
    "https://picsum.photos/seed/demoCouple2/1200/800",
    "https://picsum.photos/seed/demoCouple3/1200/800",
  ],
};

const DEMO_MESSAGES = [
  {
    name: "Selin Yılmaz",
    msg: "Mutluluğunuz hiç eksilmesin, çok güzel bir yolculuğa adım atıyorsunuz.",
  },
  {
    name: "Cem Aksoy",
    msg: "Sizi sevenler olarak gururluyuz! Ömür boyu sevgi ve neşe diliyoruz.",
  },
  {
    name: "Defne Kara",
    msg: "Beraber yazacağınız her satır harika olsun.",
  },
];

export default function OrnekPage() {
  return (
    <main className="relative flex flex-1 flex-col items-center bg-cream px-6 py-14">
      {/* Üst bilgi şeridi */}
      <div className="fixed left-3 top-3 z-40 flex items-center gap-2 rounded-full border border-beige bg-white/80 px-4 py-1.5 text-xs text-ink-soft shadow-sm backdrop-blur sm:left-6 sm:top-6">
        <Lock className="h-3 w-3 text-gold" />
        Bu bir örnek davetiyedir.{" "}
        <Link href="/" className="text-gold underline">
          Ana sayfa
        </Link>
      </div>

      {/* Nişan carousel */}
      <EngagementCarousel
        photos={DEMO.engagement_photos}
        intervalSeconds={5}
      />

      <header className="flex flex-col items-center text-center animate-float-up">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">
          Evleniyoruz
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-7xl">
          {DEMO.groom_name}
          <span className="mx-3 text-gold-gradient">&amp;</span>
          {DEMO.bride_name}
        </h1>
        <div className="my-6 h-px w-40 gold-divider" />
        <p className="flex items-center gap-2 text-lg text-ink-soft">
          <Calendar className="h-4 w-4 text-gold" />
          {new Intl.DateTimeFormat("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long",
          }).format(new Date(DEMO.wedding_date))}
        </p>
      </header>

      <section className="mt-10 w-full max-w-md">
        <Countdown targetIso={DEMO.wedding_date} />
      </section>

      <p className="mt-10 max-w-lg text-center font-serif text-xl leading-relaxed text-ink-soft italic">
        “{DEMO.welcome_message}”
      </p>

      <Card className="mt-10 w-full max-w-md p-7 text-center">
        <MapPin className="mx-auto h-6 w-6 text-gold" />
        <h2 className="mt-3 text-2xl font-medium">{DEMO.venue_name}</h2>
        <a
          href={DEMO.venue_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sand bg-white/60 px-4 py-2 text-sm text-ink transition-colors hover:bg-ivory"
        >
          <MapPin className="h-4 w-4" />
          Haritada Aç
        </a>
      </Card>

      <div className="mt-4 flex max-w-md items-center gap-3 rounded-full border border-beige bg-white/60 px-5 py-3 text-sm">
        <Sparkles className="h-4 w-4 shrink-0 text-gold" />
        <span className="text-ink-soft">
          <span className="font-medium text-ink">Kıyafet Kodu:</span>{" "}
          {DEMO.dress_code}
        </span>
      </div>

      <Card className="mt-6 w-full max-w-md p-7">
        <h2 className="mb-5 flex items-center justify-center gap-2 text-center font-serif text-2xl">
          <Hourglass className="h-5 w-5 text-gold" />
          Bizim Hikayemiz
        </h2>
        <StoryTimeline items={DEMO.story_items} />
      </Card>

      <Card className="mt-6 w-full max-w-md p-7">
        <h2 className="mb-5 flex items-center justify-center gap-2 text-center font-serif text-2xl">
          <ListChecks className="h-5 w-5 text-gold" />
          Düğün Günü Programı
        </h2>
        <ProgramTimeline items={DEMO.program_items} />
      </Card>

      {/* LCV - statik gösterim, form yok */}
      <Card className="mt-6 w-full max-w-md p-7 text-center">
        <h2 className="mb-1 text-center font-serif text-2xl">Katılım Durumu</h2>
        <p className="mb-5 text-center text-sm text-ink-soft">
          Lütfen bizimle paylaşın, mutluluğumuza ortak olalım.
        </p>
        <div className="rounded-2xl border border-dashed border-gold/30 bg-ivory/40 p-6 text-sm text-ink-soft">
          <Heart className="mx-auto mb-2 h-6 w-6 text-rose-gold" fill="currentColor" />
          Gerçek davetiyede burada misafirlerinizin <strong>Ad Soyad</strong>,{" "}
          <strong>Evet/Hayır</strong> ve <strong>Kişi Sayısı</strong> seçtiği
          şık bir form yer alır. Bildirimler çiftin paneline anlık düşer.
        </div>
      </Card>

      {/* Anı Defteri — statik */}
      <section className="mt-10 w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="flex items-center justify-center gap-2 font-serif text-2xl">
            <BookHeart className="h-5 w-5 text-gold" />
            Anı Defteri
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Örnek mesajlar — misafirler dilek bırakır
          </p>
        </div>
        <div className="space-y-3">
          {DEMO_MESSAGES.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-beige bg-white/70 p-4"
            >
              <p className="text-sm font-medium text-ink">{m.name}</p>
              <p className="mt-1 font-serif italic text-ink-soft">
                “{m.msg}”
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <div className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-dashed border-sand bg-white/40 px-6 text-sm text-ink-soft">
          <Camera className="h-4 w-4 text-gold" />
          Fotoğraf Yükle (demo)
        </div>
        <div className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-dashed border-sand bg-white/40 px-6 text-sm text-ink-soft">
          <Images className="h-4 w-4 text-gold" />
          Canlı Galeri (demo)
        </div>
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Ana sayfaya dön
      </Link>

      <footer className="mt-8 text-center text-xs text-ink-soft">
        <span className="font-serif text-gold-gradient">BiKareBırak</span> ile
        hazırlanmıştır.
      </footer>
    </main>
  );
}
