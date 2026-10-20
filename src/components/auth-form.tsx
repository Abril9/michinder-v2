"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import type { AuthState } from "@/lib/action-state";

const initialState: AuthState = {};

export function AuthForm({
  mode,
  next = "/",
}: {
  mode: "login" | "register";
  next?: string;
}) {
  const isRegister = mode === "register";
  const [state, formAction, pending] = useActionState(
    isRegister ? registerAction : loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {next !== "/" ? <input type="hidden" name="next" value={next} /> : null}

      {isRegister ? (
        <Field
          label="Tu nombre"
          name="name"
          autoComplete="name"
          placeholder="Abril"
          error={state.fieldErrors?.name?.[0]}
        />
      ) : null}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="vos@email.com"
        error={state.fieldErrors?.email?.[0]}
      />

      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete={isRegister ? "new-password" : "current-password"}
        placeholder="Mínimo 8 caracteres"
        error={state.fieldErrors?.password?.[0]}
      />

      {isRegister ? (
        <Field
          label="Repetir contraseña"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repetí la contraseña"
          error={state.fieldErrors?.confirmPassword?.[0]}
        />
      ) : null}

      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "Un segundo..." : isRegister ? "Crear mi cuenta" : "Ingresar"}
      </Button>

      <p className="pt-1 text-center text-sm font-semibold text-muted">
        {isRegister ? "¿Ya tenés cuenta?" : "¿Todavía no tenés cuenta?"}{" "}
        <Link
          href={isRegister ? "/ingresar" : "/registrarme"}
          className="font-extrabold text-coral hover:underline"
        >
          {isRegister ? "Ingresá" : "Registrate"}
        </Link>
      </p>
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
        className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-base text-ink placeholder:text-muted/60 focus:border-coral focus:outline-none"
      />
      {error ? <span className="mt-1 block text-xs font-bold text-red-600">{error}</span> : null}
    </label>
  );
}
