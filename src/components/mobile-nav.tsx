"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, MessageCircle, Search } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";
import { UnreadBadge } from "@/components/unread-badge";

export function MobileNav({
  isLoggedIn,
  unread,
}: {
  isLoggedIn: boolean;
  unread: number;
}) {
  const pathname = usePathname();

  const item = (href: string, label: string, icon: React.ReactNode) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-extrabold",
          active ? "text-fucsia" : "text-negro-suave",
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-negro-tenue bg-blanco pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-md items-end px-2">
        {item("/", "Inicio", <Home size={21} />)}
        {item("/explorar", "Explorar", <Search size={21} />)}
        <Link
          href="/publicar"
          aria-label="Publicar"
          className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-fucsia text-blanco"
        >
          <BrandMark className="h-7 w-7" />
        </Link>
        {isLoggedIn ? (
          <div className="flex flex-1 flex-col items-center">
            <Link
              href="/chats"
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[10px] font-extrabold",
                pathname.startsWith("/chats") ? "text-fucsia" : "text-negro-suave",
              )}
            >
              <span className="relative">
                <MessageCircle size={21} />
                <span className="absolute -right-3 -top-2">
                  <UnreadBadge initial={unread} />
                </span>
              </span>
              <span>Chats</span>
            </Link>
          </div>
        ) : (
          item("/ingresar", "Ingresar", <Heart size={21} />)
        )}
        {isLoggedIn ? item("/perfil", "Perfil", <Heart size={21} />) : null}
      </div>
    </nav>
  );
}
