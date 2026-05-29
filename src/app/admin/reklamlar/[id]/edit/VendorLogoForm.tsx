"use client";

import { useActionState } from "react";
import { uploadVendorLogoAction, type ActionState } from "../../../actions";
import { Button } from "@/components/ui/button";
import { Card, Label } from "@/components/ui/card";
import { CheckCircle2, ImagePlus } from "lucide-react";

const initial: ActionState = {};

export function VendorLogoForm({
  vendorId,
  currentUrl,
}: {
  vendorId: string;
  currentUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    uploadVendorLogoAction,
    initial
  );

  return (
    <Card className="p-7">
      <h2 className="text-2xl font-medium">Logo</h2>

      {currentUrl && (
        <div className="mt-4 inline-flex h-24 items-center rounded-xl border border-beige bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="Mevcut logo"
            className="h-full max-w-[200px] object-contain"
          />
        </div>
      )}

      <form action={formAction} className="mt-4 space-y-3">
        <input type="hidden" name="id" value={vendorId} />
        <div>
          <Label htmlFor="logo">Logo (PNG/JPG/SVG, max 2 MB)</Label>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-ivory file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-beige"
          />
        </div>
        {state.error && <p className="text-sm text-rose-gold">{state.error}</p>}
        {state.success && (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {state.success}
          </p>
        )}
        <Button type="submit" disabled={pending}>
          <ImagePlus className="h-4 w-4" />
          {pending ? "Yükleniyor…" : "Logoyu Kaydet"}
        </Button>
      </form>
    </Card>
  );
}
