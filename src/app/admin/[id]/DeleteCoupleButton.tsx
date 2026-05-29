"use client";

import { useState, useTransition } from "react";
import { deleteCoupleAction } from "../actions";
import { Trash2, AlertTriangle } from "lucide-react";

export function DeleteCoupleButton({
  coupleId,
  coupleLabel,
}: {
  coupleId: string;
  coupleLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-rose-200 bg-white px-5 text-sm font-medium text-rose-gold transition-colors hover:bg-rose-50"
      >
        <Trash2 className="h-4 w-4" />
        Çifti Sil
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="surface-card max-w-sm rounded-card p-6 text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-gold">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-medium">Emin misin?</h3>
        <p className="mt-2 text-sm text-ink-soft">
          <strong>{coupleLabel}</strong> ve bu çifte ait tüm LCV kayıtları ve
          fotoğraflar (Storage dahil) kalıcı olarak silinecek. Bu işlem geri
          alınamaz.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setOpen(false)}
            disabled={pending}
            className="rounded-full border border-sand bg-white px-5 py-2.5 text-sm text-ink hover:bg-ivory disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            onClick={() =>
              startTransition(async () => {
                await deleteCoupleAction(coupleId);
              })
            }
            disabled={pending}
            className="rounded-full bg-rose-gold px-5 py-2.5 text-sm font-medium text-white hover:brightness-95 disabled:opacity-50"
          >
            {pending ? "Siliniyor…" : "Evet, sil"}
          </button>
        </div>
      </div>
    </div>
  );
}
