"use client";

import { useState } from "react";
import { PawPrint } from "lucide-react";
import type { PostPhoto } from "@/lib/types";

export function PhotoGallery({ photos, title }: { photos: PostPhoto[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = photos[Math.min(active, photos.length - 1)];

  if (!current) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[1.7rem] border border-line bg-sand text-ink/25">
        <PawPrint size={70} />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.7rem] border border-line bg-sand">
        <img src={current.url} alt={title} className="h-full w-full object-cover" />
        {photos.length > 1 ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-black text-white">
            {active + 1}/{photos.length}
          </span>
        ) : null}
      </div>
      {photos.length > 1 ? (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(index)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                index === active ? "border-coral" : "border-transparent opacity-70"
              }`}
            >
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
