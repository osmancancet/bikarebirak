import { Card } from "@/components/ui/card";
import { getAuditEntries, type AuditAction } from "@/lib/audit";
import {
  ScrollText,
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  Image as ImageIcon,
  Megaphone,
} from "lucide-react";

export const dynamic = "force-dynamic";

const labels: Record<AuditAction, { label: string; color: string }> = {
  "couple.created": { label: "Çift oluşturuldu", color: "text-green-700" },
  "couple.updated": { label: "Çift güncellendi", color: "text-amber-700" },
  "couple.deleted": { label: "Çift silindi", color: "text-rose-gold" },
  "photo.deleted": { label: "Fotoğraf silindi", color: "text-rose-gold" },
  "cover.uploaded": { label: "Kapak yüklendi", color: "text-blue-700" },
  "vendor.created": { label: "Vendor eklendi", color: "text-green-700" },
  "vendor.updated": { label: "Vendor güncellendi", color: "text-amber-700" },
  "vendor.deleted": { label: "Vendor silindi", color: "text-rose-gold" },
};

const icons: Record<AuditAction, React.ComponentType<{ className?: string }>> = {
  "couple.created": Plus,
  "couple.updated": Pencil,
  "couple.deleted": Trash2,
  "photo.deleted": ImageIcon,
  "cover.uploaded": ImagePlus,
  "vendor.created": Megaphone,
  "vendor.updated": Megaphone,
  "vendor.deleted": Megaphone,
};

export default async function AuditPage() {
  const entries = await getAuditEntries(100);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-medium">
          <ScrollText className="h-6 w-6 text-gold" />
          Audit Log
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Yönetici eylemleri (oluştur / düzenle / sil / kapak yükle) — son 100 kayıt.
        </p>
      </header>

      {entries.length === 0 ? (
        <Card className="p-8 text-center text-ink-soft">
          Henüz audit kaydı yok.
        </Card>
      ) : (
        <Card className="divide-y divide-beige overflow-hidden">
          {entries.map((e) => {
            const meta = labels[e.action] ?? {
              label: e.action,
              color: "text-ink",
            };
            const Icon = icons[e.action] ?? ScrollText;
            return (
              <div key={e.id} className="flex items-start gap-4 px-5 py-4">
                <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-gold">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${meta.color}`}>
                    {meta.label}
                  </p>
                  {e.couple_label && (
                    <p className="text-sm text-ink">{e.couple_label}</p>
                  )}
                  {e.slug && (
                    <p className="text-xs text-gold">/{e.slug}</p>
                  )}
                  {e.note && (
                    <p className="mt-0.5 truncate text-xs text-ink-soft">
                      {e.note}
                    </p>
                  )}
                </div>
                <p className="text-xs text-ink-soft">
                  {new Date(e.performed_at).toLocaleString("tr-TR")}
                </p>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
