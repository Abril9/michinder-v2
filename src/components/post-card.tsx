import Link from "next/link";
import { CalendarDays, MapPin, PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ageLabel,
  formatDistance,
  formatEventDate,
  formatRelative,
  petTitle,
  postStateLabel,
  sexLabel,
  sizeLabel,
  speciesLabel,
} from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const photo = post.photos[0]?.url;
  const eventDate = formatEventDate(post.eventDate);

  return (
    <Link
      href={`/publicacion/${post.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-line bg-white/80 shadow-[0_18px_45px_-32px_rgba(29,25,22,0.5)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_26px_55px_-30px_rgba(29,25,22,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {photo ? (
          <img
            src={photo}
            alt={petTitle(post)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-sand to-peach text-ink/30">
            <PawPrint size={64} />
          </div>
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge tone={post.resolvedAt ? "success" : post.status === "lost" ? "lost" : "found"}>
            {postStateLabel(post)}
          </Badge>
          <Badge tone="species">
            {speciesLabel(post.species)}
          </Badge>
        </div>
        {post.resolvedAt ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/55 p-6">
            <span className="rounded-full bg-white px-4 py-2 text-center text-sm font-black uppercase tracking-wide text-leaf">
              Volvió con su familia
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black leading-tight tracking-tight">{petTitle(post)}</h3>
          <span className="shrink-0 rounded-full bg-cream px-2 py-1 text-[11px] font-extrabold text-muted">
            {formatDistance(post.distanceKm)}
          </span>
        </div>

        <p className="mt-1 text-xs font-bold text-muted">
          {[
            speciesLabel(post.species),
            sexLabel(post.sex),
            ageLabel(post.age),
            sizeLabel(post.size),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-relaxed text-ink/75">
          {post.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-[11px] font-bold text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {post.locationLabel}
          </span>
          {eventDate ? (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={13} /> {eventDate}
            </span>
          ) : null}
          <span className="ml-auto">{formatRelative(post.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
