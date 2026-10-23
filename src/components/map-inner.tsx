"use client";

import { useEffect } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLng } from "@/lib/geo";

function Recenter({ lat, lng }: LatLng) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);

  return null;
}

function ClickHandler({ onPick }: { onPick?: (value: LatLng) => void }) {
  useMapEvents({
    click(event) {
      onPick?.({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

export default function MapInner({
  center,
  marker,
  radiusKm,
  label,
  onPick,
  zoom = 14,
}: {
  center: LatLng;
  marker: LatLng;
  radiusKm: number;
  label?: string;
  onPick?: (value: LatLng) => void;
  zoom?: number;
}) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter {...center} />
      <ClickHandler onPick={onPick} />
      <Circle
        center={[marker.lat, marker.lng]}
        radius={radiusKm * 1000}
        pathOptions={{ color: "#e6007e", fillColor: "#e6007e", fillOpacity: 0.08, weight: 2 }}
      />
      <CircleMarker
        center={[marker.lat, marker.lng]}
        radius={9}
        pathOptions={{ color: "#ffffff", fillColor: "#e6007e", fillOpacity: 1, weight: 3 }}
      >
        <Tooltip direction="top" offset={[0, -8]} opacity={1}>
          {label || "Punto exacto"}
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
