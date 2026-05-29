"use client";

import { useActionState } from "react";
import {
  createVendorAction,
  updateVendorAction,
  type ActionState,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, Label } from "@/components/ui/card";
import { CheckCircle2, Save } from "lucide-react";
import type { Vendor } from "@/lib/types";

const CATEGORY_OPTIONS = [
  { id: "organizer", label: "Organizatör" },
  { id: "photographer", label: "Fotoğrafçı" },
  { id: "florist", label: "Çiçekçi" },
  { id: "venue", label: "Mekan" },
  { id: "music", label: "Müzik" },
  { id: "dress", label: "Gelinlik" },
  { id: "other", label: "Diğer" },
];

const initial: ActionState = {};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function VendorForm({ vendor }: { vendor?: Vendor }) {
  const action = vendor ? updateVendorAction : createVendorAction;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <Card className="p-7">
      <h2 className="text-2xl font-medium">
        {vendor ? "Vendor Düzenle" : "Yeni Vendor"}
      </h2>

      <form action={formAction} className="mt-6 space-y-4">
        {vendor && <input type="hidden" name="id" value={vendor.id} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Vendor Adı *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={vendor?.name ?? ""}
              placeholder="Lale Çiçek Atölyesi"
            />
          </div>
          <div>
            <Label htmlFor="category">Kategori *</Label>
            <select
              id="category"
              name="category"
              defaultValue={vendor?.category ?? "organizer"}
              required
              className="h-12 w-full rounded-xl border border-sand bg-white/70 px-4 text-base text-ink"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Açıklama *</Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={2}
            defaultValue={vendor?.description ?? ""}
            placeholder="İstanbul'un en şık nikah ve düğün çiçek dekorasyonları."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="website_url">Web Sitesi *</Label>
            <Input
              id="website_url"
              name="website_url"
              type="url"
              required
              defaultValue={vendor?.website_url ?? ""}
              placeholder="https://lalecicek.com"
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp Numarası</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              defaultValue={vendor?.whatsapp ?? ""}
              placeholder="905XXXXXXXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="city">Şehir</Label>
            <Input
              id="city"
              name="city"
              defaultValue={vendor?.city ?? ""}
              placeholder="İstanbul"
            />
          </div>
          <div>
            <Label htmlFor="weight">Ağırlık (1-10)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min={1}
              max={10}
              defaultValue={vendor?.weight ?? 5}
            />
          </div>
          <div>
            <Label htmlFor="expires_at">Sona Erme Tarihi</Label>
            <Input
              id="expires_at"
              name="expires_at"
              type="datetime-local"
              defaultValue={toLocalInput(vendor?.expires_at ?? null)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="active"
            name="active"
            type="checkbox"
            defaultChecked={vendor?.active ?? true}
            className="h-4 w-4"
          />
          <Label htmlFor="active" className="mb-0">
            Aktif (yayında göster)
          </Label>
        </div>

        {state.error && <p className="text-sm text-rose-gold">{state.error}</p>}
        {state.success && (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {state.success}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending}>
          <Save className="h-4 w-4" />
          {pending
            ? "Kaydediliyor…"
            : vendor
            ? "Güncelle"
            : "Vendor Ekle"}
        </Button>
      </form>
    </Card>
  );
}
