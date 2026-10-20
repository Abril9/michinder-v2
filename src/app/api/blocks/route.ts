import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const blockSchema = z.object({ userId: z.string().uuid() });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Ingresá para bloquear." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = blockSchema.safeParse(body);
  if (!parsed.success || parsed.data.userId === user.id) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("blocks").upsert(
    { blocker_id: user.id, blocked_id: parsed.data.userId },
    { onConflict: "blocker_id,blocked_id" },
  );

  if (error) {
    console.error("POST /api/blocks", error.message);
    return NextResponse.json({ error: "No pudimos bloquear al usuario." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
