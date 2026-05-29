"use client";

import { useEffect, useRef, useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorageClient, getDb } from "@/lib/firebase/client";
import { preparePhoto, makePreviewUrl } from "@/lib/image";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Upload as UploadIcon,
  X,
  Sparkles,
} from "lucide-react";

type Phase = "idle" | "selecting" | "uploading" | "done";
type ItemStatus =
  | "pending"
  | "preparing"
  | "uploading"
  | "done"
  | "error";

interface QueueItem {
  id: string;
  file: File;
  preparedFile?: File;
  previewUrl: string;
  progress: number; // 0-100
  status: ItemStatus;
  errorMessage?: string;
}

const DEFAULT_RETENTION_DAYS = Number(
  process.env.NEXT_PUBLIC_RETENTION_DAYS ?? "7"
);
const UPLOADER_NAME_KEY = "bkb_uploader_name";

function fireConfetti() {
  import("canvas-confetti").then(({ default: confetti }) => {
    const colors = ["#c2a14d", "#d4b878", "#b76e79", "#ffffff"];
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors,
        }),
      150
    );
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors,
        }),
      300
    );
  });
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function Uploader({
  coupleId,
  slug,
}: {
  coupleId: string;
  slug: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [hasHover, setHasHover] = useState(false);
  const [uploaderName, setUploaderName] = useState("");

  // Masaüstü algılama + localStorage'tan ad
  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasHover(window.matchMedia("(hover: hover)").matches);
    const stored = localStorage.getItem(UPLOADER_NAME_KEY);
    if (stored) setUploaderName(stored);
  }, []);

  // Önizleme URL'lerini temizle
  useEffect(() => {
    return () => {
      queue.forEach((q) => URL.revokeObjectURL(q.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = () => inputRef.current?.click();

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/") || /\.hei[cf]$/i.test(f.name)
    );
    if (incoming.length === 0) return;
    const newItems: QueueItem[] = incoming.map((file) => ({
      id: newId(),
      file,
      previewUrl: makePreviewUrl(file),
      progress: 0,
      status: "pending" as ItemStatus,
    }));
    setQueue((prev) => [...prev, ...newItems]);
    setPhase("selecting");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeItem = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      const next = prev.filter((q) => q.id !== id);
      if (next.length === 0) setPhase("idle");
      return next;
    });
  };

  const updateItem = (id: string, patch: Partial<QueueItem>) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const startUpload = async () => {
    if (queue.length === 0) return;
    setPhase("uploading");

    const storage = getStorageClient();
    const db = getDb();

    // Adı localStorage'a hatırla
    const trimmedName = uploaderName.trim();
    if (trimmedName) {
      localStorage.setItem(UPLOADER_NAME_KEY, trimmedName);
    } else {
      localStorage.removeItem(UPLOADER_NAME_KEY);
    }

    // Çiftin retention_days değerini çek (yoksa env varsayılanı kullan)
    let retentionDays = DEFAULT_RETENTION_DAYS;
    try {
      const snap = await getDoc(doc(db, "couples", coupleId));
      const data = snap.data();
      if (data && typeof data.retention_days === "number" && data.retention_days > 0) {
        retentionDays = data.retention_days;
      }
    } catch {
      // sessiz geç — env varsayılanını kullan
    }

    let okCount = 0;

    for (const item of queue) {
      try {
        updateItem(item.id, { status: "preparing", progress: 2 });
        const prepared = await preparePhoto(item.file);
        updateItem(item.id, { preparedFile: prepared, status: "uploading", progress: 5 });

        const ext = (prepared.name.split(".").pop() ?? "jpg").toLowerCase();
        const path = `photos/${slug}/${crypto.randomUUID()}.${ext}`;
        const storageRef = ref(storage, path);
        const task = uploadBytesResumable(storageRef, prepared, {
          contentType: prepared.type || "image/jpeg",
          cacheControl: "public, max-age=31536000",
        });

        await new Promise<void>((resolve, reject) => {
          task.on(
            "state_changed",
            (snap) => {
              const pct = Math.round(
                (snap.bytesTransferred / snap.totalBytes) * 100
              );
              updateItem(item.id, { progress: Math.max(5, pct) });
            },
            (err) => reject(err),
            () => resolve()
          );
        });

        const url = await getDownloadURL(storageRef);
        const expireAt = new Date(
          Date.now() + retentionDays * 24 * 60 * 60 * 1000
        );
        await addDoc(collection(db, "photos"), {
          couple_id: coupleId,
          storage_path: path,
          public_url: url,
          uploader_name: trimmedName || null,
          like_count: 0,
          created_at: serverTimestamp(),
          expire_at: expireAt,
        });

        updateItem(item.id, { status: "done", progress: 100 });
        okCount += 1;
      } catch (err) {
        console.error("upload error:", err);
        const message = err instanceof Error ? err.message : "yükleme hatası";
        updateItem(item.id, { status: "error", errorMessage: message });
      }
    }

    if (okCount > 0) {
      fireConfetti();
      setPhase("done");
    } else {
      // Hiçbiri yüklenememişse seçim ekranında kal
      setPhase("selecting");
    }
  };

  const startOver = () => {
    queue.forEach((q) => URL.revokeObjectURL(q.previewUrl));
    setQueue([]);
    setPhase("idle");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const totalProgress =
    queue.length === 0
      ? 0
      : Math.round(queue.reduce((s, q) => s + q.progress, 0) / queue.length);
  const okCount = queue.filter((q) => q.status === "done").length;

  return (
    <div className="flex w-full flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        capture="environment"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Idle: Büyük buton ya da drop zone */}
      {phase === "idle" && (
        <div className="flex flex-col items-center text-center">
          {hasHover ? (
            <div
              onClick={pick}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`flex h-56 w-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed transition-all sm:h-64 sm:w-96 ${
                isDragging
                  ? "border-gold bg-gold/10 scale-[1.02]"
                  : "border-sand bg-white/60 hover:bg-ivory"
              }`}
            >
              <UploadIcon className="h-14 w-14 text-gold" />
              <p className="text-xl font-medium text-ink">
                Fotoğraf seç ya da sürükle bırak
              </p>
              <p className="max-w-xs text-sm text-ink-soft">
                Birden fazla foto seçebilirsiniz · iPhone HEIC otomatik
                dönüştürülür
              </p>
            </div>
          ) : (
            <button
              onClick={pick}
              className="group flex h-48 w-48 flex-col items-center justify-center gap-3 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] text-white shadow-xl shadow-gold/30 transition-transform active:scale-95 sm:h-56 sm:w-56"
            >
              <Camera className="h-16 w-16 transition-transform group-hover:scale-110" />
              <span className="text-xl font-medium">Fotoğraf Yükle</span>
            </button>
          )}
          <p className="mt-6 max-w-xs text-sm text-ink-soft">
            Butona basın, telefonunuzun kamerası ya da galerisi açılsın. iPhone
            fotoları (HEIC) otomatik dönüştürülür.
          </p>
        </div>
      )}

      {/* Selecting / Uploading: Önizleme + ilerleme */}
      {(phase === "selecting" || phase === "uploading") && (
        <div className="w-full max-w-2xl">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-ink-soft">
              {phase === "uploading"
                ? `Yükleniyor… ${okCount}/${queue.length}`
                : `${queue.length} fotoğraf seçildi`}
            </p>
            {phase === "selecting" && (
              <button
                onClick={pick}
                className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-rose-gold"
              >
                <ImagePlus className="h-4 w-4" />
                Ekle
              </button>
            )}
          </div>

          {phase === "uploading" && (
            <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-beige">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-rose-gold transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {queue.map((q) => (
              <div
                key={q.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-beige bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={q.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {q.status === "done" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/70 text-white">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                )}
                {(q.status === "preparing" || q.status === "uploading") && (
                  <>
                    <div className="absolute inset-0 bg-black/30" />
                    <Loader2 className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                      <div
                        className="h-full bg-white transition-all"
                        style={{ width: `${q.progress}%` }}
                      />
                    </div>
                  </>
                )}
                {q.status === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-rose-gold/80 p-2 text-center text-[10px] text-white">
                    {q.errorMessage ?? "Hata"}
                  </div>
                )}
                {phase === "selecting" && (
                  <button
                    onClick={() => removeItem(q.id)}
                    className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="Kaldır"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {phase === "selecting" && (
            <>
              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">
                  Adınız (opsiyonel)
                </label>
                <input
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  maxLength={40}
                  placeholder="Galeride 'Ahmet'in yüklediği' olarak görünür"
                  className="h-11 w-full rounded-xl border border-sand bg-white/70 px-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
              <button
                onClick={startUpload}
                className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] text-base font-medium text-white shadow-lg shadow-gold/25 transition-all hover:brightness-105 active:scale-[0.98]"
              >
                <UploadIcon className="h-5 w-5" />
                {queue.length === 1
                  ? "Fotoğrafı Yükle"
                  : `${queue.length} Fotoğrafı Yükle`}
              </button>
            </>
          )}
        </div>
      )}

      {/* Done */}
      {phase === "done" && (
        <div className="flex flex-col items-center text-center animate-float-up">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
          <p className="mt-4 font-serif text-3xl">Başarıyla Yüklendi!</p>
          <p className="mt-1 text-ink-soft">
            {okCount}/{queue.length} fotoğraf paylaşıldı{" "}
            <Sparkles className="inline h-4 w-4 text-gold" />
          </p>
          <button
            onClick={startOver}
            className="mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-full border border-sand bg-white/70 px-8 text-base font-medium text-ink transition-colors hover:bg-ivory"
          >
            <ImagePlus className="h-5 w-5 text-gold" />
            Daha Fazla Yükle
          </button>
        </div>
      )}
    </div>
  );
}
