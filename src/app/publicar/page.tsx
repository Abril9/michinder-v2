import type { Metadata } from "next";
import { LayoutPublico } from "@/components/layout-publico";
import { requireUser } from "@/lib/auth";
import { PostForm } from "@/components/post-form";
import type { PetSpecies, PetStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Publicar un aviso",
  description: "Publicá una mascota perdida o encontrada con fotos, zona y radio de búsqueda.",
};

const speciesMap: Record<string, PetSpecies | undefined> = {
  gato: "cat",
  perro: "dog",
  otro: "other",
  cat: "cat",
  dog: "dog",
  other: "other",
};

export default async function PublishPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; especie?: string }>;
}) {
  const params = await searchParams;
  const defaultStatus: PetStatus = params.estado === "encontrado" ? "found" : "lost";
  const defaultSpecies: PetSpecies = speciesMap[params.especie ?? ""] ?? "cat";
  const redirectParams = new URLSearchParams();
  if (params.estado === "encontrado") redirectParams.set("estado", "encontrado");
  if (params.especie && speciesMap[params.especie]) {
    redirectParams.set("especie", params.especie);
  }
  const redirectQuery = redirectParams.toString();
  await requireUser(redirectQuery ? `/publicar?${redirectQuery}` : "/publicar");

  return (
    <LayoutPublico>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Nuevo aviso</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
          {defaultStatus === "lost" ? "Perdí una mascota" : "Encontré una mascota"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-muted">
          Cuanta más información y fotos, más chances de que vuelva con su familia. La ubicación
          exacta ayuda a coordinar sin vueltas.
        </p>

        <div className="mt-6">
          <PostForm
            mode="create"
            defaultStatus={defaultStatus}
            defaultSpecies={defaultSpecies}
          />
        </div>
      </div>
    </LayoutPublico>
  );
}
