import type { Metadata } from "next";
import { LayoutPublico } from "@/components/layout-publico";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos",
  description: "Reglas de uso de Michinder.",
};

export default function TermsPage() {
  return (
    <LayoutPublico>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Legal</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Términos de uso</h1>
        <p className="mt-2 text-sm font-semibold text-muted">
          Michinder es una herramienta comunitaria para reencontrar mascotas. Usala con respeto.
        </p>

        <div className="mt-6 space-y-5 text-sm font-semibold leading-relaxed text-ink/80">
          <Section title="Cuentas">
            <p>
              Para publicar, swipear o chatear necesitás una cuenta con email válido. Sos
              responsable de la actividad de tu cuenta y de mantener tu contraseña segura.
            </p>
          </Section>
          <Section title="Contenido">
            <p>
              Publicá información real y fotos que puedas compartir. No se permite spam, estafas,
              contenido ofensivo, maltrato animal ni suplantación de identidad.
            </p>
          </Section>
          <Section title="Moderación">
            <p>
              Cualquier persona con cuenta puede reportar avisos y bloquear usuarios. Podemos
              quitar contenido o suspender cuentas que incumplan estas reglas.
            </p>
          </Section>
          <Section title="Reencuentros">
            <p>
              Michinder acerca personas, pero no garantiza reencuentros ni verifica cada aviso.
              Coordiná en lugares públicos y tomá precauciones al entregar o recibir una mascota.
            </p>
          </Section>
          <Section title="Límites anti-spam">
            <p>
              Hay límites de chats nuevos por día y de mensajes por minuto. Los límites buscan
              cuidar la comunidad y pueden ajustarse.
            </p>
          </Section>
        </div>

        <Link href="/" className="mt-8 inline-block text-sm font-black text-coral hover:underline">
          Volver al inicio
        </Link>
      </div>
    </LayoutPublico>
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
