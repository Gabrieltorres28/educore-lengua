"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/Logo";

type Phase =
  | "idle"
  | "intro"
  | "thinking"
  | "summary"
  | "agenda"
  | "core"
  | "exit"
  | "rubric"
  | "done"
  | "error";

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function toText(x: any): string {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "number" || typeof x === "boolean") return String(x);
  if (typeof x === "object") {
    if (typeof x.step === "string") return x.step;
    if (typeof x.text === "string") return x.text;
    if (typeof x.title === "string") return x.title;
    if (typeof x.activity === "string") return x.activity;
    try { return JSON.stringify(x); } catch { return String(x); }
  }
  return String(x);
}

const ALL_RECURSOS = ["pizarra", "cuaderno", "hojas", "lapiz", "cartulina", "biblioteca"] as const;

export default function LessonPlannerPage() {
  const [grado, setGrado] = useState("4°");
  const [tema, setTema] = useState("Análisis de oraciones");
  const [duracion, setDuracion] = useState<number>(50);
  const [objetivos, setObjetivos] = useState("Comprender y practicar el tema en oraciones propias");
  const [nivel, setNivel] = useState<"Bajo" | "Medio" | "Alto">("Medio");
  const [evaluacion, setEvaluacion] = useState<"Formativa" | "Sumativa">("Formativa");
  const [recursos, setRecursos] = useState<string[]>(["pizarra", "cuaderno", "hojas", "lapiz"]);
  const [contexto, setContexto] = useState("");
  const [restricciones, setRestricciones] = useState("");

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const [debugOpen, setDebugOpen] = useState(false);

  const runIdRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const timersRef = useRef<number[]>([]);
  const outputRef = useRef<HTMLDivElement | null>(null);

  const assistantIntro = useMemo(() => {
    const t = tema?.trim() ? `sobre “${tema.trim()}”` : "sobre el tema que me indiques";
    return `Perfecto. Te armo una clase de Lengua para ${grado} ${t}.`;
  }, [grado, tema]);

  function clearTimers() {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }

  function resetUI() {
    clearTimers();
    abortRef.current?.abort();
    abortRef.current = null;
    setPlan(null);
    setError(null);
    setDebugOpen(false);
    setPhase("idle");
  }

  useEffect(() => {
    return () => {
      clearTimers();
      abortRef.current?.abort();
    };
  }, []);

  async function onGenerate() {
    clearTimers();
    abortRef.current?.abort();

    const rid = uuid();
    runIdRef.current = rid;
    const ac = new AbortController();
    abortRef.current = ac;

    setPlan(null);
    setError(null);
    setDebugOpen(false);
    setPhase("intro");

    outputRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    // feedback estilo asistente (sin “generando…”)
    timersRef.current.push(window.setTimeout(() => setPhase("thinking"), 650));

    try {
      const res = await fetch("/api/ai/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grado,
          tema,
          duracion,
          objetivos,
          nivel,
          evaluacion,
          recursos,
          contexto,
          restricciones,
        }),
        signal: ac.signal,
      });

      const data = await res.json().catch(async () => ({ error: await res.text() }));

      if (runIdRef.current !== rid) return;
      if (!res.ok) throw new Error(data?.error ?? "Error del servidor");

      setPlan(data.result);

      // reveal progresivo por secciones
      setPhase("summary");
      timersRef.current.push(window.setTimeout(() => setPhase("agenda"), 900));
      timersRef.current.push(window.setTimeout(() => setPhase("core"), 1700));
      timersRef.current.push(window.setTimeout(() => setPhase("exit"), 2400));
      timersRef.current.push(window.setTimeout(() => setPhase("rubric"), 3100));
      timersRef.current.push(window.setTimeout(() => setPhase("done"), 3600));
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      if (runIdRef.current !== rid) return;
      setError(e?.message ?? "Error");
      setPhase("error");
    }
  }

  function toggleRecurso(r: string) {
    setRecursos((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  const isBusy =
    phase === "thinking" ||
    phase === "summary" ||
    phase === "agenda" ||
    phase === "core" ||
    phase === "exit" ||
    phase === "rubric";

  return (
    <>
      <div className="topbar">
        <div className="topbarInner">
          <Logo />
          <span className="pill">Planificador · Lengua · Primaria</span>
        </div>
      </div>

      <main className="container">
        <div className="hero">
          <div>
            <h1>Plan de clase listo para el aula</h1>
            <p>
              Completá los datos y obtené un plan claro: <b>agenda por tiempos</b>, actividad central,
              diferenciación y evaluación. La salida aparece por etapas para que se lea fácil.
            </p>
          </div>
     

        <div className="grid">
          <section className="card">
            <div className="cardHead">
              <div>
                <h2>Datos de la clase</h2>
                <span>Enfocado en Lengua (primaria). Cuanto más concreto, mejor el resultado.</span>
              </div>
            </div>
            <div className="cardBody">
              <div className="row">
                <div className="field">
                  <label>Grado</label>
                  <select value={grado} onChange={(e) => setGrado(e.target.value)}>
                    {["1°", "2°", "3°", "4°", "5°", "6°"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Duración (min)</label>
                  <input
                    type="number"
                    value={duracion}
                    min={20}
                    max={120}
                    onChange={(e) => setDuracion(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="field">
                <label>Tema (Lengua)</label>
                <input value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ej: análisis de oraciones" />
              </div>

              <div className="field">
                <label>Objetivos (breve)</label>
                <textarea value={objetivos} onChange={(e) => setObjetivos(e.target.value)} />
              </div>

              <div className="row">
                <div className="field">
                  <label>Nivel del grupo</label>
                  <select value={nivel} onChange={(e) => setNivel(e.target.value as any)}>
                    {["Bajo", "Medio", "Alto"].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Evaluación</label>
                  <select value={evaluacion} onChange={(e) => setEvaluacion(e.target.value as any)}>
                    {["Formativa", "Sumativa"].map((ev) => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Recursos disponibles</label>
                <div className="chips">
                  {ALL_RECURSOS.map((r) => (
                    <div key={r} className={"chip " + (recursos.includes(r) ? "on" : "")} onClick={() => toggleRecurso(r)}>
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Contexto (opcional)</label>
                <input value={contexto} onChange={(e) => setContexto(e.target.value)} placeholder="Ej: grupo inquieto, participa bien con juegos" />
              </div>

              <div className="field" style={{ marginBottom: 2 }}>
                <label>Restricciones (opcional)</label>
                <input value={restricciones} onChange={(e) => setRestricciones(e.target.value)} placeholder="Ej: sin internet, sin proyector" />
              </div>

              <div className="actions" style={{ marginTop: 14 }}>
                <button onClick={onGenerate} disabled={isBusy}>Crear plan</button>
                <button className="secondary" onClick={resetUI} type="button">Limpiar</button>
              </div>

              <p className="smallNote">
                Si volvés atrás o cambiás el tema y generás de nuevo, el pedido anterior se cancela (no se mezclan respuestas).
              </p>
            </div>
          </section>

          <section className="card" ref={outputRef as any}>
            <div className="cardHead">
              <div>
                <h2>Salida</h2>
                <span>Formato docente-first: estructura clara, sin relleno.</span>
              </div>
            </div>

            <div className="output">
              {(phase === "intro" || phase === "thinking" || phase === "summary" || phase === "agenda" || phase === "core" || phase === "exit" || phase === "rubric" || phase === "done") && (
                <div className="assistantLine">
                  <div className={"dot " + (phase === "done" ? "ok" : "")} />
                  <p>
                    {assistantIntro}
                    <br />
                    <span>
                      {phase === "intro" && "Lo dejo profesional y aplicable, sin vueltas."}
                      {phase === "thinking" && "Estoy armando el plan general con actividades realistas."}
                      {phase === "summary" && "Primero el resumen, luego el minuto a minuto."}
                      {phase === "agenda" && "Ahora el desarrollo por tiempos, para que puedas seguirlo tal cual."}
                      {phase === "core" && "Sumo actividad central con apoyo y desafío según niveles."}
                      {phase === "exit" && "Cierro con un exit ticket corto para medir comprensión."}
                      {phase === "rubric" && "Y la rúbrica rápida para evaluar sin perder tiempo."}
                      {phase === "done" && "Listo. Si querés, lo adapto al contexto del grupo y tus recursos."}
                    </span>
                  </p>
                </div>
              )}

              {phase === "error" && error && <div className="alert">{error}</div>}

              {plan && (phase === "summary" || phase === "agenda" || phase === "core" || phase === "exit" || phase === "rubric" || phase === "done") && (
                <div className="section">
                  <h3>📘 Resumen</h3>
                  <div className="badge">{toText(plan.title) || "Plan de clase de Lengua"}</div>
                  <p style={{ marginTop: 10, lineHeight: 1.6, color: "var(--text)" }}>
                    {toText(plan.overview)}
                  </p>
                  <div className="badges">
                    <span className="badge">Grado: {grado}</span>
                    <span className="badge">Tema: {tema}</span>
                    <span className="badge">Duración: {duracion} min</span>
                    <span className="badge">Evaluación: {evaluacion}</span>
                  </div>
                </div>
              )}

              {plan && (phase === "agenda" || phase === "core" || phase === "exit" || phase === "rubric" || phase === "done") && (
                <div className="section">
                  <h3>🕒 Desarrollo por tiempos</h3>
                  <div className="timeline">
                    {(plan.agenda ?? []).map((a: any, i: number) => (
                      <div className="tItem" key={i}>
                        <div className="tTop">
                          <div className="tTitle">{toText(a.activity) || "Actividad"}</div>
                          <div className="time">{toText(a.minuteRange)}</div>
                        </div>
                        <div className="twocol">
                          <div className="box">
                            <b>Docente</b>
                            <div>{toText(a.teacherSays)}</div>
                          </div>
                          <div className="box">
                            <b>Estudiantes</b>
                            <div>{toText(a.studentDoes)}</div>
                          </div>
                        </div>
                        {toText(a.notes) && <p className="kv">Nota: {toText(a.notes)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {plan && (phase === "core" || phase === "exit" || phase === "rubric" || phase === "done") && (
                <div className="section">
                  <h3>🎯 Actividad principal</h3>
                  <div className="badges">
                    <span className="badge">Tipo: {toText(plan.coreActivity?.type)}</span>
                    <span className="badge">Agrupación: {toText(plan.coreActivity?.grouping)}</span>
                  </div>

                  <div className="twocol" style={{ marginTop: 10 }}>
                    <div className="box">
                      <b>Pasos</b>
                      <ul className="list">
                        {(plan.coreActivity?.steps ?? []).map((s: any, i: number) => (
                          <li key={i}>{toText(s)}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="box">
                      <b>Diferenciación</b>
                      <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 12 }}>Apoyo</div>
                      <ul className="list">
                        {(plan.coreActivity?.differentiation?.support ?? []).map((s: any, i: number) => (
                          <li key={i}>{toText(s)}</li>
                        ))}
                      </ul>
                      <div style={{ marginTop: 12, marginBottom: 10, color: "var(--muted)", fontSize: 12 }}>Desafío</div>
                      <ul className="list">
                        {(plan.coreActivity?.differentiation?.challenge ?? []).map((s: any, i: number) => (
                          <li key={i}>{toText(s)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {plan && (phase === "exit" || phase === "rubric" || phase === "done") && (
                <div className="section">
                  <h3>✅ Exit ticket</h3>
                  <div className="timeline">
                    {(plan.exitTicket ?? []).map((q: any, i: number) => (
                      <div className="tItem" key={i}>
                        <div className="tTop">
                          <div className="tTitle">{toText(q.q)}</div>
                          <div className="time">{toText(q.type)}</div>
                        </div>
                        <p className="kv">Clave: {toText(q.answerKey)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {plan && (phase === "rubric" || phase === "done") && (
                <div className="section">
                  <h3>📊 Rúbrica rápida</h3>
                  {(plan.assessmentRubric ?? []).map((r: any, i: number) => (
                    <div className="tItem" key={i}>
                      <div className="tTitle">{toText(r.criteria)}</div>
                      <div className="twocol" style={{ marginTop: 10 }}>
                        {(r.levels ?? []).map((lvl: any, idx: number) => (
                          <div className="box" key={idx}>
                            <b>{toText(lvl)}</b>
                            <div style={{ color: "var(--text)", lineHeight: 1.45 }}>
                              {toText(r.descriptors?.[idx])}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {toText(plan.homework) && (
                    <div className="section">
                      <h3>🏠 Tarea</h3>
                      <p style={{ marginTop: 0, lineHeight: 1.6 }}>{toText(plan.homework)}</p>
                    </div>
                  )}

                  <div className="section">
                    <h3>🧾 Checklist docente</h3>
                    <ul className="list">
                      {(plan.teacherChecklist ?? []).map((c: any, i: number) => (
                        <li key={i}>{toText(c)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="toggle" onClick={() => setDebugOpen((v) => !v)}>
                    <div>Ver JSON técnico (debug)</div>
                    <div style={{ color: "var(--muted)" }}>{debugOpen ? "Ocultar" : "Mostrar"}</div>
                  </div>
                  {debugOpen && <pre>{JSON.stringify(plan, null, 2)}</pre>}
                </div>
              )}

              {!plan && phase === "idle" && (
                <p style={{ marginTop: 0, color: "var(--muted)", lineHeight: 1.65 }}>
                  Completá los datos y tocá <b>Crear plan</b>. La salida se muestra en etapas para que sea fácil de leer y presentar.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="footer">MVP · EduCore Lengua · listo para deploy</div>
      </main>

      <div className="mobileActions">
        <button onClick={onGenerate} disabled={isBusy}>Crear plan</button>
        <button className="secondary" onClick={resetUI} type="button">Limpiar</button>
      </div>
    </>
  );
}
