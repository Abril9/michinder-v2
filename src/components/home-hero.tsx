import { MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { HomeSearch } from "@/components/home-search";
import { SITE_TAGLINE } from "@/lib/constants";

export function HomeHero() {
  return (
    <section className="grid items-center gap-10 py-10 lg:py-16">
      <div className="animate-float-in lg:mx-auto lg:w-full lg:max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-fucsia bg-blanco px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-fucsia">
          <span className="h-2 w-2 animate-pulse rounded-full bg-fucsia" />
          {SITE_TAGLINE}
        </span>
        <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
          Se perdió.
          <br />
          Alguien la encontró.
          <br />
          <span className="text-fucsia">Volvió a casa.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-negro-suave sm:text-lg">
          Michinder conecta a quienes perdieron una mascota con quienes la encontraron.
          Publicá, filtrá por zona y swipeá hasta que vuelva con su familia.
        </p>

        <div className="mt-7">
          <HomeSearch />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-negro-suave">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-verde" /> Cuentas verificadas por email
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} className="text-fucsia" /> Búsqueda por radios
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={15} className="text-negro" /> Chat anti-spam
          </span>
        </div>
      </div>
    </section>
  );
}
