import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/nav-links";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { logoutAction } from "@/lib/acciones/autenticacion";
import type { CurrentUser } from "@/lib/types";

export async function AppHeader({
  user,
  unread,
}: {
  user: CurrentUser | null;
  unread: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-negro-tenue bg-blanco">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <NavLinks isLoggedIn={Boolean(user)} unread={unread} />

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/perfil"
                className="hidden items-center gap-2 rounded-full border border-negro-tenue bg-blanco px-3 py-2 text-sm font-extrabold text-negro hover:bg-negro/5 md:inline-flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-negro text-[11px] font-black text-blanco">
                  {user.profile.name.slice(0, 1).toUpperCase()}
                </span>
                {user.profile.name.split(" ")[0]}
              </Link>
              <form action={logoutAction} className="hidden md:block">
                <button
                  type="submit"
                  className="rounded-full p-2 text-negro-suave hover:bg-negro/5 hover:text-negro"
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
                className="hidden rounded-full px-4 py-2 text-sm font-extrabold text-negro hover:bg-negro/5 sm:inline-flex"
              >
                Ingresar
              </Link>
              <ButtonLink
                href="/registrarme"
                size="sm"
                brandIcon
                className="hidden sm:inline-flex"
              >
                Crear cuenta
              </ButtonLink>
            </>
          )}
          <ButtonLink href="/publicar" size="sm" brandIcon className="md:hidden">
            Publicar
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
      <ButtonLink href="/registrarme" size="sm" brandIcon>
        Crear cuenta
      </ButtonLink>
    </div>
  );
}
