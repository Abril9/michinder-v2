import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/nav-links";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { logoutAction } from "@/app/(auth)/actions";
import type { CurrentUser } from "@/lib/types";

export async function AppHeader({
  user,
  unread,
}: {
  user: CurrentUser | null;
  unread: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <NavLinks isLoggedIn={Boolean(user)} unread={unread} />

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/perfil"
                className="hidden items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-2 text-sm font-extrabold text-ink hover:bg-white md:inline-flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-black text-cream">
                  {user.profile.name.slice(0, 1).toUpperCase()}
                </span>
                {user.profile.name.split(" ")[0]}
              </Link>
              <form action={logoutAction} className="hidden md:block">
                <button
                  type="submit"
                  className="rounded-full p-2 text-muted hover:bg-ink/5 hover:text-ink"
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/ingresar"
                className="hidden rounded-full px-4 py-2 text-sm font-extrabold text-ink hover:bg-ink/5 sm:inline-flex"
              >
                Ingresar
              </Link>
              <ButtonLink href="/registrarme" size="sm" className="hidden sm:inline-flex">
                Crear cuenta
              </ButtonLink>
            </>
          )}
          <ButtonLink href="/publicar" size="sm" className="md:hidden">
            <Plus size={16} strokeWidth={3} /> Publicar
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/ingresar" className={buttonClass("ghost", "sm")}>
        Ingresar
      </Link>
      <Link href="/registrarme" className={buttonClass("primary", "sm")}>
        Crear cuenta
      </Link>
    </div>
  );
}
