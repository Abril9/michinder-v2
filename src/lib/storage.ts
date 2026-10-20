export function storagePathFromPublicUrl(url: string) {
  const marker = "/storage/v1/object/public/post-photos/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}
