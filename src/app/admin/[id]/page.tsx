import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoupleById, getRsvps, getPhotoCount } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { formatWeddingDate } from "@/lib/utils";
import { QrPanel } from "./QrPanel";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Check,
  X,
  Image as ImageIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoupleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const couple = await getCoupleById(id);
  if (!couple) notFound();

  const [rsvps, photoCount] = await Promise.all([
    getRsvps(id),
    getPhotoCount(id),
  ]);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const attending = rsvps.filter((r) => r.attending);
  const notAttending = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((s, r) => s + r.guest_count, 0);

  return (
    <div className="space-y-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm çiftler
      </Link>

      <header>
        <h1 className="text-4xl font-medium">
          {couple.groom_name} & {couple.bride_name}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatWeddingDate(couple.wedding_date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {couple.venue_name}
          </span>
        </div>
      </header>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Check} label="Katılıyor" value={attending.length} />
        <StatCard icon={Users} label="Toplam Kişi" value={totalGuests} />
        <StatCard icon={X} label="Gelemiyor" value={notAttending.length} />
        <StatCard icon={ImageIcon} label="Fotoğraf" value={photoCount} />
      </div>

      {/* QR Kodlar */}
      <section>
        <h2 className="mb-4 text-2xl font-medium">QR Kodlar & Linkler</h2>
        <QrPanel
          slug={couple.slug}
          baseUrl={baseUrl}
          coupleLabel={`${couple.groom_name} & ${couple.bride_name}`}
        />
      </section>

      {/* LCV Listesi */}
      <section>
        <h2 className="mb-4 text-2xl font-medium">LCV Listesi ({rsvps.length})</h2>
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
                    <p className="text-sm text-ink-soft">{r.guest_count} kişi</p>
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
    </div>
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
