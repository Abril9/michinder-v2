import type { Metadata } from "next";
import { LayoutAcceso } from "@/components/layout-acceso";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser, safeNextPath } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Creá tu cuenta en Michinder y ayudá a que vuelvan a casa.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const params = await searchParams;

  return (
    <LayoutAcceso>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">Sumate</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Crear cuenta</h1>
        <p className="mt-2 text-sm font-semibold text-muted">
          Es gratis. Con tu cuenta podés publicar avisos, guardar intereses y chatear.
        </p>

        <div className="mt-6">
          <AuthForm mode="register" next={safeNextPath(params.next)} />
        </div>
      </div>
    </LayoutAcceso>
  );
}
