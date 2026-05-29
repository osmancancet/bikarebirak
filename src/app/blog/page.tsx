import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/blog";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — BiKareBırak",
  description:
    "Düğün hazırlığı, dijital davetiye trendleri ve fotoğraf rehberleri.",
};

export default function BlogIndexPage() {
  return (
    <main className="flex flex-1 flex-col px-5 py-14">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Ana sayfa
        </Link>

        <header className="mt-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Blog</p>
          <h1 className="mt-3 font-serif text-5xl">Düğün Rehberleri & Trendler</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">
            Düğün hazırlığı, dijital davetiye trendleri, fotoğraf rehberleri ve
            daha fazlası.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}>
              <Card className="flex h-full flex-col overflow-hidden p-0 transition-transform hover:-translate-y-1">
                <div
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.cover_image})` }}
                  aria-hidden
                />
                <div className="flex flex-1 flex-col p-5">
                  <span className="inline-flex w-fit rounded-full bg-ivory px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-gold">
                    {p.category}
                  </span>
                  <h2 className="mt-3 font-serif text-xl leading-tight text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                    {p.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-soft">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.published_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {p.read_minutes} dk
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
