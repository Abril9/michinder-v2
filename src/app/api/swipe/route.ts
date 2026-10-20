import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { swipeSchema } from "@/lib/validation";

const messages: Record<string, { status: number; error: string }> = {
  CHAT_LIMIT: {
    status: 429,
    error: "Alcanzaste el límite de 10 chats nuevos por día. Probá mañana.",
  },
  MESSAGE_RATE_LIMIT: {
    status: 429,
    error: "Estás escribiendo muy rápido. Esperá un momento.",
  },
  BLOCKED: { status: 403, error: "No podés interactuar con este usuario." },
  OWN_POST: { status: 400, error: "No podés swipear tu propia publicación." },
  POST_RESOLVED: { status: 409, error: "Esta publicación ya se resolvió." },
  POST_NOT_FOUND: { status: 404, error: "La publicación no existe." },
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Ingresá para guardar intereses." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = swipeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("swipe_post", {
    p_post_id: parsed.data.postId,
    p_action: parsed.data.action,
  });

  if (error) {
    const code = Object.keys(messages).find((key) => error.message.includes(key));
    const mapped = code ? messages[code] : null;
    console.error("POST /api/swipe", error.message);
    return NextResponse.json(
      { error: mapped?.error ?? "No pudimos guardar la acción." },
      { status: mapped?.status ?? 500 },
    );
  }

  return NextResponse.json({ ok: true, conversationId: data ?? null });
}
