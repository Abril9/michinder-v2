"use client";

import { Copy, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButtons({
  path,
  title,
  compact = false,
}: {
  path: string;
  title: string;
  compact?: boolean;
}) {
  function fullUrl() {
    return new URL(path, window.location.origin).toString();
  }

  async function share() {
    const url = fullUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title} en Michinder`, url });
        return;
      } catch {
        return;
      }
    }
    await copy(url);
  }

  async function copy(url = fullUrl()) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado.");
    } catch {
      toast.error("No pudimos copiar el link.");
    }
  }

  function whatsapp() {
    const url = fullUrl();
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} · ${url}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (compact) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={share}
          aria-label="Compartir"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-muted hover:text-ink"
        >
          <Share2 size={17} />
        </button>
        <button
          type="button"
          onClick={whatsapp}
          aria-label="Compartir por WhatsApp"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-[#128c7e] hover:bg-emerald-50"
        >
          <MessageCircle size={17} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={share}>
        <Share2 size={15} /> Compartir
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={whatsapp}>
        <MessageCircle size={15} /> WhatsApp
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => copy()}>
        <Copy size={15} /> Copiar
      </Button>
    </div>
  );
}
