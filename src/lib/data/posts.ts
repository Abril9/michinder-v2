import "server-only";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_LOCATION } from "@/lib/constants";
import type {
  PetAge,
  PetSex,
  PetSize,
  PetSpecies,
  PetStatus,
  Post,
  PostFilters,
  PostPhoto,
} from "@/lib/types";

type RawPost = {
  id: string | null;
  author_id: string | null;
  author_name: string | null;
  author_city: string | null;
  author_show_whatsapp: boolean | null;
  author_whatsapp: string | null;
  status: PetStatus | null;
  species: PetSpecies | null;
  pet_name: string | null;
  sex: PetSex | null;
  age: PetAge | null;
  size: PetSize | null;
  description: string | null;
  location_label: string | null;
  lat: number | null;
  lng: number | null;
  search_radius_km: number | null;
  event_date: string | null;
  resolved_at: string | null;
  created_at: string | null;
  photos: unknown;
  distance_km?: number | null;
};

function mapPhotos(value: unknown): PostPhoto[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((photo): photo is Record<string, unknown> => Boolean(photo) && typeof photo === "object")
    .map((photo, index) => ({
      id: String(photo.id ?? index),
      url: String(photo.url ?? ""),
      position: Number(photo.position ?? index),
    }))
    .filter((photo) => photo.url.length > 0)
    .sort((a, b) => a.position - b.position);
}

function mapPost(row: RawPost): Post {
  return {
    id: row.id ?? "",
    authorId: row.author_id ?? "",
    authorName: row.author_name ?? "Usuario",
    authorCity: row.author_city ?? null,
    authorShowWhatsapp: Boolean(row.author_show_whatsapp),
    authorWhatsapp: row.author_whatsapp ?? null,
    status: row.status ?? "lost",
    species: row.species ?? "other",
    petName: row.pet_name ?? null,
    sex: row.sex ?? "unknown",
    age: row.age ?? null,
    size: row.size ?? null,
    description: row.description ?? "",
    locationLabel: row.location_label ?? "",
    lat: row.lat == null ? null : Number(row.lat),
    lng: row.lng == null ? null : Number(row.lng),
    searchRadiusKm: Number(row.search_radius_km ?? 10),
    eventDate: row.event_date ?? null,
    resolvedAt: row.resolved_at ?? null,
    createdAt: row.created_at ?? new Date().toISOString(),
    photos: mapPhotos(row.photos),
    distanceKm: row.distance_km == null ? null : Number(row.distance_km),
  };
}

export async function getNearbyPosts(filters: PostFilters): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("nearby_posts", {
    p_status: filters.status,
    p_species: filters.species,
    p_sex: filters.sex,
    p_age: filters.age,
    p_size: filters.size,
    p_lat: filters.lat ?? DEFAULT_LOCATION.lat,
    p_lng: filters.lng ?? DEFAULT_LOCATION.lng,
    p_radius_km: filters.radiusKm ?? 10,
    p_viewer_id: filters.viewerId,
  });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as RawPost[]).map(mapPost);
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts_public")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPost(data as unknown as RawPost) : null;
}

export async function getRecentPosts(limit = 6): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts_public")
    .select("*")
    .is("resolved_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as RawPost[]).map(mapPost);
}

export async function getMyPosts(userId: string): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts_public")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as RawPost[]).map(mapPost);
}

export async function getPostStats() {
  const supabase = await createClient();
  const [active, resolved] = await Promise.all([
    supabase
      .from("posts_public")
      .select("id", { count: "exact", head: true })
      .is("resolved_at", null),
    supabase
      .from("posts_public")
      .select("id", { count: "exact", head: true })
      .not("resolved_at", "is", null),
  ]);

  return {
    active: active.count ?? 0,
    resolved: resolved.count ?? 0,
  };
}

export async function getMyPostStats(userId: string) {
  const supabase = await createClient();
  const [active, resolved] = await Promise.all([
    supabase
      .from("posts_public")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId)
      .is("resolved_at", null),
    supabase
      .from("posts_public")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId)
      .not("resolved_at", "is", null),
  ]);

  return { active: active.count ?? 0, resolved: resolved.count ?? 0 };
}
