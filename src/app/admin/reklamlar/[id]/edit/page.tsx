import Link from "next/link";
import { notFound } from "next/navigation";
import { getVendorById } from "@/lib/queries";
import { VendorForm } from "../../VendorForm";
import { VendorLogoForm } from "./VendorLogoForm";
import { DeleteVendorButton } from "./DeleteVendorButton";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await getVendorById(id);
  if (!vendor) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/reklamlar"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Vendor listesi
        </Link>
        <DeleteVendorButton vendorId={vendor.id} vendorName={vendor.name} />
      </div>

      <VendorForm vendor={vendor} />
      <VendorLogoForm vendorId={vendor.id} currentUrl={vendor.logo_url} />
    </div>
  );
}
