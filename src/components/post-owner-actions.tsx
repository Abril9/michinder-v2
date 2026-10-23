"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Pencil, RotateCcw, Trash2 } from "lucide-react";
import {
  deletePostAction,
  reopenPostAction,
  resolvePostAction,
} from "@/lib/acciones/gestion-avisos";
import { buttonClass } from "@/components/ui/button";

export function PostOwnerActions({
  postId,
  resolved,
  editHref,
}: {
  postId: string;
  resolved: boolean;
  editHref?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {editHref ? (
        <Link href={editHref} className={buttonClass("outline", "sm")}>
          <Pencil size={14} /> Editar
        </Link>
      ) : null}

      <form action={resolved ? reopenPostAction : resolvePostAction}>
        <input type="hidden" name="postId" value={postId} />
        <SubmitButton
          variant={resolved ? "outline" : "secondary"}
          ariaLabel={resolved ? "Reactivar aviso" : "Marcar que volvió con su familia"}
        >
          {resolved ? <RotateCcw size={14} /> : <CheckCircle2 size={14} />}
          {resolved ? "Reactivar" : "Ya volvió"}
        </SubmitButton>
      </form>

      <form
        action={deletePostAction}
        onSubmit={(event) => {
          if (!window.confirm("¿Eliminar este aviso? No se puede deshacer.")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="postId" value={postId} />
        <SubmitButton variant="danger" ariaLabel="Eliminar aviso">
          <Trash2 size={14} /> Eliminar
        </SubmitButton>
      </form>
    </div>
  );
}

function SubmitButton({
  children,
  variant,
  ariaLabel,
}: {
  children: React.ReactNode;
  variant: "outline" | "secondary" | "danger";
  ariaLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      className={buttonClass(variant, "sm")}
    >
      {pending ? "..." : children}
    </button>
  );
}
