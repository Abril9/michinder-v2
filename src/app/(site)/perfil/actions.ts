"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation";
import type { FormState } from "@/lib/action-state";

export async function updateProfileAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Ingresá para editar tu perfil." };

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, city, whatsapp, showWhatsapp } = parsed.data;
  if (showWhatsapp && !whatsapp) {
    return {
      fieldErrors: { whatsapp: ["Ingresá un número para poder mostrarlo."] },
    };
  }

  const client = await createClient();
  const { error } = await client
    .from("profiles")
    .update({
      name,
      city: city ?? null,
      whatsapp: whatsapp ?? null,
      show_whatsapp: showWhatsapp,
    })
    .eq("id", user.id);

  if (error) {
    console.error("update profile", error.message);
    return { error: "No pudimos guardar el perfil. Intentá de nuevo." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/perfil");
  return { message: "Perfil actualizado." };
}
