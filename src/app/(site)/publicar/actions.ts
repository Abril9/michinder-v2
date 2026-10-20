"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MAX_PHOTOS, MAX_PHOTO_MB } from "@/lib/constants";
import { postSchema } from "@/lib/validation";
import type { FormState } from "@/lib/action-state";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type Client = SupabaseClient<Database>;

function fieldErrors(error: z.ZodError) {
  return { fieldErrors: error.flatten().fieldErrors };
}

function imageFiles(formData: FormData) {
  return formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

function validatePhotos(files: File[], required: boolean) {
  if (required && files.length === 0) return "Subí al menos una foto de la mascota.";
  if (files.length > MAX_PHOTOS) return `Podés subir hasta ${MAX_PHOTOS} fotos.`;
  for (const file of files) {
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      return `Cada foto puede pesar hasta ${MAX_PHOTO_MB} MB.`;
    }
  }
  return null;
}

async function uploadPhotos(client: Client, userId: string, files: File[]) {
  const urls: string[] = [];
  const paths: string[] = [];

  try {
    for (const file of files) {
      const input = Buffer.from(await file.arrayBuffer());
      const output = await sharp(input)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      const path = `${userId}/${randomUUID()}.webp`;
      const { error } = await client.storage.from("post-photos").upload(path, output, {
        contentType: "image/webp",
        cacheControl: "31536000",
      });
      if (error) throw new Error("No pudimos subir las fotos.");

      paths.push(path);
      urls.push(client.storage.from("post-photos").getPublicUrl(path).data.publicUrl);
    }
  } catch (error) {
    if (paths.length > 0) await client.storage.from("post-photos").remove(paths);
    throw error;
  }

  return { urls, paths };
}

export async function createPostAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Ingresá para publicar." };

  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);

  const files = imageFiles(formData);
  const photoError = validatePhotos(files, true);
  if (photoError) return { error: photoError };

  const client = await createClient();
  let uploaded: { urls: string[]; paths: string[] };

  try {
    uploaded = await uploadPhotos(client, user.id, files);
  } catch (error) {
    console.error("upload photos", error);
    return { error: error instanceof Error ? error.message : "No pudimos subir las fotos." };
  }

  // Los tipos generados marcan como obligatorios los parámetros nullable del RPC.
  const { data: postId, error } = await client.rpc("create_post", {
    p_status: parsed.data.status,
    p_species: parsed.data.species,
    p_pet_name: parsed.data.petName ?? "",
    p_sex: parsed.data.sex,
    p_age: parsed.data.age ?? null,
    p_size: parsed.data.size ?? null,
    p_description: parsed.data.description,
    p_location_label: parsed.data.locationLabel,
    p_lat: parsed.data.lat,
    p_lng: parsed.data.lng,
    p_search_radius_km: parsed.data.searchRadiusKm,
    p_event_date: parsed.data.eventDate ?? null,
  } as never);

  if (error || !postId) {
    await client.storage.from("post-photos").remove(uploaded.paths);
    console.error("create_post", error?.message);
    return { error: "No pudimos publicar el aviso. Intentá de nuevo." };
  }

  const { error: photosError } = await client.from("post_photos").insert(
    uploaded.urls.map((url, index) => ({
      post_id: postId,
      url,
      position: index,
    })),
  );

  if (photosError) {
    await client.from("posts").delete().eq("id", postId);
    await client.storage.from("post-photos").remove(uploaded.paths);
    console.error("insert photos", photosError.message);
    return { error: "No pudimos guardar las fotos. Intentá de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/mis-publicaciones");
  redirect(`/publicacion/${postId}?publicado=1`);
}

export async function updatePostAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Ingresá para editar." };

  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);

  const postId = z.string().uuid().safeParse(formData.get("postId"));
  if (!postId.success) return { error: "Publicación inválida." };

  const client = await createClient();
  const { error } = await client.rpc("update_post", {
    p_id: postId.data,
    p_pet_name: parsed.data.petName ?? "",
    p_sex: parsed.data.sex,
    p_age: parsed.data.age ?? null,
    p_size: parsed.data.size ?? null,
    p_description: parsed.data.description,
    p_location_label: parsed.data.locationLabel,
    p_lat: parsed.data.lat,
    p_lng: parsed.data.lng,
    p_search_radius_km: parsed.data.searchRadiusKm,
    p_event_date: parsed.data.eventDate ?? null,
  } as never);

  if (error) {
    console.error("update_post", error.message);
    return { error: "No pudimos guardar los cambios. Verificá que el aviso sea tuyo." };
  }

  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/mis-publicaciones");
  revalidatePath(`/publicacion/${postId.data}`);
  redirect(`/publicacion/${postId.data}?editado=1`);
}
