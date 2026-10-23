import type { Metadata } from "next";
import { LayoutPublico } from "@/components/layout-publico";
import Link from "next/link";
import { LogOut, MessageCircle, PawPrint, ShieldCheck } from "lucide-react";
import { ProfileForm } from "@/components/profile-form";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { logoutAction } from "@/lib/acciones/autenticacion";
import { requireUser } from "@/lib/auth";
import { getMyPostStats } from "@/lib/data/posts";
import { formatRelative } from "@/lib/format";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default async function ProfilePage() {
  const user = await requireUser("/perfil");
  const stats = await getMyPostStats(user.id);

  return (
    <LayoutPublico>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Tu cuenta</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Mi perfil</h1>
        <p className="mt-1 text-sm font-semibold text-muted">
          {user.email} · en Michinder {formatRelative(user.profile.createdAt)}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat value={stats.active} label="avisos activos" />
          <Stat value={stats.resolved} label="volvieron a casa" />
          <Stat value={user.profile.showWhatsapp ? "Sí" : "No"} label="WhatsApp visible" />
        </div>

        <div className="mt-6 rounded-[1.7rem] border border-line bg-white/75 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-base font-black text-cream">
                {user.profile.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-base font-black">{user.profile.name}</p>
                <p className="text-xs font-semibold text-muted">
                  {user.profile.city || "Sin ciudad"}
                </p>
              </div>
            </div>
            <ShieldCheck size={20} className="text-leaf" />
          </div>

          <div className="mt-5">
            <ProfileForm profile={user.profile} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/mis-publicaciones"
            className="flex items-center justify-between rounded-2xl border border-line bg-white/75 p-4 hover:bg-white"
          >
            <span>
              <span className="block text-sm font-black">Mis publicaciones</span>
              <span className="block text-xs font-semibold text-muted">Gestioná tus avisos</span>
            </span>
            <PawPrint size={20} className="text-coral" />
          </Link>
          <Link
            href="/chats"
            className="flex items-center justify-between rounded-2xl border border-line bg-white/75 p-4 hover:bg-white"
          >
            <span>
              <span className="block text-sm font-black">Mis chats</span>
              <span className="block text-xs font-semibold text-muted">Coordiná la vuelta a casa</span>
            </span>
            <MessageCircle size={20} className="text-coral" />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/60 p-4">
          <div>
            <p className="text-sm font-black">Sesión iniciada</p>
            <p className="text-xs font-semibold text-muted">
              Podés salir cuando quieras. Tus avisos siguen publicados.
            </p>
          </div>
          <div className="flex gap-2">
            <ButtonLink href="/publicar" variant="outline" size="sm">
              Publicar aviso
            </ButtonLink>
            <form action={logoutAction}>
              <button type="submit" className={buttonClass("danger", "sm")}>
                <LogOut size={14} /> Salir
              </button>
            </form>
          </div>
        </div>
      </div>
    </LayoutPublico>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/65 px-4 py-4">
      <p className="text-2xl font-black text-ink">{value}</p>
      <p className="text-[11px] font-black uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}
