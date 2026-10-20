export const SITE_NAME = "Michinder";
export const SITE_TAGLINE = "Para que vuelvan a casa.";
export const SITE_DESCRIPTION =
  "Avisos de mascotas perdidas y encontradas. Filtrá, swipeá y chateá para volver a encontrarse.";

export const DEFAULT_LOCATION = {
  lat: -31.6333,
  lng: -60.7,
  label: "Santa Fe, Argentina",
} as const;

export const MAX_PHOTOS = 3;
export const MAX_PHOTO_MB = 8;

export const CHAT_LIMITS = {
  newConversationsPerDay: 10,
  messagesPerMinute: 20,
  messagesPerDay: 200,
  duplicateWindowSeconds: 30,
} as const;

export const STATUS_OPTIONS = [
  { value: "lost", label: "Perdido", plural: "Perdidos", emoji: "🔎" },
  { value: "found", label: "Encontrado", plural: "Encontrados", emoji: "🏠" },
] as const;

export const RESOLVED_LABEL = "Volvió con su familia";

export const SPECIES_OPTIONS = [
  { value: "cat", label: "Gato", plural: "Gatos", emoji: "🐱" },
  { value: "dog", label: "Perro", plural: "Perros", emoji: "🐶" },
  { value: "other", label: "Otro", plural: "Otros", emoji: "🐾" },
] as const;

export const SEX_OPTIONS = [
  { value: "male", label: "Macho" },
  { value: "female", label: "Hembra" },
  { value: "unknown", label: "No sé" },
] as const;

export const AGE_OPTIONS = [
  { value: "baby", label: "Cachorro" },
  { value: "young", label: "Joven" },
  { value: "adult", label: "Adulto" },
  { value: "senior", label: "Mayor" },
] as const;

export const SIZE_OPTIONS = [
  { value: "small", label: "Chico" },
  { value: "medium", label: "Mediano" },
  { value: "large", label: "Grande" },
] as const;

export const RADIUS_MIN_KM = 1;
export const RADIUS_MAX_KM = 50;
export const RADIUS_DEFAULT_KM = 10;
