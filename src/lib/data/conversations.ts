import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getPostById } from "@/lib/data/posts";
import type { ConversationContext, ConversationSummary } from "@/lib/types";

type RawMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type RawConversation = {
  id: string;
  post_id: string;
  post_title: string;
  post_photo: string | null;
  post_status: ConversationSummary["postStatus"];
  other_id: string;
  other_name: string;
  other_city: string | null;
  other_show_whatsapp: boolean;
  other_whatsapp: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
};

export async function getMyConversations(): Promise<ConversationSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("my_conversations");
  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as RawConversation[]).map((row) => ({
    id: row.id,
    postId: row.post_id,
    postTitle: row.post_title,
    postPhoto: row.post_photo,
    postStatus: row.post_status,
    otherId: row.other_id,
    otherName: row.other_name,
    otherCity: row.other_city,
    otherShowWhatsapp: Boolean(row.other_show_whatsapp),
    otherWhatsapp: row.other_whatsapp,
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
    unreadCount: Number(row.unread_count ?? 0),
    createdAt: row.created_at,
  }));
}

export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("unread_count");
  if (error) return 0;
  return Number(data ?? 0);
}

export async function getConversationContext(
  conversationId: string,
  userId: string,
): Promise<ConversationContext | null> {
  const supabase = await createClient();
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, post_id, owner_id, interested_id, created_at")
    .eq("id", conversationId)
    .maybeSingle();

  if (!conversation) return null;

  const otherId =
    conversation.owner_id === userId ? conversation.interested_id : conversation.owner_id;

  const { data: outgoingBlock } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", userId)
    .eq("blocked_id", otherId)
    .maybeSingle();

  if (outgoingBlock) return null;

  const [{ data: other }, post, { data: messages }] = await Promise.all([
    supabase
      .from("profiles_public")
      .select("id, name, city, show_whatsapp, whatsapp")
      .eq("id", otherId)
      .maybeSingle(),
    getPostById(conversation.post_id),
    supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(300),
  ]);

  if (!post || !other) return null;

  return {
    conversation: {
      id: conversation.id,
      postId: conversation.post_id,
      ownerId: conversation.owner_id,
      interestedId: conversation.interested_id,
      createdAt: conversation.created_at,
    },
    other: {
      id: other.id ?? otherId,
      name: other.name ?? "Usuario",
      city: other.city,
      showWhatsapp: Boolean(other.show_whatsapp),
      whatsapp: other.whatsapp,
    },
    post,
    messages: ((messages ?? []) as unknown as RawMessage[]).map((message) => ({
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_id,
      body: message.body,
      createdAt: message.created_at,
    })),
  };
}

export async function markConversationRead(conversationId: string) {
  const supabase = await createClient();
  await supabase.rpc("mark_conversation_read", { p_conversation_id: conversationId });
}

export async function getExistingConversation(postId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id")
    .eq("post_id", postId)
    .eq("interested_id", userId)
    .maybeSingle();
  return data?.id ?? null;
}

export async function getPostInterestCount(postId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .eq("post_id", postId);
  return count ?? 0;
}
