"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { updateProfileAction } from "@/lib/acciones/perfil";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/action-state";
import type { Profile } from "@/lib/types";

const initialState: FormState = {};

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nombre"
          name="name"
          defaultValue={profile.name}
          autoComplete="name"
          error={state.fieldErrors?.name?.[0]}
        />
        <Field
          label="Ciudad"
          name="city"
          defaultValue={profile.city ?? ""}
          autoComplete="address-level2"
          placeholder="Santa Fe"
          error={state.fieldErrors?.city?.[0]}
        />
      </div>

      <Field
        label="WhatsApp (opcional)"
        name="whatsapp"
        defaultValue={profile.whatsapp ?? ""}
        autoComplete="tel"
        placeholder="+54 9 342 000 0000"
        error={state.fieldErrors?.whatsapp?.[0]}
      />

      <label className="flex items-start gap-3 rounded-2xl border border-line bg-cream/60 p-4">
        <input
          type="checkbox"
          name="showWhatsapp"
          defaultChecked={profile.showWhatsapp}
          className="mt-1 h-5 w-5 accent-coral"
        />
        <span>
          <span className="block text-sm font-extrabold">Mostrar mi WhatsApp en mis avisos</span>
          <span className="mt-0.5 block text-xs font-semibold text-muted">
            Solo las personas con cuenta y sesión van a ver el botón. Igual podés usar el chat
            interno.
          </span>
        </span>
      </label>

      {state.error ? (
        <p className="rounded-2xl bg-fucsia px-4 py-3 text-sm font-bold text-blanco">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="rounded-2xl bg-verde px-4 py-3 text-sm font-bold text-blanco">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
        {pending ? "Guardando..." : "Guardar perfil"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-extrabold text-ink">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-base placeholder:text-muted/60 focus:border-coral focus:outline-none"
      />
      {error ? <span className="mt-1 block text-xs font-bold text-fucsia">{error}</span> : null}
    </label>
  );
}
