"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Cat, Dog, PawPrint, Search, HeartHandshake } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SPECIES_OPTIONS } from "@/lib/constants";
import type { PetSpecies } from "@/lib/types";

type SpeciesFilter = PetSpecies | "all";

const icons = {
  all: PawPrint,
  cat: Cat,
  dog: Dog,
  other: PawPrint,
} as const;

export function HomeSearch() {
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const speciesQuery = species === "all" ? "" : `&especie=${species}`;

  return (
    <div className="rounded-[2rem] border border-negro-tenue bg-blanco p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-fucsia">
            Empezá por acá
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight">¿Qué necesitás hacer?</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold text-negro-suave">Especie:</span>
          <div className="flex flex-wrap gap-1.5">
            <SpeciesChip
              active={species === "all"}
              onClick={() => setSpecies("all")}
              icon={<PawPrint size={14} />}
              label="Todas"
            />
            {SPECIES_OPTIONS.map((option) => {
              const Icon = icons[option.value];
              return (
                <SpeciesChip
                  key={option.value}
                  active={species === option.value}
                  onClick={() => setSpecies(option.value)}
                  icon={<Icon size={14} />}
                  label={option.plural}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <article className="relative flex flex-col rounded-3xl border border-fucsia bg-blanco p-5 transition-transform hover:-translate-y-0.5">
          <Link
            href={`/explorar?estado=encontrado${speciesQuery}`}
            aria-hidden
            tabIndex={-1}
            className="absolute inset-0 rounded-3xl"
          />
          <div className="pointer-events-none relative z-10 flex flex-1 flex-col">
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fucsia text-blanco">
                <Search size={24} strokeWidth={2.6} />
              </span>
              <span className="rounded-full bg-blanco px-3 py-1 text-[10px] font-black uppercase tracking-wide text-fucsia">
                Para dueños
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-2xl font-black tracking-tight">Perdí una mascota</h3>
              <p className="mt-1 text-sm font-semibold text-negro-suave">
                Publicá el aviso y mirá si alguien la encontró.
              </p>
            </div>
            <div className="mt-5 flex flex-1 flex-col justify-end gap-2">
              <Link
                href={`/publicar?estado=perdido${speciesQuery}`}
                className={buttonClass("primary", "md", "pointer-events-auto w-full")}
              >
                <BrandMark className="h-4 w-4" /> Crear publicación de perdido
              </Link>
              <Link
                href={`/explorar?estado=encontrado${speciesQuery}`}
                className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold text-fucsia hover:bg-negro/5"
              >
                Ver mascotas encontradas <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>

        <article className="relative flex flex-col rounded-3xl border border-verde bg-blanco p-5 transition-transform hover:-translate-y-0.5">
          <Link
            href={`/explorar?estado=perdido${speciesQuery}`}
            aria-hidden
            tabIndex={-1}
            className="absolute inset-0 rounded-3xl"
          />
          <div className="pointer-events-none relative z-10 flex flex-1 flex-col">
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-verde text-blanco">
                <HeartHandshake size={24} strokeWidth={2.6} />
              </span>
              <span className="rounded-full bg-blanco px-3 py-1 text-[10px] font-black uppercase tracking-wide text-verde">
                Para quien la encontró
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-2xl font-black tracking-tight">Encontré una mascota</h3>
              <p className="mt-1 text-sm font-semibold text-negro-suave">
                Publicá dónde la viste o la tenés y buscá a su familia.
              </p>
            </div>
            <div className="mt-5 flex flex-1 flex-col justify-end gap-2">
              <Link
                href={`/publicar?estado=encontrado${speciesQuery}`}
                className={buttonClass("secondary", "md", "pointer-events-auto w-full")}
              >
                <BrandMark className="h-4 w-4" /> Crear publicación de encontrado
              </Link>
              <Link
                href={`/explorar?estado=perdido${speciesQuery}`}
                className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold text-verde hover:bg-negro/5"
              >
                Ver mascotas perdidas <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>
      </div>

      <p className="mt-4 text-center text-xs font-bold text-negro-suave">
        El aviso es gratis. Después podés filtrar por sexo, edad, tamaño y radio de búsqueda.
      </p>
    </div>
  );
}

function SpeciesChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors",
        active ? "bg-negro text-blanco" : "bg-blanco text-negro-suave hover:bg-negro/5 hover:text-negro",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
