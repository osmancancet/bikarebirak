import type { Metadata } from "next";
import Link from "next/link";
import { getActiveVendors } from "@/lib/queries";
import type { VendorCategory } from "@/lib/types";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partnerlerimiz — BiKareBırak",
  description:
    "Düğün hazırlıklarınızda güvendiğimiz organizasyon, fotoğrafçı, çiçekçi ve mekan ortaklarımız.",
};

const CATEGORY_LABELS: Record<VendorCategory, string> = {
  organizer: "Organizatör",
  photographer: "Fotoğrafçı",
  florist: "Çiçekçi",
  venue: "Mekan",
  music: "Müzik",
  dress: "Gelinlik",
  other: "Diğer",
};

const CATEGORIES: VendorCategory[] = [
  "organizer",
  "photographer",
  "florist",
  "venue",
  "music",
  "dress",
  "other",
];

export default async function PartnersPage() {
  const all = await getActiveVendors({});

  // Kategoriye göre grupla
  const grouped: Record<VendorCategory, typeof all> = {
    organizer: [],
    photographer: [],
    florist: [],
    venue: [],
    music: [],
    dress: [],
    other: [],
  };
  for (const v of all) grouped[v.category].push(v);

  return (
    <main className="flex flex-1 flex-col px-5 py-14">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Ana sayfa
        </Link>

        <header className="mt-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">
            Partnerlerimiz
          </p>
          <h1 className="mt-3 font-serif text-5xl">Güvenilir Düğün Ortakları</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">
            Düğün hazırlığınızı kolaylaştıracak, BiKareBırak'ın seçtiği
            organizasyon, fotoğrafçı, çiçekçi, mekan ve daha fazlası.
          </p>
        </header>

        {all.length === 0 ? (
          <p className="mt-16 text-center text-ink-soft">
            Henüz partner eklenmedi.
          </p>
        ) : (
          <div className="mt-16 space-y-14">
            {CATEGORIES.map((cat) => {
              const items = grouped[cat];
              if (items.length === 0) return null;
              return (
                <section key={cat}>
                  <h2 className="mb-6 font-serif text-3xl">
                    {CATEGORY_LABELS[cat]}
                    <span className="ml-3 text-sm text-ink-soft">
                      ({items.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((v) => (
                      <a
                        key={v.id}
                        href={v.website_url}
                        target="_blank"
                        rel="noopener nofollow sponsored"
                        className="surface-card group flex flex-col gap-3 rounded-card p-6 transition-transform hover:-translate-y-1"
                      >
                        <div className="flex h-12 items-center">
                          {v.logo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={v.logo_url}
                              alt={v.name}
                              className="max-h-full max-w-[180px] object-contain"
                            />
                          ) : (
                            <span className="font-serif text-xl text-ink">
                              {v.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-ink-soft">
                          {v.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between border-t border-beige pt-3 text-xs text-ink-soft">
                          <span>{v.city ?? "—"}</span>
                          <ExternalLink className="h-3.5 w-3.5 transition-colors group-hover:text-gold" />
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <p className="mt-16 text-center text-xs text-ink-soft/70">
          Sponsorlu içerik · Partner olmak için bizimle iletişime geçin.
        </p>
      </div>
    </main>
  );
}
