import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Search } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { PostCard } from "@/components/post-card";
import { ButtonLink } from "@/components/ui/button";
import { getPostStats, getRecentPosts } from "@/lib/data/posts";
import type { Post } from "@/lib/types";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_TAGLINE} · Michinder`,
  description: SITE_DESCRIPTION,
};

export default async function HomePage() {
  let recent: Post[] = [];
  let stats = { active: 0, resolved: 0 };

  try {
    [recent, stats] = await Promise.all([getRecentPosts(6), getPostStats()]);
  } catch {
    // Si la base todavía no está seedeada, la home igual tiene que cargar.
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <HomeHero />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={stats.active} label="avisos activos" tone="text-coral" />
        <Stat value={stats.resolved} label="volvieron a casa" tone="text-leaf" />
        <Stat value={6} label="filtros de búsqueda" tone="text-ink" />
        <Stat value={0} label="ganas de rendirse" tone="text-ink" />
      </section>

      <section className="py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
              Radar en vivo
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">Avisos recientes</h2>
            <p className="mt-1 text-sm font-semibold text-muted">
              Casos cerca de la zona demo de Santa Fe.
            </p>
          </div>
          <Link
            href="/explorar?estado=perdido"
            className="inline-flex items-center gap-1 text-sm font-black text-coral hover:underline"
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-line bg-white/60 p-10 text-center">
            <p className="text-lg font-black">Todavía no hay avisos.</p>
            <p className="mt-1 text-sm font-semibold text-muted">
              Publicá el primero o cargá los datos demo.
            </p>
            <ButtonLink href="/publicar" className="mt-4">
              Publicar una mascota
            </ButtonLink>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-line bg-white/65 p-6 sm:p-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Step
            number="01"
            icon={<Search size={22} />}
            title="Publicá con precisión"
            text="Foto, especie, sexo, edad, tamaño y una zona exacta con radio ajustable."
          />
          <Step
            number="02"
            icon={<MapPin size={22} />}
            title="Filtrá y swipeá"
            text="Elegí avisos de perdidos o encontrados, ajustá los filtros y pasá tarjetas. Si no te sirve, seguí."
          />
          <Step
            number="03"
            icon={<MessageCircle size={22} />}
            title="Chateá y coordiná"
            text="El swipe a la derecha abre un chat con límite anti-spam. También podés compartir por WhatsApp."
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/65 px-4 py-4">
      <p className={`text-2xl font-black ${tone}`}>{value}</p>
      <p className="text-[11px] font-black uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sand text-ink">
          {icon}
        </span>
        <span className="text-2xl font-black text-line">{number}</span>
      </div>
      <h3 className="mt-4 text-lg font-black tracking-tight">{title}</h3>
      <p className="mt-1 text-sm font-semibold leading-relaxed text-muted">{text}</p>
    </div>
  );
}
