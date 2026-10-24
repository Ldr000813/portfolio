import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const ABORT_MS = 50000;

// POST /api/admin/translate-batch?target=zh|en  body: { texts: string[] }
// 短い文字列の配列を1回で翻訳して返す（小分けにして504を回避）
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "GEMINI_API_KEY が未設定です" }, { status: 500 });

  const target = req.nextUrl.searchParams.get("target") === "en" ? "en" : "zh";
  const model = (req.nextUrl.searchParams.get("model") || "gemini-2.5-flash").replace(/["'\s]/g, "");
  const label = target === "en" ? "natural, professional English" : "简体中文 (Simplified Chinese)";
  const { texts } = await req.json();
  if (!Array.isArray(texts)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (texts.length === 0) return NextResponse.json({ translations: [] });

  const res = await translateArray(texts.map((t) => String(t)), label, key, model);
  if (!res.translations) return NextResponse.json({ error: "translate_failed", model, detail: res.detail }, { status: 502 });
  return NextResponse.json({ translations: res.translations, model });
}

// 1モデルだけ試す（9秒で打ち切り）。バージョンダウンはクライアント側で回す。
async function translateArray(texts: string[], label: string, key: string, model: string): Promise<{ translations?: string[]; detail?: string }> {
  const prompt = `Translate each element of the following JSON string array into ${label}.
Output ONLY a JSON array of the same length and same order; each element is the translation of the corresponding input element.
Keep unchanged: brand/tech/proper nouns (Next.js, TypeScript, React, Supabase, Vercel, Node.js, Gemini, LINE, SIED, となり/Tonari, 同志社大学, 泉北高校), URLs, and email addresses.
Natural, professional business tone.

Array:
${JSON.stringify(texts)}`;
  const body = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.3 } };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ABORT_MS);
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!r.ok) {
      const body = (await r.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 220);
      return { detail: `HTTP ${r.status} ${body}` };
    }
    const data = await r.json();
    const fr = data?.candidates?.[0]?.finishReason;
    const text: string = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
    if (!text) return { detail: `empty response${fr ? ` (finishReason=${fr})` : ""}` };
    const arr = safeArr(text);
    if (Array.isArray(arr) && arr.length === texts.length) return { translations: arr.map((x) => String(x)) };
    return { detail: `bad output: got ${Array.isArray(arr) ? arr.length : "non-array"} vs expected ${texts.length}. sample=${text.slice(0, 120)}` };
  } catch (e: any) {
    clearTimeout(timer);
    return { detail: e?.name === "AbortError" ? `timeout(${ABORT_MS / 1000}s)` : `fetch error: ${e?.message || "unknown"}` };
  }
}

function safeArr(t: string): any {
  try { const v = JSON.parse(t); return v; } catch {}
  const m = t.match(/\[[\s\S]*\]/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}
