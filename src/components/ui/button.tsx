import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-fucsia text-blanco hover:bg-fucsia",
  secondary: "bg-verde text-blanco hover:bg-verde",
  ghost: "bg-transparent text-negro hover:bg-negro/5",
  danger: "border border-negro bg-blanco text-negro hover:bg-negro/5",
  outline: "border border-negro-tenue bg-blanco text-negro hover:bg-negro/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

const markSizes: Record<Size, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-[18px] w-[18px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  brandIcon = false,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  brandIcon?: boolean;
}) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {brandIcon ? <BrandMark className={markSizes[size]} /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  brandIcon = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  brandIcon?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {brandIcon ? <BrandMark className={markSizes[size]} /> : null}
      {children}
    </Link>
  );
}
