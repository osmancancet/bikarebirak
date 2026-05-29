import Link from "next/link";
import { VendorForm } from "../VendorForm";
import { ArrowLeft } from "lucide-react";

export default function NewVendorPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/reklamlar"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Vendor listesi
      </Link>
      <VendorForm />
    </div>
  );
}
