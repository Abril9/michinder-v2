import { getPostById } from "@/lib/data/posts";
import { createFlyerResponse } from "@/lib/flyer/flyer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let post;
  try {
    post = await getPostById(id);
  } catch {
    return new Response("No se pudo cargar el aviso", { status: 500 });
  }

  if (!post) {
    return new Response("Aviso no encontrado", { status: 404 });
  }

  try {
    return await createFlyerResponse({
      post,
      origin: requestOrigin(request),
    });
  } catch (error) {
    console.error("No se pudo generar la imagen del aviso", error);
    return new Response("No se pudo generar la imagen", { status: 500 });
  }
}

function requestOrigin(request: Request) {
  const fallback = new URL(request.url).origin;
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host");
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProto || new URL(request.url).protocol.replace(":", "");

  if (!host || (protocol !== "http" && protocol !== "https")) {
    return fallback;
  }

  return `${protocol}://${host}`;
}
