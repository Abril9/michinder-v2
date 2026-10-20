"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { Eye, Heart, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ageLabel,
  formatDistance,
  formatEventDate,
  formatRelative,
  petTitle,
  sexLabel,
  sizeLabel,
  speciesLabel,
  statusLabel,
} from "@/lib/format";
import type { Post } from "@/lib/types";

type SwipeAction = "like" | "pass";

export function SwipeDeck({
  posts,
  onAction,
  acting,
}: {
  posts: Post[];
  onAction: (post: Post, action: SwipeAction) => Promise<boolean>;
  acting: boolean;
}) {
  const current = posts[0];
  const next = posts[1];
  const [photoState, setPhotoState] = useState<{ postId?: string; index: number }>({
    index: 0,
  });
  const photoIndex = photoState.postId === current?.id ? photoState.index : 0;
  const [busy, setBusy] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-13, 0, 13]);
  const likeOpacity = useTransform(x, [20, 140], [0, 1]);
  const passOpacity = useTransform(x, [-140, -20], [1, 0]);

  useEffect(() => {
    x.set(0);
  }, [current?.id, x]);

  const triggerRef = useRef<(action: SwipeAction) => Promise<void>>(async () => {});

  const trigger = useCallback(
    async (action: SwipeAction) => {
      if (!current || busy || acting) return;
      setBusy(true);
      await animate(x, action === "like" ? 560 : -560, {
        duration: 0.22,
        ease: "easeOut",
      });
      const accepted = await onAction(current, action);
      if (!accepted) x.set(0);
      setBusy(false);
    },
    [acting, busy, current, onAction, x],
  );

  useEffect(() => {
    triggerRef.current = trigger;
  }, [trigger]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        void triggerRef.current("pass");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        void triggerRef.current("like");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!current) return null;

  const photos = current.photos;
  const activePhoto = photos[Math.min(photoIndex, photos.length - 1)];
  const eventDate = formatEventDate(current.eventDate);
  const disabled = busy || acting;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative h-[min(68vh,640px)] min-h-[500px] select-none">
        {next ? (
          <div className="absolute inset-x-3 top-3 h-full overflow-hidden rounded-[2rem] border border-line bg-white opacity-70">
            {next.photos[0] ? (
              <img
                src={next.photos[0].url}
                alt=""
                className="h-full w-full object-cover"
                aria-hidden
              />
            ) : (
              <div className="h-full w-full bg-sand" />
            )}
            <div className="absolute inset-0 bg-ink/20" />
          </div>
        ) : null}

        <motion.article
          key={current.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.85}
          onDragEnd={(_, info) => {
            if (info.offset.x > 110 || info.velocity.x > 650) {
              void trigger("like");
            } else if (info.offset.x < -110 || info.velocity.x < -650) {
              void trigger("pass");
            } else {
              void animate(x, 0, { type: "spring", stiffness: 320, damping: 30 });
            }
          }}
          style={{ x, rotate }}
          className="absolute inset-0 cursor-grab overflow-hidden rounded-[2rem] border border-line bg-ink shadow-[0_30px_80px_-30px_rgba(29,25,22,0.65)] active:cursor-grabbing"
        >
          {activePhoto ? (
            <img
              src={activePhoto.url}
              alt={petTitle(current)}
              className="pointer-events-none h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-sand text-ink/25">
              <span className="text-6xl">🐾</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />

          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge tone={current.status === "lost" ? "lost" : "found"}>
                {statusLabel(current.status)}
              </Badge>
              <Badge tone="species">{speciesLabel(current.species)}</Badge>
            </div>
            {photos.length > 1 ? (
              <div className="flex gap-1 rounded-full bg-ink/45 px-2 py-1.5 backdrop-blur">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    aria-label={`Ver foto ${index + 1}`}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setPhotoState({ postId: current.id, index });
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      index === photoIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <motion.div
            style={{ opacity: likeOpacity }}
            className="pointer-events-none absolute left-5 top-20 rotate-[-10deg] rounded-xl border-4 border-emerald-300 px-3 py-1 text-2xl font-black uppercase tracking-wide text-emerald-300"
          >
            Me interesa
          </motion.div>
          <motion.div
            style={{ opacity: passOpacity }}
            className="pointer-events-none absolute right-5 top-20 rotate-[10deg] rounded-xl border-4 border-red-300 px-3 py-1 text-2xl font-black uppercase tracking-wide text-red-300"
          >
            Seguir
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-cream">
            <h2 className="text-3xl font-black leading-tight tracking-tight">
              {petTitle(current)}
            </h2>
            <p className="mt-1 text-xs font-bold text-cream/75">
              {[
                speciesLabel(current.species),
                sexLabel(current.sex),
                ageLabel(current.age),
                sizeLabel(current.size),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p className="mt-2 line-clamp-3 text-sm font-semibold leading-relaxed text-cream/90">
              {current.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-cream/75">
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} /> {current.locationLabel}
              </span>
              <span>{formatDistance(current.distanceKm)}</span>
              {eventDate ? <span>{eventDate}</span> : null}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
              <div>
                <p className="text-xs font-extrabold">Publicado por {current.authorName}</p>
                <p className="text-[10px] font-bold text-cream/60">
                  {formatRelative(current.createdAt)}
                </p>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-wide">
                Radio {current.searchRadiusKm} km
              </span>
            </div>
          </div>
        </motion.article>
      </div>

      <div className="mt-4 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => void trigger("pass")}
          disabled={disabled}
          aria-label="Seguir viendo"
          className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white text-ink shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
        <Link
          href={`/publicacion/${current.id}`}
          aria-label="Ver detalle"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-cream text-muted hover:text-ink"
        >
          <Eye size={20} />
        </Link>
        <button
          type="button"
          onClick={() => void trigger("like")}
          disabled={disabled}
          aria-label="Me interesa"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-coral text-white shadow-[0_14px_30px_-10px_rgba(225,29,72,0.9)] transition-transform hover:scale-105 disabled:opacity-50"
        >
          <Heart size={28} strokeWidth={2.6} />
        </button>
      </div>
      <p className="mt-3 text-center text-[11px] font-bold text-muted">
        Arrastrá la tarjeta o usá ← →. Deslizá a la derecha si te interesa.
      </p>
    </div>
  );
}
