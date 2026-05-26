import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoupleBySlug } from "@/lib/queries";
import { formatWeddingDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";
import { MapPin, Calendar, Camera, Images } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cift_slug: string }>;
}): Promise<Metadata> {
  const { cift_slug } = await params;
  const couple = await getCoupleBySlug(cift_slug);
  if (!couple) return { title: "Davetiye bulunamadı" };
  return {
    title: `${couple.groom_name} & ${couple.bride_name} — Düğün Davetiyesi`,
    description: couple.welcome_message ?? `${couple.venue_name} · Düğün davetiyesi`,
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

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-14">
      {/* Hero */}
      <header className="flex flex-col items-center text-center animate-float-up">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">
          Evleniyoruz
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-7xl">
          {couple.groom_name}
          <span className="mx-3 text-gold-gradient">&amp;</span>
          {couple.bride_name}
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

      {/* LCV */}
      <Card className="mt-6 w-full max-w-md p-7">
        <h2 className="mb-1 text-center font-serif text-2xl">Katılım Durumu</h2>
        <p className="mb-5 text-center text-sm text-ink-soft">
          Lütfen bizimle paylaşın, mutluluğunuza ortak olalım.
        </p>
        <RsvpForm coupleId={couple.id} />
      </Card>

      {/* Yükleme & Galeri kısayolları */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
    </main>
  );
}
