import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// POST /api/admin/translate-batch?target=zh|en  body: { texts: string[] }
// 短い文字列の配列を1回で翻訳して返す（小分けにして504を回避）
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "GEMINI_API_KEY が未設定です" }, { status: 500 });

  const target = req.nextUrl.searchParams.get("target") === "en" ? "en" : "zh";
  const label = target === "en" ? "natural, professional English" : "简体中文 (Simplified Chinese)";
  const { texts } = await req.json();
  if (!Array.isArray(texts)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (texts.length === 0) return NextResponse.json({ translations: [] });

  const out = await translateArray(texts.map((t) => String(t)), label, key);
  if (!out) return NextResponse.json({ error: "translate_failed" }, { status: 502 });
  return NextResponse.json({ translations: out });
}

async function translateArray(texts: string[], label: string, key: string): Promise<string[] | null> {
  const clean = (s: string) => s.replace(/["'\s]/g, "");
  const envList = (process.env.GEMINI_MODELS || "").split(",").map(clean).filter(Boolean);
  const chain = (envList.length ? envList : [process.env.GEMINI_MODEL || "gemini-2.5-flash", "gemini-flash-latest", "gemini-3.8-flash"])
    .filter((m, i, a) => a.indexOf(m) === i);

  const prompt = `Translate each element of the following JSON string array into ${label}.
Output ONLY a JSON array of the same length and same order; each element is the translation of the corresponding input element.
Keep unchanged: brand/tech/proper nouns (Next.js, TypeScript, React, Supabase, Vercel, Node.js, Gemini, LINE, SIED, となり/Tonari, 同志社大学, 泉北高校), URLs, and email addresses.
Natural, professional business tone.

Array:
${JSON.stringify(texts)}`;

  const body = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.3 } };

  for (const m of chain) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!r.ok) continue;
      const data = await r.json();
      const text: string = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
      const arr = safeArr(text);
      if (Array.isArray(arr) && arr.length === texts.length) return arr.map((x) => String(x));
    } catch {
      clearTimeout(timer);
    }
  }
  return null;
}

function safeArr(t: string): any {
  try { const v = JSON.parse(t); return v; } catch {}
  const m = t.match(/\[[\s\S]*\]/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}
