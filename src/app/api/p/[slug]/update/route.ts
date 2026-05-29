import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCoupleBySlug } from "@/lib/queries";
import { isCoupleAuthenticated } from "@/lib/couple-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { parseProgramItems, parseStoryItems } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_THEMES = ["classic-gold", "romantic-rose", "modern-beige"] as const;
const VALID_FILTERS = ["none", "bw", "vintage", "soft"] as const;
type Theme = (typeof VALID_THEMES)[number];
type CoverFilter = (typeof VALID_FILTERS)[number];

interface UpdateBody {
  welcome_message?: unknown;
  dress_code?: unknown;
  program?: unknown;
  story?: unknown;
  music_label?: unknown;
  theme?: unknown;
  cover_filter?: unknown;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  if (!couple) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  if (!(await isCoupleAuthenticated(couple.id, couple.portal_token))) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (typeof body.welcome_message === "string") {
    const v = body.welcome_message.trim();
    if (v.length > 600) {
      return NextResponse.json(
        { error: "Karşılama metni 600 karakterden uzun olamaz." },
        { status: 400 }
      );
    }
    update.welcome_message = v || null;
  }

  if (typeof body.dress_code === "string") {
    const v = body.dress_code.trim();
    if (v.length > 200) {
      return NextResponse.json(
        { error: "Kıyafet kodu 200 karakteri aşamaz." },
        { status: 400 }
      );
    }
    update.dress_code = v || null;
  }

  if (typeof body.program === "string") {
    const items = parseProgramItems(body.program);
    update.program_items = items.length > 0 ? items : null;
  }

  if (typeof body.story === "string") {
    const items = parseStoryItems(body.story);
    update.story_items = items.length > 0 ? items : null;
  }

  if (typeof body.music_label === "string") {
    update.music_label = body.music_label.trim() || null;
  }

  if (typeof body.theme === "string") {
    if (!VALID_THEMES.includes(body.theme as Theme)) {
      return NextResponse.json({ error: "Geçersiz tema." }, { status: 400 });
    }
    update.theme = body.theme;
  }

  if (typeof body.cover_filter === "string") {
    if (!VALID_FILTERS.includes(body.cover_filter as CoverFilter)) {
      return NextResponse.json(
        { error: "Geçersiz filtre." },
        { status: 400 }
      );
    }
    update.cover_filter = body.cover_filter;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "Güncellenecek alan yok." },
      { status: 400 }
    );
  }

  try {
    await getAdminDb().collection("couples").doc(couple.id).update(update);
    revalidatePath(`/${slug}`);
    revalidatePath(`/p/${slug}`);
    revalidatePath(`/p/${slug}/duzenle`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json(
      { error: `Kayıt başarısız: ${message}` },
      { status: 500 }
    );
  }
}
