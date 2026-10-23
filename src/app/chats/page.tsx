import type { Metadata } from "next";
import { LayoutPublico } from "@/components/layout-publico";
import Link from "next/link";
import { MessageCircle, PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { requireUser } from "@/lib/auth";
import { getMyConversations } from "@/lib/data/conversations";
import { formatRelative, statusLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Chats",
};

export default async function ChatsPage() {
  await requireUser("/chats");
  const conversations = await getMyConversations();
  const unread = conversations.reduce((total, item) => total + item.unreadCount, 0);

  return (
    <LayoutPublico>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Mensajes</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Tus chats</h1>
            <p className="mt-1 text-sm font-semibold text-muted">
              {conversations.length} conversación(es)
              {unread > 0 ? ` · ${unread} mensaje(s) sin leer` : ""}
            </p>
          </div>
          <Link
            href="/explorar?estado=perdido"
            className="text-sm font-black text-coral hover:underline"
          >
            Buscar más avisos
          </Link>
        </div>

        <div className="mt-6">
          {conversations.length === 0 ? (
            <EmptyState
              title="No tenés chats todavía"
              text="Cuando te interese un aviso, se abre un chat acá. También podés iniciar uno desde el detalle de una publicación."
              actionHref="/explorar?estado=perdido"
              actionLabel="Explorar avisos"
            />
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/chats/${conversation.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-white/75 p-3 transition-colors hover:bg-white"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                    {conversation.postPhoto ? (
                      <img
                        src={conversation.postPhoto}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-ink/25">
                        <PawPrint size={24} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-black">{conversation.otherName}</p>
                      <span className="shrink-0 text-[10px] font-bold text-muted">
                        {formatRelative(conversation.lastMessageAt ?? conversation.createdAt)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Badge tone={conversation.postStatus === "lost" ? "lost" : "found"}>
                        {statusLabel(conversation.postStatus)}
                      </Badge>
                      <span className="truncate text-[11px] font-bold text-muted">
                        {conversation.postTitle}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-semibold text-ink/70">
                        {conversation.lastMessage ?? "Chat abierto. Escribí el primero."}
                      </p>
                      {conversation.unreadCount > 0 ? (
                        <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-black text-white">
                          {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <MessageCircle size={18} className="shrink-0 text-muted" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutPublico>
  );
}
