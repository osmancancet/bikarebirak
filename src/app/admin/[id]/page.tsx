import Link from "next/link";
import { notFound } from "next/navigation";
import { randomBytes } from "crypto";
import {
  getCoupleById,
  getRsvps,
  getPhotoCount,
  getGuestMessages,
} from "@/lib/queries";
import { getAdminDb } from "@/lib/firebase/admin";
import { Card } from "@/components/ui/card";
import { formatWeddingDate } from "@/lib/utils";
import { QrPanel } from "./QrPanel";
import { DeleteCoupleButton } from "./DeleteCoupleButton";
import { PortalLinkCard } from "./PortalLinkCard";
import { RetentionCard } from "./RetentionCard";
import { InviteShareCard } from "@/components/InviteShareCard";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Check,
  X,
  Printer,
  Pencil,
  Images,
  FileDown,
  BookHeart,
  Image as ImageIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoupleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let couple = await getCoupleById(id);
  if (!couple) notFound();

  // Eski çiftler için portal_token lazy backfill
  if (!couple.portal_token) {
    const token = randomBytes(16).toString("base64url");
    await getAdminDb().collection("couples").doc(id).update({
      portal_token: token,
    });
    couple = { ...couple, portal_token: token };
  }

  const [rsvps, photoCount, guestMessages] = await Promise.all([
    getRsvps(id),
    getPhotoCount(id),
    getGuestMessages(id, 10),
  ]);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const portalUrl = `${baseUrl}/p/${couple.slug}?key=${couple.portal_token}`;

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

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-medium">
            {couple.bride_name} & {couple.groom_name}
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
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/${couple.id}/edit`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-sand bg-white px-5 text-sm font-medium text-ink transition-colors hover:bg-ivory"
          >
            <Pencil className="h-4 w-4" />
            Düzenle
          </Link>
          <Link
            href={`/admin/${couple.id}/fotograflar`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-sand bg-white px-5 text-sm font-medium text-ink transition-colors hover:bg-ivory"
          >
            <Images className="h-4 w-4" />
            Fotoğraflar
          </Link>
          <a
            href={`/api/admin/couples/${couple.id}/rsvp.csv`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-sand bg-white px-5 text-sm font-medium text-ink transition-colors hover:bg-ivory"
          >
            <FileDown className="h-4 w-4" />
            LCV (CSV)
          </a>
          <DeleteCoupleButton
            coupleId={couple.id}
            coupleLabel={`${couple.bride_name} & ${couple.groom_name}`}
          />
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-medium">QR Kodlar & Linkler</h2>
          <Link
            href={`/admin/${couple.id}/masa`}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <Printer className="h-4 w-4" />
            Masa Kartlarını Yazdır
          </Link>
        </div>
        <QrPanel
          slug={couple.slug}
          baseUrl={baseUrl}
          coupleLabel={`${couple.bride_name} & ${couple.groom_name}`}
        />
      </section>

      {/* Çift portalı linki */}
      <PortalLinkCard
        coupleLabel={`${couple.bride_name} & ${couple.groom_name}`}
        portalUrl={portalUrl}
      />

      {/* Davetiye paylaşım şablonu */}
      <InviteShareCard
        coupleLabel={`${couple.bride_name} & ${couple.groom_name}`}
        inviteUrl={`${baseUrl}/${couple.slug}`}
      />

      {/* Arşiv süresi (premium add-on) */}
      <RetentionCard
        coupleId={couple.id}
        currentDays={couple.retention_days}
      />

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
