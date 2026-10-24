import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getContent, saveContent, normLang, Content } from "@/lib/content";

export const dynamic = "force-dynamic";

// GET: load content for a language (also verifies the password)
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const lang = normLang(req.nextUrl.searchParams.get("lang"));
  return NextResponse.json(await getContent(lang));
}

// POST: save content for a language
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const lang = normLang(req.nextUrl.searchParams.get("lang"));
  try {
    const body = (await req.json()) as Content;
    await saveContent(lang, body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "save_failed" }, { status: 500 });
  }
}
