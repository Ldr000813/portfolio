import { NextRequest } from "next/server";

export function isAdmin(req: NextRequest): boolean {
  const env = process.env.ADMIN_PASSWORD || "";
  const sent = req.headers.get("x-admin-password") || "";
  return env.length > 0 && sent === env;
}
