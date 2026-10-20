import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { PostOwnerActions } from "@/components/post-owner-actions";
import { EmptyState } from "@/components/empty-state";
import { requireUser } from "@/lib/auth";
import { getMyPostStats, getMyPosts } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Mis publicaciones",
};

export default async function MyPostsPage() {
  const user = await requireUser("/mis-publicaciones");
  const [posts, stats] = await Promise.all([getMyPosts(user.id), getMyPostStats(user.id)]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Tus avisos</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Mis publicaciones</h1>
          <p className="mt-1 text-sm font-semibold text-muted">
            {stats.active} activo(s) · {stats.resolved} volvieron con su familia
          </p>
        </div>
        <ButtonLink href="/publicar">Publicar otro aviso</ButtonLink>
      </div>

      <div className="mt-6">
        {posts.length === 0 ? (
          <EmptyState
            title="Todavía no publicaste nada"
            text="Si perdiste o encontraste una mascota, publicá un aviso con fotos y ubicación. Es gratis."
            actionHref="/publicar"
            actionLabel="Crear mi primer aviso"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="flex flex-col gap-2">
                <PostCard post={post} />
                <div className="rounded-2xl border border-line bg-white/70 p-3">
                  <PostOwnerActions
                    postId={post.id}
                    resolved={Boolean(post.resolvedAt)}
                    editHref={`/publicacion/${post.id}/editar`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
