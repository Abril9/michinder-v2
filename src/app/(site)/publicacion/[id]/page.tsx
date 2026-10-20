import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Lock,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { InterestButton } from "@/components/interest-button";
import { PhotoGallery } from "@/components/photo-gallery";
import { PostMap } from "@/components/post-map";
import { PostOwnerActions } from "@/components/post-owner-actions";
import { ReportButton } from "@/components/report-button";
import { ShareButtons } from "@/components/share-buttons";
import { getCurrentUser } from "@/lib/auth";
import {
  getExistingConversation,
  getPostInterestCount,
} from "@/lib/data/conversations";
import { getPostById } from "@/lib/data/posts";
import {
  ageLabel,
  formatEventDate,
  formatRelative,
  petTitle,
  postStateLabel,
  sexLabel,
  sizeLabel,
  speciesLabel,
  whatsappHref,
} from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id).catch(() => null);
  if (!post) return { title: "Aviso no encontrado" };

  return {
    title: `${petTitle(post)} · ${postStateLabel(post)}`,
    description: post.description.slice(0, 160),
    openGraph: {
      title: `${petTitle(post)} · ${postStateLabel(post)}`,
      description: post.description.slice(0, 160),
      images: post.photos[0] ? [{ url: post.photos[0].url }] : [],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const user = await getCurrentUser();
  const isAuthor = user?.id === post.authorId;
  const conversationId =
    user && !isAuthor ? await getExistingConversation(post.id, user.id) : null;
  const interestCount = isAuthor ? await getPostInterestCount(post.id) : 0;
  const loginHref = `/ingresar?next=${encodeURIComponent(`/publicacion/${post.id}`)}`;
  const shareTitle = `${petTitle(post)} · ${postStateLabel(post)} en Michinder`;
  const whatsappMessage = `Hola ${post.authorName}, vi el aviso de ${petTitle(
    post,
  )} en Michinder. ¿Seguís con la mascota?`;
  const eventDate = formatEventDate(post.eventDate);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1.5 text-sm font-extrabold text-muted hover:text-ink"
      >
        <ArrowLeft size={16} /> Volver a explorar
      </Link>

      {post.resolvedAt ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
          Este aviso terminó bien: volvió con su familia. Gracias a quienes ayudaron a encontrarla.
        </div>
      ) : null}

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div>
          <PhotoGallery photos={post.photos} title={petTitle(post)} />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge
                tone={post.resolvedAt ? "success" : post.status === "lost" ? "lost" : "found"}
              >
                {postStateLabel(post)}
              </Badge>
              <Badge tone="species">{speciesLabel(post.species)}</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              {petTitle(post)}
            </h1>
            <p className="mt-2 text-sm font-bold text-muted">
              {[sexLabel(post.sex), ageLabel(post.age), sizeLabel(post.size)]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold text-muted">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-line">
              <MapPin size={14} className="text-coral" /> {post.locationLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-line">
              Radio {post.searchRadiusKm} km
            </span>
            {eventDate ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-line">
                <CalendarDays size={14} /> {eventDate}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-line">
              {formatRelative(post.createdAt)}
            </span>
          </div>

          <p className="whitespace-pre-line rounded-[1.5rem] border border-line bg-white/75 p-4 text-sm font-semibold leading-relaxed text-ink/85">
            {post.description}
          </p>

          <div className="flex items-center gap-3 rounded-[1.5rem] border border-line bg-white/75 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-black text-cream">
              {post.authorName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{post.authorName}</p>
              <p className="text-xs font-semibold text-muted">
                {post.authorCity || "Santa Fe"}
                {post.authorShowWhatsapp ? " · WhatsApp autorizado" : ""}
              </p>
            </div>
            {post.authorShowWhatsapp ? (
              <ShieldCheck size={18} className="ml-auto shrink-0 text-leaf" />
            ) : null}
          </div>

          <div className="rounded-[1.5rem] border border-line bg-white/75 p-4">
            {isAuthor ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-black">Este aviso es tuyo</p>
                  <p className="text-xs font-semibold text-muted">
                    {interestCount > 0
                      ? `${interestCount} persona(s) abrieron un chat por este aviso.`
                      : "Todavía nadie abrió un chat por este aviso."}
                  </p>
                </div>
                {interestCount > 0 ? (
                  <ButtonLink href="/chats" size="sm" className="w-full">
                    <MessageCircle size={15} /> Ver chats
                  </ButtonLink>
                ) : null}
                <PostOwnerActions
                  postId={post.id}
                  resolved={Boolean(post.resolvedAt)}
                  editHref={`/publicacion/${post.id}/editar`}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {post.resolvedAt ? (
                  <p className="text-sm font-bold text-muted">
                    Volvió con su familia. Podés compartir el aviso para celebrarlo o dejar
                    constancia del reencuentro.
                  </p>
                ) : (
                  <InterestButton
                    postId={post.id}
                    isLoggedIn={Boolean(user)}
                    conversationId={conversationId}
                    loginHref={loginHref}
                  />
                )}

                {user && post.authorShowWhatsapp && post.authorWhatsapp ? (
                  <a
                    href={whatsappHref(post.authorWhatsapp, whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("outline", "md", "w-full text-[#128c7e]")}
                  >
                    <MessageCircle size={17} /> Escribir por WhatsApp
                  </a>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                  <ShareButtons path={`/publicacion/${post.id}`} title={shareTitle} />
                  <ReportButton
                    postId={post.id}
                    reportedUserId={post.authorId}
                    isLoggedIn={Boolean(user)}
                    loginHref={loginHref}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-6 rounded-[1.7rem] border border-line bg-white/75 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
              Ubicación
            </p>
            <h2 className="mt-0.5 text-xl font-black tracking-tight">{post.locationLabel}</h2>
          </div>
          <Badge tone="species">Radio {post.searchRadiusKm} km</Badge>
        </div>

        <div className="mt-3">
          {!user ? (
            <div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-cream/70 p-6 text-center">
              <Lock size={26} className="text-muted" />
              <p className="mt-2 text-base font-black">La ubicación exacta es para la comunidad</p>
              <p className="mt-1 max-w-sm text-sm font-semibold text-muted">
                Ingresá para ver el punto exacto en el mapa y contactar a la persona.
              </p>
              <ButtonLink href={loginHref} size="sm" className="mt-3">
                Ingresar para ver el mapa
              </ButtonLink>
            </div>
          ) : post.lat == null || post.lng == null ? (
            <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-line bg-cream/70 p-6 text-center text-sm font-semibold text-muted">
              No pudimos cargar la ubicación exacta. Volvé a intentar en un momento.
            </div>
          ) : (
            <PostMap
              lat={post.lat}
              lng={post.lng}
              radiusKm={post.searchRadiusKm}
              label={post.locationLabel}
            />
          )}
        </div>
      </section>
    </div>
  );
}
