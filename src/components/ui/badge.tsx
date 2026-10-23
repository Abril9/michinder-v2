import { cn } from "@/lib/utils";

type Tone = "lost" | "found" | "success" | "neutral" | "species";

const tones: Record<Tone, string> = {
  lost: "bg-fucsia text-blanco ring-fucsia",
  found: "bg-verde text-blanco ring-verde",
  success: "bg-verde text-blanco ring-verde",
  neutral: "bg-blanco text-negro ring-negro-tenue",
  species: "bg-negro text-blanco ring-negro",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
