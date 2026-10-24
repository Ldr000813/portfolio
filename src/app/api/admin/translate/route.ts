import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getContent, saveContent, Content } from "@/lib/content";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TARGETS: { lang: "zh" | "en"; label: string }[] = [
  { lang: "zh", label: "简体中文 (Simplified Chinese)" },
  { lang: "en", label: "natural, professional English" },
];

// POST: 日本語コンテンツを読み、中文・英語に自動翻訳して保存
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "GEMINI_API_KEY が未設定です" }, { status: 500 });

  const ja = await getContent("ja");
  const done: string[] = [];
  const failed: string[] = [];
  for (const t of TARGETS) {
    const tr = await translate(ja, t.label, key);
    if (tr) { await saveContent(t.lang, tr); done.push(t.lang); }
    else failed.push(t.lang);
  }
  return NextResponse.json({ ok: failed.length === 0, done, failed });
}

async function translate(content: Content, label: string, key: string): Promise<Content | null> {
  const clean = (s: string) => s.replace(/["'\s]/g, "");
  const envList = (process.env.GEMINI_MODELS || "").split(",").map(clean).filter(Boolean);
  const chain = (envList.length ? envList : [process.env.GEMINI_MODEL || "gemini-2.5-flash", "gemini-flash-latest", "gemini-3.8-flash"])
    .filter((m, i, a) => a.indexOf(m) === i);

  const prompt = `Translate the Japanese text values in the following JSON into ${label}.
Rules:
- Keep every JSON key and the structure EXACTLY the same.
- Translate ONLY human-readable text values.
- Do NOT change: email addresses; any value starting with "http"; the arrays "stack" and "skills"; the fields "icon", "accent", "image", "photo".
- Keep brand / tech / proper nouns as-is: Next.js, TypeScript, React, Supabase, Vercel, Node.js, Gemini, LINE, SIED, となり (Tonari), 同志社大学, 泉北高校.
- Use a natural, professional business tone (as a freelance web engineer's portfolio).
- Output ONLY the translated JSON. No explanation, no code fences.

JSON:
${JSON.stringify(content)}`;

  const body = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.3 } };

  for (const m of chain) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (!r.ok) continue; // 404/400/429/5xx いずれも次のモデルへ
      const data = await r.json();
      const text: string = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
      const parsed = safeJson(text);
      if (parsed && parsed.hero && parsed.services && parsed.contact && parsed.profile) {
        // 念のため、翻訳してはいけない値は日本語（原本）で上書きして保全
        return { ...parsed, contact: { ...parsed.contact, email: content.contact.email } } as Content;
      }
    } catch { /* try next model */ }
  }
  return null;
}

function safeJson(t: string): any | null {
  try { return JSON.parse(t); } catch {}
  const m = t.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}
