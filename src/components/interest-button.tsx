"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui/button";

export function InterestButton({
  postId,
  isLoggedIn,
  conversationId,
  loginHref,
}: {
  postId: string;
  isLoggedIn: boolean;
  conversationId?: string | null;
  loginHref: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (conversationId) {
    return (
      <ButtonLink href={`/chats/${conversationId}`} size="lg" className="w-full">
        <MessageCircle size={18} /> Ir al chat
      </ButtonLink>
    );
  }

  if (!isLoggedIn) {
    return (
      <ButtonLink href={loginHref} size="lg" className="w-full">
        <Heart size={18} /> Ingresá para contactar
      </ButtonLink>
    );
  }

  async function handleInterest() {
    setLoading(true);
    try {
      const response = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "like" }),
      });
      const data = (await response.json()) as {
        error?: string;
        conversationId?: string | null;
      };
      if (!response.ok) {
        toast.error(data.error ?? "No pudimos abrir el chat.");
        return;
      }
      if (data.conversationId) {
        toast.success("Chat creado.");
        router.push(`/chats/${data.conversationId}`);
      }
    } catch {
      toast.error("Se cortó la conexión. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full" onClick={handleInterest} disabled={loading}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} />}
        {loading ? "Abriendo chat..." : "Me interesa, quiero contactar"}
      </Button>
      <p className="text-center text-[11px] font-semibold text-muted">
        Se abre un chat interno con límite anti-spam.{" "}
        <Link href="/legal/privacidad" className="underline hover:text-ink">
          Cómo cuidamos tus datos
        </Link>
      </p>
    </div>
  );
}
