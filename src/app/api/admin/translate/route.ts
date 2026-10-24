import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getContent, saveContent, Content } from "@/lib/content";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// POST /api/admin/translate?target=zh|en
// 日本語コンテンツを、指定の1言語だけ翻訳して保存（分割して504を回避）
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "GEMINI_API_KEY が未設定です" }, { status: 500 });

  const target = req.nextUrl.searchParams.get("target") === "en" ? "en" : "zh";
  const label = target === "en" ? "natural, professional English" : "简体中文 (Simplified Chinese)";

  const ja = await getContent("ja");
  const tr = await translate(ja, label, key);
  if (!tr) return NextResponse.json({ error: "translate_failed", target }, { status: 502 });
  await saveContent(target, tr);
  return NextResponse.json({ ok: true, target });
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
- Natural, professional business tone (a freelance web engineer's portfolio).
- Output ONLY the translated JSON. No explanation, no code fences.

JSON:
${JSON.stringify(content)}`;

  const body = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.3 } };

  for (const m of chain) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 22000); // 遅いモデルは22秒で打ち切り→次へ
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!r.ok) continue;
      const data = await r.json();
      const text: string = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
      const parsed = safeJson(text);
      if (parsed && parsed.hero && parsed.services && parsed.contact && parsed.profile) {
        return { ...parsed, contact: { ...parsed.contact, email: content.contact.email } } as Content;
      }
    } catch {
      clearTimeout(timer); // abort や通信エラー → 次モデル
    }
  }
  return null;
}

function safeJson(t: string): any | null {
  try { return JSON.parse(t); } catch {}
  const m = t.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}
