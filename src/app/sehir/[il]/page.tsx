import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES } from "@/data/cities";
import { VendorStrip } from "@/components/VendorStrip";
import {
  ArrowLeft,
  MessageCircle,
  Eye,
  Check,
  MapPin,
} from "lucide-react";

export const dynamic = "force-static";

export function generateStaticParams() {
  return CITIES.map((c) => ({ il: c.slug }));
}

const WHATSAPP_LINK = `https://wa.me/905548364486?text=${encodeURIComponent(
  "Merhaba, BiKareBırak hakkında bilgi almak istiyorum."
)}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ il: string }>;
}): Promise<Metadata> {
  const { il } = await params;
  const city = CITIES.find((c) => c.slug === il);
  if (!city) return { title: "Şehir bulunamadı" };
  return {
    title: `${city.name} Düğün — Dijital Davetiye | BiKareBırak`,
    description: `${city.name}'da düğün için dijital davetiye, LCV yönetimi ve canlı fotoğraf galerisi. Anahtar teslim 5.000 ₺.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ il: string }>;
}) {
  const { il } = await params;
  const city = CITIES.find((c) => c.slug === il);
  if (!city) notFound();

  return (
    <main className="flex flex-1 flex-col px-5 py-14">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Ana sayfa
        </Link>

        <header className="mt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-sm uppercase tracking-[0.3em] text-gold">
            <MapPin className="h-4 w-4" />
            {city.name}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl">
            {city.name}'da Düğün için
            <br />
            <span className="text-gold-gradient">Dijital Davetiye & Galeri</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {city.description}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={WHATSAPP_LINK}
              className="inline-flex h-13 items-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-7 text-sm font-medium text-white shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp'tan Bilgi Al
            </a>
            <Link
              href="/ornek"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-sand bg-white/70 px-7 text-sm font-medium text-ink"
            >
              <Eye className="h-4 w-4 text-gold" />
              Örnek Davetiye
            </Link>
          </div>
        </header>

        {city.popular_venues && city.popular_venues.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-3xl">
              {city.name}'da Popüler Mekanlar
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              BiKareBırak bu mekanların düğünlerinde aktif olarak kullanılıyor.
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {city.popular_venues.map((v) => (
                <li
                  key={v}
                  className="flex items-center gap-2 rounded-xl border border-beige bg-white/60 px-4 py-3 text-sm text-ink"
                >
                  <Check className="h-4 w-4 text-gold" />
                  {v}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-center font-serif text-3xl">
            {city.name}'da BiKareBırak Ortakları
          </h2>
          <VendorStrip city={city.name} limit={8} />
        </section>

        <section className="mt-16 rounded-card border border-beige bg-ivory/60 p-10 text-center">
          <h2 className="font-serif text-3xl">
            {city.name}'da düğününüz için 5.000 ₺
          </h2>
          <p className="mt-3 text-ink-soft">
            Anahtar teslim kurulum, dijital davetiye, LCV yönetimi ve canlı
            fotoğraf galerisi.
          </p>
          <a
            href={WHATSAPP_LINK}
            className="mt-6 inline-flex h-13 items-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-7 text-sm font-medium text-white shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            Hemen Yazın
          </a>
        </section>

        <div className="mt-16 flex flex-wrap justify-center gap-2 text-xs">
          <span className="text-ink-soft">Diğer şehirler:</span>
          {CITIES.filter((c) => c.slug !== il).map((c) => (
            <Link
              key={c.slug}
              href={`/sehir/${c.slug}`}
              className="rounded-full bg-white/60 px-3 py-1 text-ink-soft hover:bg-ivory"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
