import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <Logo />
        <Link href="/" className="text-sm font-extrabold text-muted hover:text-ink">
          Volver al inicio
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md animate-float-in rounded-[2rem] border border-line bg-white/85 p-6 shadow-[0_24px_60px_-30px_rgba(29,25,22,0.35)] sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
