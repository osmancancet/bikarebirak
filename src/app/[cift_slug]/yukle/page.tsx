import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoupleBySlug } from "@/lib/queries";
import { Uploader } from "@/components/Uploader";
import { Images } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cift_slug: string }>;
}): Promise<Metadata> {
  const { cift_slug } = await params;
  const couple = await getCoupleBySlug(cift_slug);
  return {
    title: couple
      ? `Fotoğraf Yükle — ${couple.groom_name} & ${couple.bride_name}`
      : "Fotoğraf Yükle",
  };
}

export default async function UploadPage({
  params,
}: {
  params: Promise<{ cift_slug: string }>;
}) {
  const { cift_slug } = await params;
  const couple = await getCoupleBySlug(cift_slug);
  if (!couple) notFound();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <header className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-gold">
          {couple.groom_name} & {couple.bride_name}
        </p>
        <h1 className="mt-3 font-serif text-4xl">Anılarınızı Paylaşın</h1>
        <p className="mt-2 max-w-xs text-ink-soft">
          Çektiğiniz fotoğraflar çiftin galerisine anında düşsün.
        </p>
      </header>

      <Uploader coupleId={couple.id} slug={couple.slug} />

      <Link
        href={`/${couple.slug}/galeri`}
        className="mt-12 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <Images className="h-4 w-4 text-gold" />
        Galeriyi Gör
      </Link>
    </main>
  );
}
