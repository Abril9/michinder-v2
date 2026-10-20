import {
  AGE_OPTIONS,
  RESOLVED_LABEL,
  SIZE_OPTIONS,
  SPECIES_OPTIONS,
  STATUS_OPTIONS,
  SEX_OPTIONS,
} from "./constants";
import type { PetAge, PetSex, PetSize, PetSpecies, PetStatus } from "./types";

const labelOf = <T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | null | undefined,
) => options.find((option) => option.value === value)?.label ?? "";

export const statusLabel = (value: PetStatus) => labelOf(STATUS_OPTIONS, value);
export const statusPlural = (value: PetStatus) =>
  STATUS_OPTIONS.find((option) => option.value === value)?.plural ?? "";

export function postStateLabel(post: { status: PetStatus; resolvedAt: string | null }) {
  return post.resolvedAt ? RESOLVED_LABEL : statusLabel(post.status);
}
export const speciesLabel = (value: PetSpecies) => labelOf(SPECIES_OPTIONS, value);
export const speciesPlural = (value: PetSpecies) =>
  SPECIES_OPTIONS.find((option) => option.value === value)?.plural ?? "";
export const sexLabel = (value: PetSex) => labelOf(SEX_OPTIONS, value);
export const ageLabel = (value: PetAge | null) =>
  value ? labelOf(AGE_OPTIONS, value) : "";
export const sizeLabel = (value: PetSize | null) =>
  value ? labelOf(SIZE_OPTIONS, value) : "";

export function petTitle(post: {
  petName: string | null;
  species: PetSpecies;
  status: PetStatus;
}) {
  if (post.petName) return post.petName;
  return `${speciesLabel(post.species)} ${statusLabel(post.status).toLowerCase()}`;
}

export function formatDistance(km: number | null) {
  if (km == null) return "Distancia desconocida";
  if (km < 1) return `a ${Math.max(100, Math.round((km * 1000) / 100)) * 100} m`;
  return `a ${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 1,
  }).format(km)} km`;
}

export function formatRelative(date: string | null) {
  if (!date) return "";
  const value = new Date(date).getTime();
  if (Number.isNaN(value)) return "";
  const diffSeconds = Math.round((value - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" });
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  for (const [unit, seconds] of ranges) {
    if (Math.abs(diffSeconds) >= seconds) {
      return formatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return "recién";
}

export function formatEventDate(date: string | null) {
  if (!date) return null;
  const value = new Date(`${date}T12:00:00`);
  if (Number.isNaN(value.getTime())) return null;
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

export function formatChatTime(date: string) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "";
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function formatChatDay(date: string) {
  const value = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(value, today)) return "Hoy";
  if (sameDay(value, yesterday)) return "Ayer";
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
  }).format(value);
}

export function whatsappHref(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
