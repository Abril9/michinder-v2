"use client";

import { useState } from "react";
import { Flag, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui/button";

const reasons = [
  "Información falsa",
  "Spam o estafa",
  "Contenido ofensivo",
  "Maltrato animal",
  "Otro",
];

export function ReportButton({
  postId,
  reportedUserId,
  isLoggedIn,
  loginHref,
}: {
  postId: string;
  reportedUserId: string;
  isLoggedIn: boolean;
  loginHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <ButtonLink href={loginHref} variant="ghost" size="sm">
        <Flag size={14} /> Reportar
      </ButtonLink>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reportedUserId, reason, details }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        toast.error(data.error ?? "No pudimos enviar el reporte.");
        return;
      }
      toast.success("Reporte enviado. Gracias por cuidar la comunidad.");
      setOpen(false);
      setDetails("");
    } catch {
      toast.error("Se cortó la conexión. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Flag size={14} /> Reportar
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Reportar publicación"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-[1.7rem] bg-cream p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight">Reportar aviso</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="rounded-full p-1.5 text-muted hover:bg-ink/5 hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-1 text-sm font-semibold text-muted">
              Contanos qué pasa. Revisamos los reportes para cuidar la comunidad.
            </p>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-extrabold">Motivo</span>
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm font-bold focus:border-coral focus:outline-none"
              >
                {reasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-extrabold">Detalles (opcional)</span>
              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={3}
                maxLength={600}
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                placeholder="Agregá contexto si hace falta."
              />
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
                Enviar reporte
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
