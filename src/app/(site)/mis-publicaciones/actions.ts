"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { storagePathFromPublicUrl } from "@/lib/storage";

const idSchema = z.string().uuid();

async function postIdFrom(formData: FormData) {
  const parsed = idSchema.safeParse(formData.get("postId"));
  if (!parsed.success) throw new Error("Publicación inválida.");
  return parsed.data;
}

async function setResolved(formData: FormData, resolved: boolean) {
  const user = await getCurrentUser();
  if (!user) redirect("/ingresar?next=/mis-publicaciones");

  const postId = await postIdFrom(formData);
  const client = await createClient();
  const { error } = await client
    .from("posts")
    .update({ resolved_at: resolved ? new Date().toISOString() : null })
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/mis-publicaciones");
  revalidatePath(`/publicacion/${postId}`);
}

export async function resolvePostAction(formData: FormData) {
  await setResolved(formData, true);
}

export async function reopenPostAction(formData: FormData) {
  await setResolved(formData, false);
}

export async function deletePostAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/ingresar?next=/mis-publicaciones");

  const postId = await postIdFrom(formData);
  const client = await createClient();

  const { data: photos } = await client
    .from("post_photos")
    .select("url")
    .eq("post_id", postId);

  const { error } = await client
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) throw new Error(error.message);

  const paths = (photos ?? [])
    .map((photo) => storagePathFromPublicUrl(photo.url))
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    await client.storage.from("post-photos").remove(paths);
  }

  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/mis-publicaciones");
  redirect("/mis-publicaciones");
}
