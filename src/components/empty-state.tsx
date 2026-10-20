import Link from "next/link";
import { PawPrint } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function EmptyState({
  title,
  text,
  actionHref,
  actionLabel,
}: {
  title: string;
  text: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand text-ink/40">
        <PawPrint size={30} />
      </span>
      <h2 className="mt-4 text-2xl font-black tracking-tight">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">{text}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {actionHref && actionLabel ? (
          <ButtonLink href={actionHref}>{actionLabel}</ButtonLink>
        ) : null}
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-line bg-white/70 px-5 text-sm font-extrabold text-ink hover:bg-white"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
