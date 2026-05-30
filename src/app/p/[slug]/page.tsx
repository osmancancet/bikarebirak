import type { Metadata } from "next";
import Link from "next/link";
import { ensurePortalAccess } from "@/lib/portal";
import { getRsvps, getPhotoCount, getGuestMessages } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Countdown } from "@/components/Countdown";
import { InviteShareCard } from "@/components/InviteShareCard";
import { formatWeddingDate } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Check,
  X,
  Users,
  Image as ImageIcon,
  Download,
  FileDown,
  Images,
  BookHeart,
  Pencil,
  Star,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Portal — ${slug}` };
}

export default async function CouplePortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;
  const couple = await ensurePortalAccess(slug, key, `/p/${slug}`);

  const [rsvps, photoCount, guestMessages] = await Promise.all([
    getRsvps(couple.id),
    getPhotoCount(couple.id),
    getGuestMessages(couple.id, 20),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const inviteUrl = `${baseUrl}/${couple.slug}`;

  const attending = rsvps.filter((r) => r.attending);
  const notAttending = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((s, r) => s + r.guest_count, 0);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex justify-end">
          <Link
            href={`/p/${couple.slug}/duzenle`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-sand bg-white/70 px-5 text-sm font-medium text-ink transition-colors hover:bg-ivory"
          >
            <Pencil className="h-4 w-4 text-gold" />
            Düzenle
          </Link>
        </div>

        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Çiftin Özel Paneli
          </p>
          <h1 className="mt-3 font-serif text-5xl">
            {couple.groom_name} <span className="text-gold-gradient">&amp;</span>{" "}
            {couple.bride_name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gold" />
              {formatWeddingDate(couple.wedding_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold" />
              {couple.venue_name}
            </span>
          </div>
        </header>

        {/* Geri sayım */}
        <section className="mx-auto w-full max-w-md">
          <Countdown targetIso={couple.wedding_date} />
        </section>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Check} label="Katılıyor" value={attending.length} />
          <StatCard icon={Users} label="Toplam Kişi" value={totalGuests} />
          <StatCard icon={X} label="Gelemiyor" value={notAttending.length} />
          <StatCard icon={ImageIcon} label="Fotoğraf" value={photoCount} />
        </div>

        {/* Aksiyon kartları */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="flex flex-col items-start gap-4 p-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-gold">
              <Download className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium">Tüm Fotoğrafları İndir</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Misafirlerin yüklediği tüm fotoğraflar tek ZIP dosyasında.
                Fotoğraflar 7 gün sonra silinir; düğün sonrası bu dosyayı mutlaka
                bilgisayarınıza indirin.
              </p>
            </div>
            <a
              href={`/api/p/${couple.slug}/zip`}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-6 text-sm font-medium text-white shadow-md transition-all hover:brightness-105"
            >
              <Download className="h-4 w-4" />
              {photoCount > 0 ? `ZIP indir (${photoCount} foto)` : "Henüz foto yok"}
            </a>
          </Card>

          <Card className="flex flex-col items-start gap-4 p-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-gold">
              <FileDown className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium">LCV Listesi (CSV)</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Tüm katılım bildirimleri Excel'de açılabilen bir dosya olarak.
                Düğün organizasyonuyla paylaşabilirsiniz.
              </p>
            </div>
            <a
              href={`/api/p/${couple.slug}/rsvp.csv`}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-sand bg-white px-6 text-sm font-medium text-ink transition-colors hover:bg-ivory"
            >
              <FileDown className="h-4 w-4" />
              CSV indir
            </a>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href={`/${couple.slug}/galeri`} className="block">
            <Card className="flex h-full items-center justify-between p-6 transition-colors hover:bg-ivory">
              <div className="flex items-center gap-3">
                <Images className="h-6 w-6 text-gold" />
                <div>
                  <h3 className="text-lg font-medium">Canlı Galeri</h3>
                  <p className="text-sm text-ink-soft">
                    Tüm fotoğrafları gör, slayt moduna geç
                  </p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href={`/p/${couple.slug}/favoriler`} className="block">
            <Card className="flex h-full items-center justify-between p-6 transition-colors hover:bg-ivory">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-gold" fill="currentColor" />
                <div>
                  <h3 className="text-lg font-medium">
                    Favoriler ({couple.favorite_photo_ids?.length ?? 0})
                  </h3>
                  <p className="text-sm text-ink-soft">
                    Galeriden seçtiğin en sevdiklerini topla
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <a
          href={`/api/p/${couple.slug}/album.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="flex items-center justify-between p-6 transition-colors hover:bg-ivory">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-gold" />
              <div>
                <h3 className="text-lg font-medium">PDF Foto Albümü</h3>
                <p className="text-sm text-ink-soft">
                  Favoriler ya da son 100 foto · A4 baskıya hazır PDF
                </p>
              </div>
            </div>
            <Download className="h-5 w-5 text-ink-soft" />
          </Card>
        </a>

        {/* Davetiye paylaşım şablonu */}
        <InviteShareCard
          coupleLabel={`${couple.bride_name} & ${couple.groom_name}`}
          inviteUrl={inviteUrl}
          title="Misafirlerinize Davetiye Gönderin"
          subtitle="WhatsApp Web/iOS uygulamasını açar; kontağı seçip gönderirsiniz."
        />

        {/* LCV listesi özeti */}
        <section>
          <h2 className="mb-4 text-2xl font-medium">
            LCV Listesi ({rsvps.length})
          </h2>
          {rsvps.length === 0 ? (
            <Card className="p-8 text-center text-ink-soft">
              Henüz katılım bildirimi yok.
            </Card>
          ) : (
            <Card className="divide-y divide-beige overflow-hidden">
              {rsvps.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div>
                    <p className="font-medium">{r.full_name}</p>
                    {r.attending && (
                      <p className="text-sm text-ink-soft">
                        {r.guest_count} kişi
                      </p>
                    )}
                  </div>
                  {r.attending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      <Check className="h-3.5 w-3.5" /> Katılıyor
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-gold">
                      <X className="h-3.5 w-3.5" /> Gelemiyor
                    </span>
                  )}
                </div>
              ))}
            </Card>
          )}
        </section>

        {/* Anı Defteri Mesajları */}
        {guestMessages.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-medium">
              <BookHeart className="h-5 w-5 text-gold" />
              Anı Defteri Mesajları ({guestMessages.length})
            </h2>
            <Card className="divide-y divide-beige overflow-hidden">
              {guestMessages.map((m) => (
                <div key={m.id} className="px-5 py-4">
                  <p className="text-sm font-medium">{m.full_name}</p>
                  <p className="mt-1 whitespace-pre-wrap font-serif italic text-ink-soft">
                    “{m.message}”
                  </p>
                </div>
              ))}
            </Card>
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card className="p-5">
      <Icon className="h-5 w-5 text-gold" />
      <p className="mt-2 text-3xl font-medium">{value}</p>
      <p className="text-sm text-ink-soft">{label}</p>
    </Card>
  );
}
