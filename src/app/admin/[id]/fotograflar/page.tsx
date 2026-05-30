import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoupleById, getPhotos } from "@/lib/queries";
import { PhotosModeration } from "./PhotosModeration";
import { ArrowLeft, Images } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PhotosModerationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const couple = await getCoupleById(id);
  if (!couple) notFound();

  const photos = await getPhotos(id);

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Çift detayına dön
      </Link>

      <header>
        <h1 className="flex items-center gap-2 text-3xl font-medium">
          <Images className="h-6 w-6 text-gold" />
          Fotoğraf Moderasyonu
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {couple.bride_name} & {couple.groom_name} · {photos.length} fotoğraf
        </p>
      </header>

      <PhotosModeration initialPhotos={photos} />
    </div>
  );
}
