import { getCurrentUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/data/conversations";
import { AppHeader } from "@/components/app-header";
import { MobileNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
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
