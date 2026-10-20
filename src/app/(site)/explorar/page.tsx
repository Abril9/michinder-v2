import type { Metadata } from "next";
import { ExploreClient } from "@/components/explore-client";
import { getCurrentUser } from "@/lib/auth";
import type { ExploreFilters, PetAge, PetSex, PetSize, PetSpecies, PetStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Explorar avisos",
  description: "Filtrá mascotas perdidas y encontradas por especie, sexo, edad, tamaño y radio.",
};

const speciesMap: Record<string, PetSpecies | undefined> = {
  gato: "cat",
  perro: "dog",
  otro: "other",
};

const sexMap: Record<string, PetSex | undefined> = {
  macho: "male",
  hembra: "female",
  "no-se": "unknown",
};

const ageMap: Record<string, PetAge | undefined> = {
  cachorro: "baby",
  joven: "young",
  adulto: "adult",
  mayor: "senior",
};

const sizeMap: Record<string, PetSize | undefined> = {
  chico: "small",
  mediano: "medium",
  grande: "large",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const read = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const status: PetStatus = read("estado") === "encontrado" ? "found" : "lost";
  const initialFilters: ExploreFilters = {
    status,
    species: speciesMap[read("especie") ?? ""] ?? "all",
    sex: sexMap[read("sexo") ?? ""] ?? "all",
    age: ageMap[read("edad") ?? ""] ?? "all",
    size: sizeMap[read("tamano") ?? ""] ?? "all",
  };

  const radius = Number(read("radio"));
  const initialRadius = Number.isFinite(radius) ? Math.min(50, Math.max(1, radius)) : 10;
  const user = await getCurrentUser();

  return (
    <ExploreClient
      initialFilters={initialFilters}
      isLoggedIn={Boolean(user)}
      initialRadius={initialRadius}
    />
  );
}
