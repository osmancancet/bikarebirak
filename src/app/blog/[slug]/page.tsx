import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { POSTS } from "@/data/blog";
import { ArrowLeft, Clock, Calendar, MessageCircle } from "lucide-react";

export const dynamic = "force-static";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Yazı bulunamadı" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return {
    title: `${post.title} — BiKareBırak Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      images: [{ url: post.cover_image, width: 1200, height: 600 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image],
    },
  };
}

const WHATSAPP_LINK = `https://wa.me/905548364486?text=${encodeURIComponent(
  "Merhaba, BiKareBırak hakkında bilgi almak istiyorum."
)}`;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const html = await marked.parse(post.body, { breaks: true });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.cover_image],
    datePublished: post.published_at,
    author: { "@type": "Organization", name: "BiKareBırak" },
    publisher: {
      "@type": "Organization",
      name: "BiKareBırak",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.svg`,
      },
    },
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
  };

  return (
    <main className="flex flex-1 flex-col px-5 py-14">
      <article className="mx-auto w-full max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm yazılar
        </Link>

        <header className="mt-6">
          <span className="inline-flex rounded-full bg-ivory px-3 py-1 text-xs uppercase tracking-widest text-gold">
            {post.category}
          </span>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.read_minutes} dakika okuma
            </span>
          </div>
        </header>

        <div
          className="my-10 aspect-[16/8] rounded-2xl bg-cover bg-center shadow-lg"
          style={{ backgroundImage: `url(${post.cover_image})` }}
          aria-hidden
        />

        <div
          className="blog-body prose max-w-none text-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* CTA */}
        <div className="mt-14 rounded-card border border-beige bg-ivory/60 p-7 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gold">
            BiKareBırak
          </p>
          <h3 className="mt-2 font-serif text-2xl">
            Düğününüzü dijital olarak büyüleyici hale getirin
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
            Dijital davetiye, LCV yönetimi, canlı fotoğraf galerisi — hepsi
            anahtar teslim 5.000 ₺.
          </p>
          <a
            href={WHATSAPP_LINK}
            className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-6 text-sm font-medium text-white shadow-md hover:brightness-105"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp'tan Bilgi Al
          </a>
        </div>
      </article>
    </main>
  );
}
