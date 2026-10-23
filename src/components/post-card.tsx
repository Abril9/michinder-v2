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
      className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-negro-tenue bg-blanco transition-transform duration-200 hover:-translate-y-1"
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
          <div className="flex h-full items-center justify-center bg-blanco text-negro/30">
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
          <div className="absolute inset-0 flex items-center justify-center bg-negro/55 p-6">
            <span className="rounded-full bg-blanco px-4 py-2 text-center text-sm font-black uppercase tracking-wide text-verde">
              Volvió con su familia
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black leading-tight tracking-tight">{petTitle(post)}</h3>
          <span className="shrink-0 rounded-full bg-blanco px-2 py-1 text-[11px] font-extrabold text-negro-suave">
            {formatDistance(post.distanceKm)}
          </span>
        </div>

        <p className="mt-1 text-xs font-bold text-negro-suave">
          {[
            speciesLabel(post.species),
            sexLabel(post.sex),
            ageLabel(post.age),
            sizeLabel(post.size),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-relaxed text-negro/75">
          {post.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-[11px] font-bold text-negro-suave">
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
