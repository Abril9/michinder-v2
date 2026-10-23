import type { Metadata } from "next";
import { LayoutPublico } from "@/components/layout-publico";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { BlockButton } from "@/components/block-button";
import { ChatRoom } from "@/components/chat-room";
import { ShareButtons } from "@/components/share-buttons";
import { requireUser } from "@/lib/auth";
import { getConversationContext, markConversationRead } from "@/lib/data/conversations";
import { petTitle, statusLabel, whatsappHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Chat",
};

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser(`/chats/${id}`);
  const context = await getConversationContext(id, user.id);
  if (!context) notFound();

  await markConversationRead(id);

  const { conversation, other, post, messages } = context;
  const title = `${petTitle(post)} · ${statusLabel(post.status)} en Michinder`;
  const whatsappMessage = `Hola ${other.name}, te escribo por el aviso de ${petTitle(
    post,
  )} en Michinder.`;

  return (
    <LayoutPublico>
      <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        <Link
          href="/chats"
          className="inline-flex items-center gap-1.5 text-sm font-extrabold text-muted hover:text-ink"
        >
          <ArrowLeft size={16} /> Volver a chats
        </Link>

        <div className="mt-3 overflow-hidden rounded-[2rem] border border-line bg-white/75 shadow-[0_24px_60px_-40px_rgba(12,47,35,0.5)]">
          <header className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-black text-cream">
                {other.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black">{other.name}</p>
                <p className="text-xs font-semibold text-muted">
                  {other.city || "Santa Fe"}
                  {other.showWhatsapp ? " · WhatsApp autorizado" : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {other.showWhatsapp && other.whatsapp ? (
                  <a
                    href={whatsappHref(other.whatsapp, whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("outline", "sm", "text-verde")}
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                ) : null}
                <ShareButtons path={`/publicacion/${post.id}`} title={title} compact />
                <BlockButton userId={other.id} userName={other.name} />
              </div>
            </div>

            <Link
              href={`/publicacion/${post.id}`}
              className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-cream/60 p-2.5 hover:bg-cream"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand">
                {post.photos[0] ? (
                  <img src={post.photos[0].url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/25">
                    <PawPrint size={20} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Badge tone={post.status === "lost" ? "lost" : "found"}>
                    {statusLabel(post.status)}
                  </Badge>
                  <span className="truncate text-xs font-black">{petTitle(post)}</span>
                </div>
                <p className="truncate text-[11px] font-semibold text-muted">
                  {post.locationLabel} · radio {post.searchRadiusKm} km
                </p>
              </div>
            </Link>
          </header>

          <div className="border-t border-line">
            <ChatRoom
              conversationId={conversation.id}
              currentUserId={user.id}
              initialMessages={messages}
            />
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] font-semibold text-muted">
          No compartas datos sensibles. Si alguien te incomoda, bloquealo o reportá el aviso.
        </p>
      </div>
    </LayoutPublico>
  );
}
