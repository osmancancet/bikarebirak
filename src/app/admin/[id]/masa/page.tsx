import { notFound } from "next/navigation";
import { getCoupleById } from "@/lib/queries";
import { PrintableCards } from "./PrintableCards";

export const dynamic = "force-dynamic";

export default async function MasaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const couple = await getCoupleById(id);
  if (!couple) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const uploadUrl = `${baseUrl}/${couple.slug}/yukle`;

  return (
    <div>
      <PrintableCards
        coupleId={couple.id}
        coupleLabel={`${couple.bride_name} & ${couple.groom_name}`}
        uploadUrl={uploadUrl}
      />
    </div>
  );
}
