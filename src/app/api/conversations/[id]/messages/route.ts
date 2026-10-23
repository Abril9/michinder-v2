import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "@/lib/validation";
import type { ChatMessage } from "@/lib/types";

const errors: Record<string, { status: number; error: string; retryAfter?: number }> = {
  MESSAGE_RATE_LIMIT: {
    status: 429,
    error: "Estás escribiendo muy rápido. Esperá un minuto.",
    retryAfter: 60,
  },
  MESSAGE_DAILY_LIMIT: {
    status: 429,
    error: "Llegaste al límite de mensajes por hoy.",
    retryAfter: 3600,
  },
  DUPLICATE_MESSAGE: {
    status: 429,
    error: "Ese mensaje ya lo enviaste hace un segundo.",
    retryAfter: 30,
  },
  BLOCKED: { status: 403, error: "No podés escribir en esta conversación." },
  NOT_FOUND: { status: 404, error: "Conversación no encontrada." },
  INVALID_BODY: { status: 400, error: "Escribí un mensaje válido." },
};

function mapError(message: string) {
  const key = Object.keys(errors).find((code) => message.includes(code));
  return key ? errors[key] : null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (!conversation) {
    return NextResponse.json({ error: "Conversación no encontrada." }, { status: 404 });
  }

  const after = new URL(request.url).searchParams.get("after");
  let query = supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(100);

  // Polling incremental: el cliente manda el timestamp del último mensaje.
  if (after && !Number.isNaN(new Date(after).getTime())) {
    query = query.gt("created_at", after);
  }

  const { data, error } = await query;
  if (error) {
    console.error("GET messages", error.message);
    return NextResponse.json({ error: "No pudimos cargar los mensajes." }, { status: 500 });
  }

  await supabase.rpc("mark_conversation_read", { p_conversation_id: id });

  const messages: ChatMessage[] = (data ?? []).map((message) => ({
    id: message.id,
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    body: message.body,
    createdAt: message.created_at,
  }));

  return NextResponse.json({ messages }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Mensaje inválido." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("send_message", {
    p_conversation_id: id,
    p_body: parsed.data.body,
  });

  if (error) {
    const mapped = mapError(error.message);
    console.error("POST message", error.message);
    return NextResponse.json(
      { error: mapped?.error ?? "No pudimos enviar el mensaje.", retryAfter: mapped?.retryAfter },
      { status: mapped?.status ?? 500 },
    );
  }

  return NextResponse.json({
    message: {
      id: data.id,
      conversationId: data.conversation_id,
      senderId: data.sender_id,
      body: data.body,
      createdAt: data.created_at,
    } satisfies ChatMessage,
  });
}
