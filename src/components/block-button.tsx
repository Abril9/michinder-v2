"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function BlockButton({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function block() {
    if (!window.confirm(`¿Bloquear a ${userName}? No van a poder contactarse más.`)) return;

    setLoading(true);
    try {
      const response = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        toast.error(data.error ?? "No pudimos bloquear al usuario.");
        return;
      }
      toast.success("Usuario bloqueado.");
      router.push("/chats");
      router.refresh();
    } catch {
      toast.error("Se cortó la conexión. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={block} disabled={loading}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldOff size={14} />}
      Bloquear
    </Button>
  );
}
