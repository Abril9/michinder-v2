"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UnreadBadge } from "@/components/unread-badge";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
  { href: "/publicar", label: "Publicar" },
  { href: "/chats", label: "Chats" },
];

export function NavLinks({ isLoggedIn, unread = 0 }: { isLoggedIn: boolean; unread?: number }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {links
        .filter((link) => isLoggedIn || link.href !== "/chats")
        .map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-extrabold transition-colors",
                active ? "bg-ink text-cream" : "text-muted hover:bg-ink/5 hover:text-ink",
              )}
            >
              {link.label}
              {link.href === "/chats" ? <UnreadBadge initial={unread} /> : null}
            </Link>
          );
        })}
    </nav>
  );
}
