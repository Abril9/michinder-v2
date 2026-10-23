import Link from "next/link";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <Logo size={80} withText={false} />
      <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-coral">Error 404</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
        Esta página también se perdió
      </h1>
      <p className="mt-2 max-w-md text-sm font-semibold text-muted">
        La página que buscás no existe. Probá desde el inicio o explorá los avisos.
      </p>
      <div className="mt-5 flex gap-2">
        <ButtonLink href="/" brandIcon>Ir al inicio</ButtonLink>
        <Link
          href="/explorar?estado=perdido"
          className="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-extrabold text-ink hover:bg-cream"
        >
          Explorar avisos
        </Link>
      </div>
    </div>
  );
}
