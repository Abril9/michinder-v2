import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getPublicProfile(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles_public")
    .select("id, name, city, show_whatsapp, whatsapp, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id ?? id,
    name: data.name ?? "Usuario",
    city: data.city,
    whatsapp: data.whatsapp,
    showWhatsapp: Boolean(data.show_whatsapp),
    createdAt: data.created_at ?? new Date().toISOString(),
  };
}
