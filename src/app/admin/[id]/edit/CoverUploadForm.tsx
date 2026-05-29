"use client";

import { useActionState, useRef, useState } from "react";
import { uploadCoverImageAction, type ActionState } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, Label } from "@/components/ui/card";
import { CheckCircle2, ImagePlus, Trash2 } from "lucide-react";

const initial: ActionState = {};

export function CoverUploadForm({
  coupleId,
  slug,
  currentUrl,
}: {
  coupleId: string;
  slug: string;
  currentUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    uploadCoverImageAction,
    initial
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);
  const [hasFile, setHasFile] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPreviewUrl(URL.createObjectURL(f));
      setHasFile(true);
    }
  };

  return (
    <Card className="p-7">
      <h2 className="text-2xl font-medium">Kapak Görseli</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Davetiye sayfasının üst kısmında zarif bir arka plan olarak görünür.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={coupleId} />
        <input type="hidden" name="slug" value={slug} />

        {previewUrl && (
          <div className="overflow-hidden rounded-xl border border-beige">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Kapak önizleme"
              className="h-40 w-full object-cover"
            />
          </div>
        )}

        <div>
          <Label htmlFor="cover">Görsel seç (PNG/JPG, max 8 MB)</Label>
          <input
            ref={fileRef}
            id="cover"
            name="cover"
            type="file"
            accept="image/*"
            onChange={onChange}
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

        <div className="flex gap-3">
          <Button type="submit" size="default" disabled={!hasFile || pending}>
            <ImagePlus className="h-4 w-4" />
            {pending ? "Yükleniyor…" : "Kapağı Kaydet"}
          </Button>
          {currentUrl && (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => {
                setPreviewUrl(null);
                setHasFile(false);
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              <Trash2 className="h-4 w-4" />
              Önizlemeyi Temizle
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
