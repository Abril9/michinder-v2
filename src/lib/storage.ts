/**
 * Extrae el path dentro del bucket a partir de una URL pública.
 * Se usa para borrar los archivos de Storage cuando se elimina un aviso.
 */
export function storagePathFromPublicUrl(url: string) {
  const marker = "/storage/v1/object/public/post-photos/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}
