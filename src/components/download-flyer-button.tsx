"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Download, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DownloadFlyerButton({
  postId,
  fileName,
  className,
}: {
  postId: string;
  fileName: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);
  const canShare = useSyncExternalStore(
    subscribeShareCapability,
    getShareCapability,
    getServerShareCapability,
  );
  const blobPromise = useRef<Promise<Blob> | null>(null);

  function getBlob() {
    if (!blobPromise.current) {
      blobPromise.current = fetch(`/publicacion/${postId}/flyer`, {
        cache: "no-store",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`No se pudo generar la imagen (${response.status})`);
          }
          return response.blob();
        })
        .catch((error) => {
          blobPromise.current = null;
          throw error;
        });
    }

    return blobPromise.current;
  }

  async function run(action: () => Promise<void>) {
    if (pending) return;

    setPending(true);
    try {
      await action();
    } catch {
      toast.error("No pudimos generar la imagen. Probá de nuevo.");
    } finally {
      setPending(false);
    }
  }

  function handleDownload() {
    return run(async () => {
      const blob = await getBlob();
      saveBlob(blob, fileName);
      toast.success("Imagen descargada.");
    });
  }

  function handleShare() {
    return run(async () => {
      const blob = await getBlob();
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Aviso de Michinder",
          });
          return;
        } catch (error) {
          if (isAbort(error)) return;
        }
      }

      saveBlob(blob, fileName);
      toast.success("Imagen descargada.");
    });
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={pending}
        title="Imagen 1080×1920 para historias"
      >
        {pending ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Download size={15} />
        )}
        {pending ? "Generando..." : "Descargar imagen"}
      </Button>

      {canShare ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleShare}
          disabled={pending}
        >
          <Share2 size={15} /> Compartir imagen
        </Button>
      ) : null}
    </div>
  );
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function subscribeShareCapability() {
  return () => {};
}

function getShareCapability() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function getServerShareCapability() {
  return false;
}
