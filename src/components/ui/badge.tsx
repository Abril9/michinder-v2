import { cn } from "@/lib/utils";

type Tone = "lost" | "found" | "success" | "neutral" | "species";

const tones: Record<Tone, string> = {
  lost: "bg-red-50 text-red-700 ring-red-200",
  found: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  success: "bg-emerald-600 text-white ring-emerald-700",
  neutral: "bg-white/90 text-ink ring-line",
  species: "bg-sand text-ink ring-peach",
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
