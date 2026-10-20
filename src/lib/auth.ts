import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser, Profile } from "@/lib/types";

function fallbackProfile(id: string, email: string): Profile {
  return {
    id,
    name: email.split("@")[0] || "Usuario",
    city: null,
    whatsapp: null,
    showWhatsapp: false,
    createdAt: new Date().toISOString(),
  };
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, city, whatsapp, show_whatsapp, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email,
    profile: profile
      ? {
          id: profile.id,
          name: profile.name,
          city: profile.city,
          whatsapp: profile.whatsapp,
          showWhatsapp: profile.show_whatsapp,
          createdAt: profile.created_at,
        }
      : fallbackProfile(user.id, user.email),
  };
});

export async function requireUser(nextPath = "/") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/ingresar?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}

export function safeNextPath(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}
