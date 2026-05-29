import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoupleById } from "@/lib/queries";
import { EditCoupleForm } from "./EditCoupleForm";
import { CoverUploadForm } from "./CoverUploadForm";
import { MusicUploadForm } from "./MusicUploadForm";
import { EngagementGallery } from "./EngagementGallery";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditCouplePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const couple = await getCoupleById(id);
  if (!couple) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Çift detayına dön
      </Link>

      <EditCoupleForm couple={couple} />
      <CoverUploadForm
        coupleId={couple.id}
        slug={couple.slug}
        currentUrl={couple.cover_image_url}
      />
      <EngagementGallery
        coupleId={couple.id}
        slug={couple.slug}
        photos={couple.engagement_photos ?? []}
      />
      <MusicUploadForm
        coupleId={couple.id}
        slug={couple.slug}
        currentUrl={couple.music_url}
        currentLabel={couple.music_label}
      />
    </div>
  );
}
