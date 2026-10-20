"use client";

import Image from "next/image";
import { X } from "lucide-react";

export function ChachaTribute({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -left-2 top-10 hidden rotate-[-6deg] rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-xl sm:-left-6 sm:block">
        <p className="text-[10px] font-black uppercase tracking-wide text-coral">Perdido</p>
        <p className="text-sm font-black">Chacha · gata negra</p>
        <p className="text-[11px] font-bold text-muted">Pañuelo rojo · Santa Fe</p>
      </div>
      <div className="absolute -right-2 bottom-16 hidden rotate-[5deg] rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-xl sm:-right-4 sm:block">
        <p className="text-[10px] font-black uppercase tracking-wide text-leaf">Encontrado</p>
        <p className="text-sm font-black">Michi · atigrado</p>
        <p className="text-[11px] font-bold text-muted">A 2,4 km de vos</p>
      </div>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-sand via-cream to-peach p-8 shadow-[0_35px_80px_-35px_rgba(29,25,22,0.5)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar homenaje a Chacha"
          title="Cerrar homenaje"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted shadow-sm transition-colors hover:bg-white hover:text-ink"
        >
          <X size={16} />
        </button>
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(29,25,22,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />
        <Image
          src="/logo.svg"
          alt="Chacha, la gatita negra con pañuelo rojo"
          width={360}
          height={360}
          priority
          className="relative mx-auto w-full max-w-[330px] drop-shadow-2xl"
        />
        <div className="relative mt-2 rounded-2xl bg-ink px-5 py-4 text-center text-cream">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-peach">
            Homenaje a Chacha
          </p>
          <p className="mt-1 text-sm font-bold">
            Su cara es nuestro logo. Su historia es nuestra razón.
          </p>
        </div>
      </div>
    </div>
  );
}
