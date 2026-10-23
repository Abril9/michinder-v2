"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkAuthRateLimit } from "@/lib/rate-limit";
import { loginSchema, registerSchema } from "@/lib/validation";
import { safeNextPath } from "@/lib/auth";
import type { AuthState } from "@/lib/action-state";

function retryMessage(seconds: number) {
  return `Demasiados intentos. Probá de nuevo en ${Math.ceil(seconds / 60)} minuto(s).`;
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const limit = checkAuthRateLimit(`register:${email}`, 5);
  if (!limit.allowed) return { error: retryMessage(limit.retryAfter) };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: error.message };

  if (!data.session) {
    return {
      message:
        "Te enviamos un email para confirmar la cuenta. Revisá tu bandeja y después ingresá.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const limit = checkAuthRateLimit(`login:${email}`, 8);
  if (!limit.allowed) return { error: retryMessage(limit.retryAfter) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email o contraseña incorrectos." };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(parsed.data.next));
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
