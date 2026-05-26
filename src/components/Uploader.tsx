"use client";

import { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorageClient, getDb } from "@/lib/firebase/client";
import { Camera, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";

type Phase = "idle" | "uploading" | "done" | "error";

// Fotoğraflar bu süre sonunda otomatik silinir (varsayılan 7 gün).
const RETENTION_DAYS = Number(process.env.NEXT_PUBLIC_RETENTION_DAYS ?? "7");

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

export function Uploader({
  coupleId,
  slug,
}: {
  coupleId: string;
  slug: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const pick = () => inputRef.current?.click();

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setPhase("uploading");
    setProgress(0);
    setUploadedCount(0);
    setTotal(files.length);
    setMessage(null);

    const storage = getStorageClient();
    const db = getDb();
    let ok = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `photos/${slug}/${crypto.randomUUID()}.${ext}`;

      try {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file, {
          contentType: file.type || "image/jpeg",
          cacheControl: "public, max-age=31536000",
        });
        const url = await getDownloadURL(storageRef);
        const expireAt = new Date(
          Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000
        );
        await addDoc(collection(db, "photos"), {
          couple_id: coupleId,
          storage_path: path,
          public_url: url,
          created_at: serverTimestamp(),
          expire_at: expireAt,
        });
        ok += 1;
      } catch (err) {
        console.error("upload error:", err);
      }

      setUploadedCount(i + 1);
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    // input'u sıfırla ki aynı dosya tekrar seçilebilsin
    if (inputRef.current) inputRef.current.value = "";

    if (ok === 0) {
      setPhase("error");
      setMessage("Yükleme başarısız oldu. Lütfen tekrar deneyin.");
    } else {
      setPhase("done");
      setMessage(
        ok === files.length
          ? `${ok} fotoğraf başarıyla yüklendi!`
          : `${ok}/${files.length} fotoğraf yüklendi.`
      );
      fireConfetti();
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={handleFiles}
      />

      {phase === "uploading" ? (
        <div className="w-full max-w-sm text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold" />
          <p className="mt-4 text-lg font-medium">Yükleniyor…</p>
          <p className="text-sm text-ink-soft">
            {uploadedCount} / {total} fotoğraf
          </p>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-beige">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-rose-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : phase === "done" ? (
        <div className="flex flex-col items-center text-center animate-float-up">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
          <p className="mt-4 font-serif text-3xl">Başarıyla Yüklendi!</p>
          <p className="mt-1 text-ink-soft">{message}</p>
          <button
            onClick={pick}
            className="mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-full border border-sand bg-white/70 px-8 text-base font-medium text-ink transition-colors hover:bg-ivory"
          >
            <ImagePlus className="h-5 w-5 text-gold" />
            Daha Fazla Yükle
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <button
            onClick={pick}
            className="group flex h-48 w-48 flex-col items-center justify-center gap-3 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] text-white shadow-xl shadow-gold/30 transition-transform active:scale-95 sm:h-56 sm:w-56"
          >
            <Camera className="h-16 w-16 transition-transform group-hover:scale-110" />
            <span className="text-xl font-medium">Fotoğraf Yükle</span>
          </button>
          {phase === "error" && message && (
            <p className="mt-4 text-sm text-rose-gold">{message}</p>
          )}
          <p className="mt-6 max-w-xs text-sm text-ink-soft">
            Butona basın, telefonunuzun kamerası ya da galerisi açılsın. Bir veya
            birden fazla fotoğraf seçebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
