"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { GuestMessage } from "@/lib/types";
import { BookHeart, Heart } from "lucide-react";

const MSG_LIKED_KEY = (id: string) => `bkb_liked_msg_${id}`;

interface Props {
  coupleId: string;
  initialMessages: GuestMessage[];
}

export function GuestBook({ coupleId, initialMessages }: Props) {
  const [messages, setMessages] = useState<GuestMessage[]>(initialMessages);

  useEffect(() => {
    const q = query(
      collection(getDb(), "guest_messages"),
      where("couple_id", "==", coupleId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items: GuestMessage[] = snap.docs.map((doc) => {
        const d = doc.data();
        const ts = d.created_at as { toMillis?: () => number } | null;
        const millis = ts?.toMillis ? ts.toMillis() : Date.now();
        return {
          id: doc.id,
          couple_id: d.couple_id,
          full_name: d.full_name ?? "Misafir",
          message: d.message ?? "",
          created_at: new Date(millis).toISOString(),
        };
      });
      items.sort((a, b) => b.created_at.localeCompare(a.created_at));
      setMessages(items.slice(0, 30));
    });
    return () => unsub();
  }, [coupleId]);

  const [optimisticHearts, setOptimisticHearts] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next: Record<string, boolean> = {};
    for (const m of messages) {
      if (localStorage.getItem(MSG_LIKED_KEY(m.id)) === "1") {
        next[m.id] = true;
      }
    }
    setLiked(next);
  }, [messages]);

  const sendHeart = async (id: string) => {
    if (liked[id]) return;
    setLiked((prev) => ({ ...prev, [id]: true }));
    setOptimisticHearts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    localStorage.setItem(MSG_LIKED_KEY(id), "1");
    try {
      await fetch(`/api/like/message/${id}`, { method: "POST" });
    } catch {
      // sessiz geç
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-beige bg-white/50 p-8 text-center text-ink-soft">
        <BookHeart className="h-8 w-8 text-gold" />
        <p>İlk dileği siz bırakmaya ne dersiniz?</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            layout
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="rounded-2xl border border-beige bg-white/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{m.full_name}</p>
                <p className="mt-1 whitespace-pre-wrap font-serif italic text-ink-soft">
                  “{m.message}”
                </p>
              </div>
              <button
                onClick={() => sendHeart(m.id)}
                disabled={liked[m.id]}
                className={`inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs transition-colors ${
                  liked[m.id]
                    ? "bg-rose-50 text-rose-gold"
                    : "bg-ivory text-ink-soft hover:bg-beige"
                }`}
                aria-label="Mesaja kalp at"
              >
                <Heart
                  className="h-3.5 w-3.5"
                  fill={liked[m.id] ? "currentColor" : "none"}
                />
                <span className="tabular-nums">
                  {(m.heart_count ?? 0) + (optimisticHearts[m.id] ?? 0)}
                </span>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
