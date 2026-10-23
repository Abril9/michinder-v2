import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

type LogoProps = {
  size?: number;
  withText?: boolean;
  href?: string;
  className?: string;
};

export function Logo({ size = 44, withText = true, href = "/", className }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo.svg"
        alt="Michinder"
        width={size}
        height={size}
        priority
      />
      {withText ? (
        <span className="text-xl font-black tracking-tight text-negro">{SITE_NAME}</span>
      ) : null}
    </span>
  );

  return href ? (
    <Link href={href} aria-label={`${SITE_NAME}, ir al inicio`}>
      {content}
    </Link>
  ) : (
    content
  );
}
