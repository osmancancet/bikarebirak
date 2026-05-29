import Link from "next/link";
import { ensurePortalAccess } from "@/lib/portal";
import { getPhotosByIds } from "@/lib/queries";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ArrowLeft, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FavoritesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;
  const couple = await ensurePortalAccess(slug, key, `/p/${slug}/favoriler`);

  const ids = couple.favorite_photo_ids ?? [];
  const photos = await getPhotosByIds(ids);

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[#14110d] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#14110d]/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href={`/p/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Panele dön
          </Link>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.25em] text-gold-soft">
              <Star className="inline h-3 w-3" fill="currentColor" /> Favoriler
            </p>
            <h1 className="font-serif text-2xl">
              {couple.groom_name} &amp; {couple.bride_name}
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl flex-1 p-3 sm:p-5">
        <GalleryGrid
          coupleId={couple.id}
          coupleSlug={couple.slug}
          initialPhotos={photos}
          initialFavoriteIds={ids}
          showFavoritesOnly
          disableRealtime
          emptyState={
            <div className="flex flex-col items-center gap-3 py-32 text-center text-white/60">
              <Star className="h-12 w-12 text-gold-soft" />
              <p className="font-serif text-2xl text-white/80">
                Henüz favori seçmediniz
              </p>
              <p className="max-w-sm text-sm">
                Galerinizde her foto'nun sağ üst köşesindeki yıldız simgesine
                tıklayarak en sevdiklerinizi buraya ekleyebilirsiniz.
              </p>
              <Link
                href={`/${slug}/galeri`}
                className="mt-3 rounded-full border border-white/20 px-5 py-2 text-sm text-white/90 hover:bg-white/10"
              >
                Galeriyi Aç
              </Link>
            </div>
          }
        />
      </div>
    </main>
  );
}
