import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCoupleBySlug, getPhotos } from "@/lib/queries";
import { GalleryGrid } from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cift_slug: string }>;
}): Promise<Metadata> {
  const { cift_slug } = await params;
  const couple = await getCoupleBySlug(cift_slug);
  return {
    title: couple
      ? `Canlı Galeri — ${couple.groom_name} & ${couple.bride_name}`
      : "Canlı Galeri",
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ cift_slug: string }>;
}) {
  const { cift_slug } = await params;
  const couple = await getCoupleBySlug(cift_slug);
  if (!couple) notFound();

  const photos = await getPhotos(couple.id);

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[#14110d] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#14110d]/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-soft">
              Canlı Galeri
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl">
              {couple.groom_name} &amp; {couple.bride_name}
            </h1>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-gold" />
            </span>
            Canlı
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl flex-1 p-3 sm:p-5">
        <GalleryGrid coupleId={couple.id} initialPhotos={photos} />
      </div>
    </main>
  );
}
