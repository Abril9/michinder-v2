import { petTitle } from "@/lib/format";
import type { Post } from "@/lib/types";

export function flyerFileName(post: Post) {
  const slug = petTitle(post)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const state = post.resolvedAt ? "reencuentro" : post.status;

  return `michinder-${slug || "aviso"}-${state}.png`;
}

export function flyerDate(post: Post) {
  const source = post.eventDate
    ? new Date(`${post.eventDate}T12:00:00`)
    : new Date(post.createdAt);
  if (Number.isNaN(source.getTime())) return "fecha desconocida";

  const parts = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).formatToParts(source);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value.replace(/\./g, "") ?? "";

  return `${part("day")} ${part("month")} ${part("year")}`;
}

export function truncate(value: string, max: number) {
  const clean = value.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;

  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function phoneLabel(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("+")) return trimmed;

  const digits = trimmed.replace(/\D/g, "");
  return digits ? `+${digits}` : trimmed;
}
