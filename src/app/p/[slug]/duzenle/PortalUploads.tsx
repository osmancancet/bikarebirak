"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, Label } from "@/components/ui/card";
import {
  CheckCircle2,
  Heart,
  ImagePlus,
  Music,
  Trash2,
  Upload as UploadIcon,
} from "lucide-react";

interface Props {
  slug: string;
  coverUrl: string | null;
  musicUrl: string | null;
  musicLabel: string | null;
  engagementPhotos: string[];
}

const MAX_ENGAGEMENT = 6;

export function PortalUploads({
  slug,
  coverUrl: initialCover,
  musicUrl: initialMusic,
  musicLabel,
  engagementPhotos: initialPhotos,
}: Props) {
  const [coverUrl, setCoverUrl] = useState(initialCover);
  const [musicUrl, setMusicUrl] = useState(initialMusic);
  const [photos, setPhotos] = useState(initialPhotos);
  const [, startTransition] = useTransition();

  const [coverMsg, setCoverMsg] = useState<string | null>(null);
  const [musicMsg, setMusicMsg] = useState<string | null>(null);
  const [photoMsg, setPhotoMsg] = useState<string | null>(null);

  const coverRef = useRef<HTMLFormElement>(null);
  const musicRef = useRef<HTMLFormElement>(null);
  const photoRef = useRef<HTMLFormElement>(null);

  const uploadCover = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCoverMsg("Yükleniyor…");
    const res = await fetch(`/api/p/${slug}/cover`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setCoverMsg(data?.error ?? "Hata");
      return;
    }
    setCoverUrl(data.url);
    setCoverMsg("Kaydedildi ✓");
    coverRef.current?.reset();
  };

  const uploadMusic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setMusicMsg("Yükleniyor…");
    const res = await fetch(`/api/p/${slug}/music`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMusicMsg(data?.error ?? "Hata");
      return;
    }
    setMusicUrl(data.url);
    setMusicMsg("Kaydedildi ✓");
    musicRef.current?.reset();
  };

  const deleteMusic = () => {
    startTransition(async () => {
      const res = await fetch(`/api/p/${slug}/music`, { method: "DELETE" });
      if (res.ok) setMusicUrl(null);
    });
  };

  const uploadPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPhotoMsg("Yükleniyor…");
    const res = await fetch(`/api/p/${slug}/engagement`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setPhotoMsg(data?.error ?? "Hata");
      return;
    }
    setPhotos((p) => [...p, data.url]);
    setPhotoMsg("Eklendi ✓");
    photoRef.current?.reset();
  };

  const deletePhoto = (url: string) => {
    startTransition(async () => {
      const res = await fetch(
        `/api/p/${slug}/engagement?url=${encodeURIComponent(url)}`,
        { method: "DELETE" }
      );
      if (res.ok) setPhotos((p) => p.filter((x) => x !== url));
    });
  };

  return (
    <div className="space-y-6">
      {/* Kapak */}
      <Card className="p-7">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          <ImagePlus className="h-5 w-5 text-gold" />
          Kapak Görseli
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Davetiyenin üst kısmında zarif bir arka plan olarak görünür.
        </p>

        {coverUrl && (
          <div className="mt-4 overflow-hidden rounded-xl border border-beige">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt="Mevcut kapak"
              className="h-40 w-full object-cover"
            />
          </div>
        )}

        <form ref={coverRef} onSubmit={uploadCover} className="mt-4 space-y-3">
          <Label htmlFor="p_cover">Yeni kapak (max 8 MB)</Label>
          <input
            id="p_cover"
            name="cover"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-ivory file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-beige"
          />
          {coverMsg && (
            <p
              className={`text-sm ${
                coverMsg.includes("✓")
                  ? "text-green-700"
                  : coverMsg === "Yükleniyor…"
                  ? "text-ink-soft"
                  : "text-rose-gold"
              }`}
            >
              {coverMsg}
            </p>
          )}
          <Button type="submit">
            <UploadIcon className="h-4 w-4" />
            Kapağı Kaydet
          </Button>
        </form>
      </Card>

      {/* Nişan fotoğrafları */}
      <Card className="p-7">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          <Heart className="h-5 w-5 text-rose-gold" fill="currentColor" />
          Nişan Fotoğrafları
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Davetiyenin üst kısmında otomatik dönen carousel olarak görünür.
          Maksimum {MAX_ENGAGEMENT} fotoğraf.
        </p>

        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((url) => (
              <div
                key={url}
                className="relative aspect-square overflow-hidden rounded-xl border border-beige bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => deletePhoto(url)}
                  className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Sil"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < MAX_ENGAGEMENT && (
          <form ref={photoRef} onSubmit={uploadPhoto} className="mt-4 space-y-3">
            <Label htmlFor="p_eng">Yeni fotoğraf (max 8 MB)</Label>
            <input
              id="p_eng"
              name="photo"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-ivory file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-beige"
            />
            {photoMsg && (
              <p
                className={`text-sm ${
                  photoMsg.includes("✓")
                    ? "text-green-700"
                    : photoMsg === "Yükleniyor…"
                    ? "text-ink-soft"
                    : "text-rose-gold"
                }`}
              >
                {photoMsg}
              </p>
            )}
            <Button type="submit">
              <Heart className="h-4 w-4" />
              Ekle
            </Button>
          </form>
        )}
      </Card>

      {/* Müzik */}
      <Card className="p-7">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          <Music className="h-5 w-5 text-gold" />
          Çiftin Şarkısı
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Davetiyenin sağ altında player olarak görünür. Tarayıcı otomatik
          çalmaz; misafir butona basınca başlar.
        </p>

        {musicUrl && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-beige bg-ivory/60 p-3">
            <div>
              {musicLabel && (
                <p className="text-sm font-medium">{musicLabel}</p>
              )}
              <audio controls src={musicUrl} className="mt-2 h-8 max-w-xs" />
            </div>
            <button
              type="button"
              onClick={deleteMusic}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-rose-200 bg-white px-3 text-xs text-rose-gold hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Kaldır
            </button>
          </div>
        )}

        <form ref={musicRef} onSubmit={uploadMusic} className="mt-4 space-y-3">
          <Label htmlFor="p_music">Yeni şarkı (MP3, max 10 MB)</Label>
          <input
            id="p_music"
            name="music"
            type="file"
            accept="audio/*"
            className="block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-ivory file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-beige"
          />
          <Label htmlFor="p_music_label">Şarkı adı (opsiyonel)</Label>
          <input
            id="p_music_label"
            name="music_label"
            type="text"
            defaultValue={musicLabel ?? ""}
            placeholder="Sigur Rós — Hoppípolla"
            className="h-11 w-full rounded-xl border border-sand bg-white/70 px-4 text-sm text-ink"
          />
          {musicMsg && (
            <p
              className={`text-sm ${
                musicMsg.includes("✓")
                  ? "text-green-700"
                  : musicMsg === "Yükleniyor…"
                  ? "text-ink-soft"
                  : "text-rose-gold"
              }`}
            >
              {musicMsg}
            </p>
          )}
          <Button type="submit">
            <Music className="h-4 w-4" />
            Müziği Kaydet
          </Button>
        </form>
      </Card>
    </div>
  );
}
