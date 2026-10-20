import Image from "next/image";
import { MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { HomeSearch } from "@/components/home-search";
import { SITE_TAGLINE } from "@/lib/constants";

export function HomeHero() {
  return (
    <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
      <div className="animate-float-in">
        <span className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-white/70 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-coral">
          <span className="h-2 w-2 animate-pulse rounded-full bg-coral" />
          {SITE_TAGLINE}
        </span>
        <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
          Se perdió.
          <br />
          Alguien la encontró.
          <br />
          <span className="text-coral">Volvió a casa.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-muted sm:text-lg">
          Michinder conecta a quienes perdieron una mascota con quienes la encontraron.
          Publicá, filtrá por zona y swipeá hasta que vuelva con su familia.
        </p>

        <div className="mt-7">
          <HomeSearch />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-leaf" /> Cuentas verificadas por email
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} className="text-coral" /> Búsqueda por radios
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={15} className="text-ink" /> Chat anti-spam
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-sand via-cream to-peach p-8 shadow-[0_35px_80px_-35px_rgba(29,25,22,0.5)]">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(29,25,22,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />
          <Image
            src="/logo.svg"
            alt="Logo de Michinder"
            width={360}
            height={360}
            priority
            className="relative mx-auto w-full max-w-[330px] drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
