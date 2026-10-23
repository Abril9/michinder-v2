import type { Metadata } from "next";
import { LayoutPublico } from "@/components/layout-publico";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getPostById } from "@/lib/data/posts";
import { PostForm } from "@/components/post-form";

export const metadata: Metadata = {
  title: "Editar aviso",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser(`/publicacion/${id}/editar`);
  const post = await getPostById(id);

  if (!post || post.authorId !== user.id) notFound();

  return (
    <LayoutPublico>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Editar aviso</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
          {post.petName || "Ajustar datos"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold text-muted">
          Podés corregir datos, descripción, fecha y ubicación. Las fotos se mantienen.
        </p>
        <div className="mt-6">
          <PostForm mode="edit" initial={post} />
        </div>
      </div>
    </LayoutPublico>
  );
}
