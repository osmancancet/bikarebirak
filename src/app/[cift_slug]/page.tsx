import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoupleBySlug, getGuestMessages } from "@/lib/queries";
import { formatWeddingDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";
import { ProgramTimeline } from "@/components/ProgramTimeline";
import { StoryTimeline } from "@/components/StoryTimeline";
import { GuestBook } from "@/components/GuestBook";
import { GuestBookForm } from "@/components/GuestBookForm";
import { ShareButton } from "@/components/ShareButton";
import { MusicPlayer } from "@/components/MusicPlayer";
import { EngagementCarousel } from "@/components/EngagementCarousel";
import { InstallPrompt } from "@/components/InstallPrompt";
import {
  MapPin,
  Calendar,
  Camera,
  Images,
  Sparkles,
  BookHeart,
  ListChecks,
  Hourglass,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cift_slug: string }>;
}): Promise<Metadata> {
  const { cift_slug } = await params;
  const couple = await getCoupleBySlug(cift_slug);
  if (!couple) return { title: "Davetiye bulunamadı" };

  const title = `${couple.bride_name} & ${couple.groom_name} — Düğün Davetiyesi`;
  const description =
    couple.welcome_message ?? `${couple.venue_name} · Düğün davetiyesi`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const ogImage = `${baseUrl}/api/og/${cift_slug}`;
  const pageUrl = `${baseUrl}/${cift_slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      locale: "tr_TR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ cift_slug: string }>;
}) {
  const { cift_slug } = await params;
  const couple = await getCoupleBySlug(cift_slug);
  if (!couple) notFound();

  const initialMessages = await getGuestMessages(couple.id, 30);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const shareUrl = `${baseUrl}/${couple.slug}`;

  const theme = couple.theme ?? "classic-gold";
  const filterClass =
    couple.cover_filter && couple.cover_filter !== "none"
      ? `cover-filter-${couple.cover_filter}`
      : "";

  return (
    <main
      data-theme={theme}
      className="relative flex flex-1 flex-col items-center bg-[var(--background)] px-6 py-14"
    >
      {/* Nişan fotoları carousel veya tek kapak; ikisi de yoksa altın gradient */}
      <div className={filterClass}>
        <EngagementCarousel
          photos={couple.engagement_photos ?? []}
          fallbackUrl={couple.cover_image_url}
        />
      </div>

      {/* Paylaş butonu — sağ üst */}
      <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
        <ShareButton
          title={`${couple.bride_name} & ${couple.groom_name} — Düğün Davetiyesi`}
          url={shareUrl}
        />
      </div>

      {/* Hero */}
      <header className="flex flex-col items-center text-center animate-float-up">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">
          Evleniyoruz
        </p>
        <h1 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-6xl md:text-7xl">
          {couple.bride_name}
          <span className="mx-3 text-gold-gradient">&amp;</span>
          {couple.groom_name}
        </h1>
        <div className="my-6 h-px w-40 gold-divider" />
        <p className="flex items-center gap-2 text-lg text-ink-soft">
          <Calendar className="h-4 w-4 text-gold" />
          {formatWeddingDate(couple.wedding_date)}
        </p>
      </header>

      {/* Geri sayım */}
      <section className="mt-10 w-full max-w-md">
        <Countdown targetIso={couple.wedding_date} />
      </section>

      {/* Karşılama metni */}
      {couple.welcome_message && (
        <p className="mt-10 max-w-lg text-center font-serif text-xl leading-relaxed text-ink-soft italic">
          “{couple.welcome_message}”
        </p>
      )}

      {/* Mekan */}
      <Card className="mt-10 w-full max-w-md p-7 text-center">
        <MapPin className="mx-auto h-6 w-6 text-gold" />
        <h2 className="mt-3 text-2xl font-medium">{couple.venue_name}</h2>
        {couple.venue_maps_url && (
          <a
            href={couple.venue_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sand bg-white/60 px-4 py-2 text-sm text-ink transition-colors hover:bg-ivory"
          >
            <MapPin className="h-4 w-4" />
            Haritada Aç
          </a>
        )}
      </Card>

      {/* Kıyafet kodu */}
      {couple.dress_code && (
        <div className="mt-4 flex max-w-md items-center gap-3 rounded-full border border-beige bg-white/60 px-5 py-3 text-sm">
          <Sparkles className="h-4 w-4 shrink-0 text-gold" />
          <span className="text-ink-soft">
            <span className="font-medium text-ink">Kıyafet Kodu:</span>{" "}
            {couple.dress_code}
          </span>
        </div>
      )}

      {/* Bizim Hikayemiz */}
      {couple.story_items && couple.story_items.length > 0 && (
        <Card className="mt-6 w-full max-w-md p-7">
          <h2 className="mb-5 flex items-center justify-center gap-2 text-center font-serif text-2xl">
            <Hourglass className="h-5 w-5 text-gold" />
            Bizim Hikayemiz
          </h2>
          <StoryTimeline items={couple.story_items} />
        </Card>
      )}

      {/* Program */}
      {couple.program_items && couple.program_items.length > 0 && (
        <Card className="mt-6 w-full max-w-md p-7">
          <h2 className="mb-5 flex items-center justify-center gap-2 text-center font-serif text-2xl">
            <ListChecks className="h-5 w-5 text-gold" />
            Düğün Günü Programı
          </h2>
          <ProgramTimeline items={couple.program_items} />
        </Card>
      )}

      {/* LCV */}
      <Card className="mt-6 w-full max-w-md p-7">
        <h2 className="mb-1 text-center font-serif text-2xl">Katılım Durumu</h2>
        <p className="mb-5 text-center text-sm text-ink-soft">
          Lütfen bizimle paylaşın, mutluluğunuza ortak olalım.
        </p>
        <RsvpForm coupleId={couple.id} />
      </Card>

      {/* Anı Defteri */}
      <section className="mt-10 w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="flex items-center justify-center gap-2 font-serif text-2xl">
            <BookHeart className="h-5 w-5 text-gold" />
            Anı Defteri
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Çiftin size özel bir dileğini bırakın
          </p>
        </div>
        <Card className="p-6">
          <GuestBookForm coupleId={couple.id} />
        </Card>
        <GuestBook coupleId={couple.id} initialMessages={initialMessages} />
      </section>

      {/* Yükleme & Galeri kısayolları */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/${couple.slug}/yukle`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-sand bg-white/60 px-6 text-sm font-medium text-ink transition-colors hover:bg-ivory"
        >
          <Camera className="h-4 w-4 text-gold" />
          Fotoğraf Yükle
        </Link>
        <Link
          href={`/${couple.slug}/galeri`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-sand bg-white/60 px-6 text-sm font-medium text-ink transition-colors hover:bg-ivory"
        >
          <Images className="h-4 w-4 text-gold" />
          Canlı Galeri
        </Link>
      </div>

      <footer className="mt-14 text-center text-xs text-ink-soft">
        <span className="font-serif text-gold-gradient">BiKareBırak</span> ile
        hazırlanmıştır.
      </footer>

      {/* Müzik player — sağ alt sabit */}
      {couple.music_url && (
        <MusicPlayer url={couple.music_url} label={couple.music_label} />
      )}

      {/* PWA install promo */}
      <InstallPrompt />
    </main>
  );
}
