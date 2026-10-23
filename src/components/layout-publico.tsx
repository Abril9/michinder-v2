import { getCurrentUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/data/conversations";
import { AppHeader } from "@/components/app-header";
import { MobileNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";

/**
 * Marco de las páginas públicas y de usuario: header, footer y navegación móvil.
 * Reemplaza al route group `(site)` sin agregar segmentos a la URL.
 */
export async function LayoutPublico({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const unread = user ? await getUnreadCount() : 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={user} unread={unread} />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <SiteFooter />
      <MobileNav isLoggedIn={Boolean(user)} unread={unread} />
    </div>
  );
}
