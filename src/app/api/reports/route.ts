import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createReport } from "@/lib/data/reports";
import { reportSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Ingresá para reportar." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 },
    );
  }

  try {
    await createReport(user.id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/reports", error);
    return NextResponse.json({ error: "No pudimos enviar el reporte." }, { status: 500 });
  }
}
