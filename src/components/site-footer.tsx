import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-white/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo size={36} />
          <p className="mt-3 max-w-sm text-sm font-semibold text-muted">
            Michinder es un espacio para que las mascotas perdidas vuelvan a casa.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-extrabold text-muted">
          <Link href="/explorar?estado=perdido" className="hover:text-ink">
            Perdidos
          </Link>
          <Link href="/explorar?estado=encontrado" className="hover:text-ink">
            Encontrados
          </Link>
          <Link href="/publicar" className="hover:text-ink">
            Publicar
          </Link>
          <Link href="/legal/privacidad" className="hover:text-ink">
            Privacidad
          </Link>
          <Link href="/legal/terminos" className="hover:text-ink">
            Términos
          </Link>
        </div>
      </div>
    </footer>
  );
}
