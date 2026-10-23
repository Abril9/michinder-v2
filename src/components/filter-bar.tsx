"use client";

import { Cat, Dog, LocateFixed, MapPin, PawPrint, RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AGE_OPTIONS,
  RADIUS_DEFAULT_KM,
  RADIUS_MAX_KM,
  RADIUS_MIN_KM,
  SIZE_OPTIONS,
  SPECIES_OPTIONS,
  SEX_OPTIONS,
} from "@/lib/constants";
import type { ExploreFilters, PetAge, PetSex, PetSize, PetSpecies } from "@/lib/types";

const speciesIcons = {
  all: PawPrint,
  cat: Cat,
  dog: Dog,
  other: PawPrint,
} as const;

export function FilterBar({
  filters,
  onChange,
  radiusKm,
  onRadiusChange,
  locationLabel,
  locationSource,
  locating,
  onUseGps,
  onUseDemo,
  onReset,
}: {
  filters: ExploreFilters;
  onChange: (patch: Partial<ExploreFilters>) => void;
  radiusKm: number;
  onRadiusChange: (value: number) => void;
  locationLabel: string;
  locationSource: "demo" | "gps" | "stored";
  locating: boolean;
  onUseGps: () => void;
  onUseDemo: () => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-[1.7rem] border border-line bg-white/75 p-4 shadow-[0_18px_50px_-38px_rgba(12,47,35,0.45)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-muted">
          <SlidersHorizontal size={16} /> Filtros
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-extrabold text-muted hover:text-ink"
        >
          <RotateCcw size={14} /> Limpiar
        </button>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-black uppercase tracking-wide text-muted">Especie</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <SpeciesChip
            active={filters.species === "all"}
            label="Todas"
            icon={<PawPrint size={15} />}
            onClick={() => onChange({ species: "all" })}
          />
          {SPECIES_OPTIONS.map((option) => {
            const Icon = speciesIcons[option.value];
            return (
              <SpeciesChip
                key={option.value}
                active={filters.species === option.value}
                label={option.plural}
                icon={<Icon size={15} />}
                onClick={() => onChange({ species: option.value as PetSpecies })}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Select
          label="Sexo"
          value={filters.sex}
          onChange={(value) => onChange({ sex: value as PetSex | "all" })}
          options={[{ value: "all", label: "Todos" }, ...SEX_OPTIONS]}
        />
        <Select
          label="Edad"
          value={filters.age}
          onChange={(value) => onChange({ age: value as PetAge | "all" })}
          options={[{ value: "all", label: "Todas" }, ...AGE_OPTIONS]}
        />
        <Select
          label="Tamaño"
          value={filters.size}
          onChange={(value) => onChange({ size: value as PetSize | "all" })}
          options={[{ value: "all", label: "Todos" }, ...SIZE_OPTIONS]}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1.1fr_0.9fr] sm:items-end">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-wide text-muted">
              Mi radio de búsqueda
            </p>
            <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-black text-coral">
              {radiusKm} km
            </span>
          </div>
          <input
            type="range"
            min={RADIUS_MIN_KM}
            max={RADIUS_MAX_KM}
            step={1}
            value={radiusKm}
            onChange={(event) => onRadiusChange(Number(event.target.value))}
            className="mt-2 h-2 w-full cursor-pointer accent-coral"
            aria-label="Radio de búsqueda en kilómetros"
          />
          <p className="mt-1 text-[11px] font-semibold text-muted">
            Se muestran avisos cuyo radio se cruza con el tuyo.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-cream/70 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-muted">
            <MapPin size={13} /> Buscando en
          </p>
          <p className="mt-1 truncate text-sm font-extrabold text-ink">{locationLabel}</p>
          <p className="text-[10px] font-bold text-muted">
            {locationSource === "gps"
              ? "Tu ubicación actual"
              : locationSource === "stored"
                ? "Última ubicación guardada"
                : "Zona demo: Santa Fe"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onUseGps}
              disabled={locating}
              className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[11px] font-extrabold text-cream disabled:opacity-60"
            >
              <LocateFixed size={13} />
              {locating ? "Ubicando..." : "Mi ubicación"}
            </button>
            <button
              type="button"
              onClick={onUseDemo}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-extrabold text-ink"
            >
              Zona demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpeciesChip({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-extrabold transition-colors",
        active
          ? "border-ink bg-ink text-cream"
          : "border-line bg-white text-muted hover:border-ink/20 hover:text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-black uppercase tracking-wide text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-10 w-full rounded-xl border border-line bg-white px-3 text-sm font-extrabold text-ink focus:border-coral focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export const DEFAULT_RADIUS = RADIUS_DEFAULT_KM;
