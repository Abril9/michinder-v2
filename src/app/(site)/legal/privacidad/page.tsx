import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Qué datos usa Michinder y cómo se cuidan.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Legal</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Privacidad</h1>
      <p className="mt-2 text-sm font-semibold text-muted">
        Versión corta y clara. Michinder es un MVP y no vende datos personales.
      </p>

      <div className="mt-6 space-y-5 text-sm font-semibold leading-relaxed text-ink/80">
        <Section title="Qué datos guardamos">
          <p>
            Tu nombre, email, ciudad y, si lo elegís, tu WhatsApp. También las publicaciones,
            fotos, ubicación, mensajes y reportes que creás dentro de la app.
          </p>
        </Section>
        <Section title="Ubicación exacta">
          <p>
            La ubicación que marcás se muestra en el detalle del aviso solo a personas con
            cuenta y sesión iniciada. Las tarjetas públicas muestran zona y distancia, no el
            punto exacto.
          </p>
        </Section>
        <Section title="WhatsApp">
          <p>
            Solo mostramos tu número si activás la opción en tu perfil. Aun así, recomendamos
            usar el chat interno para coordinar y no compartir datos sensibles.
          </p>
        </Section>
        <Section title="Fotos y contenido">
          <p>
            Las fotos se optimizan y se guardan en Supabase Storage. Podés eliminar tus avisos,
            lo que también borra sus fotos. Los reportes los revisa el equipo de moderación.
          </p>
        </Section>
        <Section title="Tus derechos">
          <p>
            Podés editar tu perfil, borrar publicaciones y pedir la eliminación de tu cuenta
            escribiendo a hola@michinder.app. También podés bloquear y reportar usuarios.
          </p>
        </Section>
      </div>

      <Link href="/" className="mt-8 inline-block text-sm font-black text-coral hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white/70 p-4">
      <h2 className="text-base font-black text-ink">{title}</h2>
      <div className="mt-1">{children}</div>
    </section>
  );
}
