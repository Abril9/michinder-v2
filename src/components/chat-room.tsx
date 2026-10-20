"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { formatChatDay, formatChatTime } from "@/lib/format";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChatRoom({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAtRef = useRef(initialMessages.at(-1)?.createdAt ?? "");

  function mergeMessages(incoming: ChatMessage[]) {
    if (incoming.length === 0) return;
    setMessages((previous) => {
      const ids = new Set(previous.map((message) => message.id));
      const next = [...previous, ...incoming.filter((message) => !ids.has(message.id))];
      return next.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });
  }

  useEffect(() => {
    if (messages.length === 0) return;
    lastAtRef.current = messages[messages.length - 1].createdAt;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    let active = true;

    async function poll() {
      if (document.visibilityState !== "visible") return;
      try {
        const after = lastAtRef.current
          ? `?after=${encodeURIComponent(lastAtRef.current)}`
          : "";
        const response = await fetch(`/api/conversations/${conversationId}/messages${after}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { messages?: ChatMessage[] };
        if (active) mergeMessages(data.messages ?? []);
      } catch {
        // El polling no debe mostrar errores por cortes momentáneos.
      }
    }

    const timer = window.setInterval(poll, 3000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [conversationId]);

  async function send(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const body = input.trim();
    if (!body || sending) return;

    setSending(true);
    setError(null);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = (await response.json()) as { error?: string; message?: ChatMessage };
      if (!response.ok || !data.message) {
        const message = data.error ?? "No pudimos enviar el mensaje.";
        setError(message);
        toast.error(message);
        return;
      }
      mergeMessages([data.message]);
      setInput("");
    } catch {
      setError("Se cortó la conexión. Probá de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[62vh] min-h-[430px] flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-base font-black">Todavía no hay mensajes</p>
              <p className="mt-1 text-sm font-semibold text-muted">
                Escribí el primero para coordinar.
              </p>
            </div>
          </div>
        ) : null}

        {messages.map((message, index) => {
          const own = message.senderId === currentUserId;
          const previous = messages[index - 1];
          const showDay =
            !previous ||
            formatChatDay(previous.createdAt) !== formatChatDay(message.createdAt);

          return (
            <div key={message.id}>
              {showDay ? (
                <p className="my-3 text-center text-[10px] font-black uppercase tracking-wide text-muted">
                  {formatChatDay(message.createdAt)}
                </p>
              ) : null}
              <div className={cn("flex", own ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[82%] rounded-2xl px-3.5 py-2 text-sm font-semibold leading-relaxed",
                    own
                      ? "rounded-br-md bg-coral text-white"
                      : "rounded-bl-md border border-line bg-white text-ink",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{message.body}</p>
                  <p
                    className={cn(
                      "mt-1 text-right text-[10px] font-bold",
                      own ? "text-white/70" : "text-muted",
                    )}
                  >
                    {formatChatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={send} className="border-t border-line bg-cream/60 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            rows={1}
            maxLength={1000}
            placeholder="Escribí un mensaje..."
            className="max-h-28 min-h-11 flex-1 resize-y rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold focus:border-coral focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || input.trim().length === 0}
            aria-label="Enviar mensaje"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral text-white disabled:opacity-50"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="mt-1 px-1 text-right text-[10px] font-bold text-muted">
          {input.length}/1000 · Enter para enviar
        </p>
      </form>
    </div>
  );
}
