import Link from "next/link";
import { ensurePortalAccess } from "@/lib/portal";
import { PortalEditForm } from "./PortalEditForm";
import { PortalUploads } from "./PortalUploads";
import { ThemePicker } from "@/components/ThemePicker";
import { ArrowLeft, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PortalEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;
  const couple = await ensurePortalAccess(slug, key, `/p/${slug}/duzenle`);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Link
          href={`/p/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Panele dön
        </Link>

        <header>
          <h1 className="flex items-center gap-2 text-3xl font-medium">
            <Pencil className="h-6 w-6 text-gold" />
            Davetiyeni Düzenle
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Karşılama metnini, programını, fotoğraflarını ve şarkını buradan
            yönetebilirsin. <strong>Ad, slug, tarih ve mekan</strong>{" "}
            değişiklikleri için bize WhatsApp'tan yaz.
          </p>
        </header>

        <PortalEditForm couple={couple} />
        <PortalUploads
          slug={couple.slug}
          coverUrl={couple.cover_image_url}
          musicUrl={couple.music_url}
          musicLabel={couple.music_label}
          engagementPhotos={couple.engagement_photos ?? []}
        />
        <ThemePicker
          slug={couple.slug}
          currentTheme={couple.theme}
          currentFilter={couple.cover_filter}
        />
      </div>
    </main>
  );
}
