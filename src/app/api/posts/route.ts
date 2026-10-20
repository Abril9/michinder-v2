import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getNearbyPosts } from "@/lib/data/posts";
import type { PetAge, PetSex, PetSize, PetSpecies, PetStatus } from "@/lib/types";

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

function numberParam(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status: PetStatus = searchParams.get("estado") === "encontrado" ? "found" : "lost";
  const user = await getCurrentUser();

  try {
    const posts = await getNearbyPosts({
      status,
      species: speciesMap[searchParams.get("especie") ?? ""],
      sex: sexMap[searchParams.get("sexo") ?? ""],
      age: ageMap[searchParams.get("edad") ?? ""],
      size: sizeMap[searchParams.get("tamano") ?? ""],
      lat: numberParam(searchParams.get("lat"), -31.6333),
      lng: numberParam(searchParams.get("lng"), -60.7),
      radiusKm: Math.min(50, Math.max(1, numberParam(searchParams.get("radio"), 10))),
      viewerId: user?.id,
    });

    return NextResponse.json(
      { posts, count: posts.length },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/posts", error);
    return NextResponse.json(
      { error: "No pudimos cargar los avisos. Intentá de nuevo." },
      { status: 500 },
    );
  }
}
