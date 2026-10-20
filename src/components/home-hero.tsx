"use client";

import { useState } from "react";
import { MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { ChachaTribute } from "@/components/chacha-tribute";
import { HomeSearch } from "@/components/home-search";
import { cn } from "@/lib/utils";

export function HomeHero() {
  const [showTribute, setShowTribute] = useState(true);

  return (
    <section
      className={cn(
        "grid items-center gap-10 py-10 lg:py-16",
        showTribute ? "lg:grid-cols-[1.08fr_0.92fr]" : "lg:grid-cols-1",
      )}
    >
      <div
        className={cn(
          "animate-float-in",
          !showTribute && "lg:mx-auto lg:w-full lg:max-w-4xl lg:text-center",
        )}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-white/70 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-coral">
          <span className="h-2 w-2 animate-pulse rounded-full bg-coral" />
          Chacha va a volver
        </span>
        <h1
          className={cn(
            "mt-5 max-w-2xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl",
            !showTribute && "mx-auto",
          )}
        >
          Se perdió.
          <br />
          Alguien la encontró.
          <br />
          <span className="text-coral">Volvió a casa.</span>
        </h1>
        <p
          className={cn(
            "mt-5 max-w-xl text-base font-semibold leading-relaxed text-muted sm:text-lg",
            !showTribute && "mx-auto",
          )}
        >
          Michinder conecta a quienes perdieron una mascota con quienes la encontraron.
          Publicá, filtrá por zona y swipeá hasta que vuelva con su familia.
        </p>

        <div className="mt-7">
          <HomeSearch />
        </div>

        <div
          className={cn(
            "mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-muted",
            !showTribute && "lg:justify-center",
          )}
        >
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

      {showTribute && <ChachaTribute onClose={() => setShowTribute(false)} />}
    </section>
  );
}
