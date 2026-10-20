"use client";

import Link from "next/link";
import { startTransition, useActionState, useRef, useState } from "react";
import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  MapPin,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { createPostAction, updatePostAction } from "@/app/(site)/publicar/actions";
import { LocationPicker } from "@/components/location-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AGE_OPTIONS,
  DEFAULT_LOCATION,
  MAX_PHOTOS,
  MAX_PHOTO_MB,
  SIZE_OPTIONS,
  SPECIES_OPTIONS,
  SEX_OPTIONS,
} from "@/lib/constants";
import { formatRelative, statusLabel } from "@/lib/format";
import { compressImage } from "@/lib/image";
import type { FormState } from "@/lib/action-state";
import type { LatLng } from "@/lib/geo";
import type { PetSpecies, PetStatus, Post } from "@/lib/types";
import { cn } from "@/lib/utils";

type PhotoDraft = {
  id: string;
  file: File;
  preview: string;
};

const initialState: FormState = {};

export function PostForm({
  mode,
  initial,
  defaultStatus = "lost",
  defaultSpecies = "cat",
}: {
  mode: "create" | "edit";
  initial?: Post;
  defaultStatus?: PetStatus;
  defaultSpecies?: PetSpecies;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "create" ? createPostAction : updatePostAction,
    initialState,
  );
  const [status, setStatus] = useState<PetStatus>(initial?.status ?? defaultStatus);
  const [species, setSpecies] = useState<PetSpecies>(initial?.species ?? defaultSpecies);
  const [location, setLocation] = useState<LatLng>({
    lat: initial?.lat ?? DEFAULT_LOCATION.lat,
    lng: initial?.lng ?? DEFAULT_LOCATION.lng,
  });
  const [locationLabel, setLocationLabel] = useState(initial?.locationLabel ?? "");
  const [radiusKm, setRadiusKm] = useState(initial?.searchRadiusKm ?? 10);
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [compressing, setCompressing] = useState(false);

  const existingPhotos = initial?.photos ?? [];
  const totalPhotos = existingPhotos.length + photos.length;

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const remaining = MAX_PHOTOS - totalPhotos;
    if (remaining <= 0) {
      toast.error(`Podés subir hasta ${MAX_PHOTOS} fotos.`);
      return;
    }

    setCompressing(true);
    for (const file of files.slice(0, remaining)) {
      if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
        toast.error(`“${file.name}” pesa más de ${MAX_PHOTO_MB} MB.`);
        continue;
      }
      try {
        const compressed = await compressImage(file);
        setPhotos((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            file: compressed,
            preview: URL.createObjectURL(compressed),
          },
        ]);
      } catch {
        toast.error(`No pudimos procesar “${file.name}”. Probá con otra foto.`);
      }
    }
    setCompressing(false);
  }

  function removePhoto(id: string) {
    setPhotos((previous) => {
      const target = previous.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return previous.filter((photo) => photo.id !== id);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;

    if (mode === "create" && photos.length === 0) {
      toast.error("Subí al menos una foto de la mascota.");
      return;
    }

    const formData = new FormData(formRef.current);
    photos.forEach((photo) => formData.append("photos", photo.file, photo.file.name));
    startTransition(() => formAction(formData));
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {mode === "edit" && initial ? <input type="hidden" name="postId" value={initial.id} /> : null}
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="species" value={species} />
      <input type="hidden" name="lat" value={location.lat} />
      <input type="hidden" name="lng" value={location.lng} />
      <input type="hidden" name="searchRadiusKm" value={radiusKm} />

      {mode === "create" ? (
        <section className="rounded-[1.7rem] border border-line bg-white/75 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">1. El aviso</p>
          <h2 className="mt-1 text-xl font-black tracking-tight">¿Qué pasó?</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <StatusButton
              active={status === "lost"}
              tone="lost"
              title="Perdí una mascota"
              text="Se escapó, se perdió o no volvió."
              onClick={() => setStatus("lost")}
            />
            <StatusButton
              active={status === "found"}
              tone="found"
              title="Encontré una mascota"
              text="La vi en la calle o la tengo conmigo."
              onClick={() => setStatus("found")}
            />
          </div>
        </section>
      ) : (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white/60 px-4 py-3">
          <Badge tone={status === "lost" ? "lost" : "found"}>{statusLabel(status)}</Badge>
          <span className="text-sm font-extrabold">{SPECIES_OPTIONS.find((item) => item.value === species)?.label}</span>
          {initial ? (
            <span className="ml-auto text-xs font-bold text-muted">
              Publicado {formatRelative(initial.createdAt)}
            </span>
          ) : null}
        </div>
      )}

      <section className="rounded-[1.7rem] border border-line bg-white/75 p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
          {mode === "create" ? "2. La mascota" : "Datos de la mascota"}
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight">Contanos cómo es</h2>

        {mode === "create" ? (
          <div className="mt-4">
            <p className="text-[11px] font-black uppercase tracking-wide text-muted">Especie</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SPECIES_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={species === option.value}
                  onClick={() => setSpecies(option.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-extrabold transition-colors",
                    species === option.value
                      ? "border-ink bg-ink text-cream"
                      : "border-line bg-white text-muted hover:text-ink",
                  )}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Nombre (si lo sabés)"
            name="petName"
            defaultValue={initial?.petName ?? ""}
            placeholder="Ej. Luna"
            maxLength={60}
            error={state.fieldErrors?.petName?.[0]}
          />
          <SelectField
            label="Sexo"
            name="sex"
            defaultValue={initial?.sex ?? "unknown"}
            options={SEX_OPTIONS}
            error={state.fieldErrors?.sex?.[0]}
          />
          <SelectField
            label="Edad aproximada"
            name="age"
            defaultValue={initial?.age ?? ""}
            options={AGE_OPTIONS}
            placeholder="No sé"
            error={state.fieldErrors?.age?.[0]}
          />
          <SelectField
            label="Tamaño"
            name="size"
            defaultValue={initial?.size ?? ""}
            options={SIZE_OPTIONS}
            placeholder="No sé"
            error={state.fieldErrors?.size?.[0]}
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-extrabold text-ink">Descripción</span>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            rows={4}
            maxLength={1200}
            placeholder="Color, manchas, collar, señas particulares, cómo se comporta..."
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base leading-relaxed focus:border-coral focus:outline-none"
          />
          {state.fieldErrors?.description?.[0] ? (
            <span className="mt-1 block text-xs font-bold text-red-600">
              {state.fieldErrors.description[0]}
            </span>
          ) : null}
        </label>

        <label className="mt-4 block sm:max-w-xs">
          <span className="mb-1.5 block text-sm font-extrabold text-ink">
            Fecha del hecho (opcional)
          </span>
          <input
            type="date"
            name="eventDate"
            defaultValue={initial?.eventDate ?? ""}
            max={new Date().toISOString().slice(0, 10)}
            className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-base focus:border-coral focus:outline-none"
          />
        </label>
      </section>

      <section className="rounded-[1.7rem] border border-line bg-white/75 p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
          {mode === "create" ? "3. Fotos" : "Fotos"}
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight">
          {mode === "create" ? "Una foto vale más que mil avisos" : "Fotos actuales"}
        </h2>

        {mode === "create" ? (
          <>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-sand"
                >
                  <img src={photo.preview} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    aria-label="Quitar foto"
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={compressing}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-line bg-cream/60 text-muted hover:border-coral hover:text-coral disabled:opacity-60"
                >
                  {compressing ? <Loader2 size={24} className="animate-spin" /> : <ImagePlus size={24} />}
                  <span className="text-[11px] font-extrabold">
                    {compressing ? "Procesando" : "Agregar"}
                  </span>
                </button>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="sr-only"
            />
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
              <Camera size={14} /> Hasta {MAX_PHOTOS} fotos. Se optimizan automáticamente.
            </p>
          </>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {existingPhotos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden rounded-2xl border border-line bg-sand"
              >
                <img src={photo.url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {existingPhotos.length === 0 ? (
              <p className="col-span-3 text-sm font-semibold text-muted">Sin fotos.</p>
            ) : null}
          </div>
        )}
        {mode === "edit" ? (
          <p className="mt-2 text-xs font-semibold text-muted">
            Para cambiar las fotos, eliminá el aviso y creá uno nuevo.
          </p>
        ) : null}
      </section>

      <section className="rounded-[1.7rem] border border-line bg-white/75 p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
          {mode === "create" ? "4. Ubicación" : "Ubicación"}
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight">¿Dónde se perdió o se encontró?</h2>
        <div className="mt-4">
          <LocationPicker
            value={location}
            label={locationLabel}
            radiusKm={radiusKm}
            onValueChange={setLocation}
            onLabelChange={setLocationLabel}
            onRadiusChange={setRadiusKm}
          />
        </div>
      </section>

      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.7rem] border border-line bg-white/75 p-5">
        <p className="flex items-center gap-1.5 text-xs font-bold text-muted">
          <ShieldCheck size={15} className="text-leaf" /> La ubicación exacta se muestra en el
          detalle.
        </p>
        <div className="flex gap-2">
          <Link
            href={mode === "edit" && initial ? `/publicacion/${initial.id}` : "/"}
            className="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-extrabold text-ink hover:bg-cream"
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={pending || compressing} size="lg">
            {pending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {pending ? "Guardando..." : mode === "create" ? "Publicar aviso" : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-muted">
        <MapPin size={13} /> Tu dirección exacta es visible para personas con cuenta.
      </p>
    </form>
  );
}

function StatusButton({
  active,
  tone,
  title,
  text,
  onClick,
}: {
  active: boolean;
  tone: "lost" | "found";
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition-colors",
        active
          ? tone === "lost"
            ? "border-coral bg-red-50"
            : "border-leaf bg-emerald-50"
          : "border-line bg-white hover:border-ink/20",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-white",
          tone === "lost" ? "bg-coral" : "bg-leaf",
        )}
      >
        {active ? <Check size={18} /> : tone === "lost" ? "🔎" : "🏠"}
      </span>
      <span className="mt-3 block text-base font-black">{title}</span>
      <span className="mt-0.5 block text-xs font-semibold text-muted">{text}</span>
    </button>
  );
}

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-extrabold text-ink">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-base placeholder:text-muted/60 focus:border-coral focus:outline-none"
      />
      {error ? <span className="mt-1 block text-xs font-bold text-red-600">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-extrabold text-ink">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-base font-semibold focus:border-coral focus:outline-none"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs font-bold text-red-600">{error}</span> : null}
    </label>
  );
}

