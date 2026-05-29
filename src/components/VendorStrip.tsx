import { getActiveVendors } from "@/lib/queries";
import type { VendorCategory } from "@/lib/types";
import { ExternalLink } from "lucide-react";

const CATEGORY_LABELS: Record<VendorCategory, string> = {
  organizer: "Organizatör",
  photographer: "Fotoğrafçı",
  florist: "Çiçekçi",
  venue: "Mekan",
  music: "Müzik",
  dress: "Gelinlik",
  other: "Diğer",
};

interface Props {
  category?: VendorCategory;
  city?: string;
  limit?: number;
  title?: string;
  subtitle?: string;
  variant?: "light" | "compact";
}

/** Aktif vendor reklamlarını gösteren strip — landing veya portalda kullanılır. */
export async function VendorStrip({
  category,
  city,
  limit = 6,
  title,
  subtitle,
  variant = "light",
}: Props) {
  const vendors = await getActiveVendors({ category, city, limit });
  if (vendors.length === 0) return null;

  return (
    <section
      className={variant === "compact" ? "py-6" : "py-16"}
      aria-label="Sponsorlu ortaklarımız"
    >
      {(title || subtitle) && variant !== "compact" && (
        <div className="mb-10 text-center">
          {title && (
            <h2 className="font-serif text-3xl sm:text-4xl">{title}</h2>
          )}
          {subtitle && (
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-soft">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {vendors.map((v) => (
          <a
            key={v.id}
            href={v.website_url}
            target="_blank"
            rel="noopener nofollow sponsored"
            className="surface-card group flex flex-col gap-3 rounded-card p-5 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-ivory px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-gold">
                {CATEGORY_LABELS[v.category]}
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-ink-soft transition-colors group-hover:text-gold" />
            </div>
            <div className="flex h-14 items-center">
              {v.logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={v.logo_url}
                  alt={v.name}
                  className="max-h-full max-w-[150px] object-contain"
                />
              ) : (
                <span className="font-serif text-xl text-ink">{v.name}</span>
              )}
            </div>
            <p className="line-clamp-2 text-xs text-ink-soft">
              {v.description}
            </p>
            {v.city && (
              <p className="text-[10px] text-ink-soft/70">📍 {v.city}</p>
            )}
          </a>
        ))}
      </div>
      <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-ink-soft/60">
        Sponsorlu içerik
      </p>
    </section>
  );
}
