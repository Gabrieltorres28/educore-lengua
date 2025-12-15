import { NextResponse } from "next/server";
import { groqChatJSON } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const grado = body?.grado ?? "";
    const tema = body?.tema ?? "";
    const duracion = Number(body?.duracion ?? 0);
    const objetivos = body?.objetivos ?? "";
    const nivel = body?.nivel ?? "Medio";
    const evaluacion = body?.evaluacion ?? "Formativa";
    const recursos = Array.isArray(body?.recursos) ? body.recursos : [];
    const contexto = body?.contexto ?? "";
    const restricciones = body?.restricciones ?? "";

    if (!grado || !tema || !duracion) {
      return NextResponse.json({ error: "Faltan grado, tema o duración" }, { status: 400 });
    }

    const schema = `{
  "title": "",
  "overview": "",
  "materials": [],
  "agenda": [{"minuteRange":"0-5","activity":"","teacherSays":"","studentDoes":"","notes":""}],
  "coreActivity": {"type":"","steps":[],"grouping":"individual|parejas|grupos|plenario","differentiation":{"support":[],"challenge":[]}},
  "exitTicket": [{"q":"","type":"short|mcq|truefalse","answerKey":""}],
  "homework": "",
  "assessmentRubric": [{"criteria":"","levels":["Inicial","En proceso","Logrado","Sobresaliente"],"descriptors":["","","",""]}],
  "teacherChecklist": [""]
}`;

    const system = `
Sos un asistente pedagógico EXCLUSIVO de Lengua para PRIMARIA (Argentina).
Tu salida debe ser SOLO JSON válido, sin markdown, sin texto extra.
Reglas:
- "steps", "support", "challenge" deben ser arrays de strings (no objetos).
- Agenda con rangos realistas dentro de la duración.
- Lenguaje claro, docente-first y aplicable en aula.
- Si falta info, asumí lo mínimo sin inventar cosas raras.
Devolvé exactamente este esquema:
${schema}
    `.trim();

    const user = `
Datos de la clase:
- Grado: ${grado}
- Tema (Lengua, primaria): ${tema}
- Duración: ${duracion} minutos
- Objetivos: ${objetivos || "(no especificados)"}
- Nivel del grupo: ${nivel}
- Tipo de evaluación: ${evaluacion}
- Recursos disponibles: ${recursos.length ? recursos.join(", ") : "(no especificados)"}
- Contexto: ${contexto || "(no especificado)"}
- Restricciones: ${restricciones || "(no especificadas)"}

Generá un plan concreto, con actividades breves y claras, y un exit ticket acorde a primaria.
    `.trim();

    const result = await groqChatJSON([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error interno" }, { status: 500 });
  }
}
