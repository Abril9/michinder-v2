import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/data/conversations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ count: 0 });
  const count = await getUnreadCount();
  return NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
}
