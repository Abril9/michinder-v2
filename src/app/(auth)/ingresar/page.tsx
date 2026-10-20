import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser, safeNextPath } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Entrá a Michinder para publicar, swipear y chatear.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const params = await searchParams;

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">Qué bueno verte</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Ingresar</h1>
      <p className="mt-2 text-sm font-semibold text-muted">
        Entrá para publicar, ver avisos cerca tuyo y chatear.
      </p>

      <div className="mt-6">
        <AuthForm mode="login" next={safeNextPath(params.next)} />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-line bg-cream/70 p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">Cuentas demo</p>
        <p className="mt-2 text-sm font-semibold text-ink">
          chacha@demo.com · <span className="font-mono">demo1234</span>
        </p>
        <p className="text-sm font-semibold text-ink">
          vecino@demo.com · <span className="font-mono">demo1234</span>
        </p>
      </div>
    </div>
  );
}
