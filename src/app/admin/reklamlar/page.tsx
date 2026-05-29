import Link from "next/link";
import { getAllVendors } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import {
  Megaphone,
  Plus,
  Pencil,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorsListPage() {
  const vendors = await getAllVendors();
  const now = new Date().toISOString();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-medium">
          <Megaphone className="h-6 w-6 text-gold" />
          Reklamlar (Vendor)
        </h1>
        <Link
          href="/admin/reklamlar/yeni"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-105"
        >
          <Plus className="h-4 w-4" />
          Yeni Vendor
        </Link>
      </header>

      <p className="text-sm text-ink-soft">
        Toplam {vendors.length} vendor · Landing ve /partnerler sayfalarında
        aktif olanlar yayınlanır.
      </p>

      {vendors.length === 0 ? (
        <Card className="p-8 text-center text-ink-soft">
          Henüz vendor eklenmedi. Yukarıdaki "Yeni Vendor" ile başlayın.
        </Card>
      ) : (
        <div className="space-y-3">
          {vendors.map((v) => {
            const expired = v.expires_at && v.expires_at < now;
            return (
              <Link key={v.id} href={`/admin/reklamlar/${v.id}/edit`}>
                <Card className="flex items-center justify-between p-5 transition-colors hover:bg-ivory">
                  <div className="flex items-center gap-4">
                    {v.logo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={v.logo_url}
                        alt={v.name}
                        className="h-12 w-12 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ivory font-serif text-lg text-gold">
                        {v.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <p className="text-xs text-ink-soft">
                        {v.category} · ağırlık {v.weight}
                        {v.city && ` · ${v.city}`}
                      </p>
                      {expired && (
                        <p className="text-xs text-rose-gold">
                          Süresi dolmuş
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {v.active && !expired ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-800">
                        <Eye className="h-3 w-3" />
                        Yayında
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-beige px-2.5 py-0.5 text-xs text-ink-soft">
                        <EyeOff className="h-3 w-3" />
                        Pasif
                      </span>
                    )}
                    <Pencil className="h-4 w-4 text-ink-soft" />
                    <ChevronRight className="h-4 w-4 text-ink-soft" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
