"use client";

import dynamic from "next/dynamic";
import type { LatLng } from "@/lib/geo";

const MapInner = dynamic(() => import("@/components/map-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-sand/60 text-sm font-bold text-muted">
      Cargando mapa...
    </div>
  ),
});

export function PostMap({
  lat,
  lng,
  radiusKm,
  label,
}: {
  lat: number;
  lng: number;
  radiusKm: number;
  label: string;
}) {
  const point: LatLng = { lat, lng };
  return (
    <div className="h-72 overflow-hidden rounded-2xl border border-line sm:h-80">
      <MapInner
        center={point}
        marker={point}
        radiusKm={radiusKm}
        label={label}
        zoom={14}
      />
    </div>
  );
}
