import { NextRequest, NextResponse } from "next/server";
import { getContent, normLang } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const lang = normLang(req.nextUrl.searchParams.get("lang"));
  return NextResponse.json(await getContent(lang));
}
