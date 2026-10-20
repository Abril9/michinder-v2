"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, LocateFixed, MapPin } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_LOCATION, RADIUS_MAX_KM, RADIUS_MIN_KM } from "@/lib/constants";
import type { LatLng } from "@/lib/geo";

const MapInner = dynamic(() => import("@/components/map-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-sand/60 text-sm font-bold text-muted">
      Cargando mapa...
    </div>
  ),
});

export function LocationPicker({
  value,
  label,
  radiusKm,
  onValueChange,
  onLabelChange,
  onRadiusChange,
}: {
  value: LatLng;
  label: string;
  radiusKm: number;
  onValueChange: (value: LatLng) => void;
  onLabelChange: (value: string) => void;
  onRadiusChange: (value: number) => void;
}) {
  const [locating, setLocating] = useState(false);

  function useGps() {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onValueChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        if (!label.trim()) onLabelChange("Mi ubicación actual");
        toast.success("Ubicación marcada. Ajustala tocando el mapa si hace falta.");
        setLocating(false);
      },
      () => {
        toast.error("No pudimos obtener tu ubicación. Marcá el punto en el mapa.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 },
    );
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-sm font-extrabold text-ink">
          Zona o dirección exacta
        </span>
        <div className="flex gap-2">
          <input
            name="locationLabel"
            value={label}
            onChange={(event) => onLabelChange(event.target.value)}
            placeholder="Ej. Barrio Sur, cerca de la plaza"
            maxLength={120}
            className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-base focus:border-coral focus:outline-none"
          />
          <button
            type="button"
            onClick={useGps}
            disabled={locating}
            className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-2xl border border-line bg-white px-4 text-sm font-extrabold text-ink hover:bg-cream disabled:opacity-60"
          >
            {locating ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <LocateFixed size={17} />
            )}
            {locating ? "Ubicando" : "Mi ubicación"}
          </button>
        </div>
      </label>

      <div className="h-64 overflow-hidden rounded-2xl border border-line sm:h-72">
        <MapInner
          center={value}
          marker={value}
          radiusKm={radiusKm}
          label={label || "Punto exacto"}
          onPick={onValueChange}
        />
      </div>
      <p className="flex items-start gap-1.5 text-xs font-semibold text-muted">
        <MapPin size={14} className="mt-0.5 shrink-0 text-coral" />
        La ubicación se muestra exacta para que puedan encontrarse. Tocá el mapa para mover el
        punto.
      </p>

      <div className="rounded-2xl border border-line bg-cream/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-ink">Radio del aviso</p>
            <p className="text-xs font-semibold text-muted">
              Hasta dónde puede haberse movido o dónde lo viste.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-coral">
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
          className="mt-3 h-2 w-full cursor-pointer accent-coral"
          aria-label="Radio del aviso en kilómetros"
        />
        <div className="mt-1 flex justify-between text-[10px] font-bold text-muted">
          <span>{RADIUS_MIN_KM} km</span>
          <span>Zona demo: {DEFAULT_LOCATION.label}</span>
          <span>{RADIUS_MAX_KM} km</span>
        </div>
      </div>
    </div>
  );
}
