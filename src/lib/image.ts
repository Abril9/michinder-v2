export async function compressImage(file: File, maxSide = 1600, quality = 0.82) {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo no es una imagen.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("No pudimos procesar la imagen.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });

  if (!blob) throw new Error("No pudimos comprimir la imagen.");

  const name = file.name.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
}
