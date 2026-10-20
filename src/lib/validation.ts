import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(emptyToUndefined, z.enum(values).optional());

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Poné tu nombre.").max(60, "Máximo 60 caracteres."),
    email: z.string().trim().toLowerCase().email("Email inválido."),
    password: z.string().min(8, "La contraseña necesita al menos 8 caracteres.").max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido."),
  password: z.string().min(1, "Ingresá tu contraseña."),
  next: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Poné tu nombre.").max(60),
  city: optionalText(80),
  whatsapp: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .regex(/^[0-9+() -]{6,25}$/, "Teléfono inválido.")
      .optional(),
  ),
  showWhatsapp: z.preprocess((value) => value === "on" || value === "true", z.boolean()),
});

export const postSchema = z.object({
  status: z.enum(["lost", "found"]),
  species: z.enum(["cat", "dog", "other"]),
  petName: optionalText(60),
  sex: z.preprocess(emptyToUndefined, z.enum(["male", "female", "unknown"]).default("unknown")),
  age: optionalEnum(["baby", "young", "adult", "senior"] as const),
  size: optionalEnum(["small", "medium", "large"] as const),
  description: z
    .string()
    .trim()
    .min(10, "Contanos un poco más (mínimo 10 caracteres).")
    .max(1200, "Máximo 1200 caracteres."),
  locationLabel: z
    .string()
    .trim()
    .min(3, "Indicá una zona o dirección.")
    .max(120, "Máximo 120 caracteres."),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  searchRadiusKm: z.coerce.number().int().min(1).max(100),
  eventDate: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida.")
      .optional(),
  ),
});

export const messageSchema = z.object({
  body: z.string().trim().min(1, "Escribí un mensaje.").max(1000),
});

export const swipeSchema = z.object({
  postId: z.string().uuid(),
  action: z.enum(["like", "pass"]),
});

export const reportSchema = z
  .object({
    postId: z.string().uuid().optional(),
    reportedUserId: z.string().uuid().optional(),
    reason: z.string().trim().min(3, "Elegí un motivo.").max(80),
    details: optionalText(600),
  })
  .refine((data) => Boolean(data.postId || data.reportedUserId), {
    message: "Falta el objetivo del reporte.",
  });

export type PostInput = z.infer<typeof postSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
