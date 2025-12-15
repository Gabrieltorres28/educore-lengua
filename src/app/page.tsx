import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <>
      <div className="topbar">
        <div className="topbarInner">
          <Logo />
          <span className="pill">MVP · IA · Groq</span>
        </div>
      </div>

      <main className="container">
        <div className="hero">
          <div>
            <h1>Planificador docente-first para Lengua (Primaria)</h1>
            <p>
              Generá planes de clase <b>claros</b>, con <b>agenda por tiempos</b>, actividad central,
              exit ticket y rúbrica rápida. Pensado para aula real: simple, directo y en español.
            </p>
          </div>
        </div>

        <div className="grid">
          <section className="card">
            <div className="cardHead">
              <div>
                <h2>Qué hace</h2>
                <span>Enfocado en Lengua (primaria). Sin humo: te devuelve un plan listo para aplicar.</span>
              </div>
            </div>
            <div className="cardBody">
              <ul className="list" style={{ marginTop: 0 }}>
                <li>Resumen didáctico + objetivos operativos.</li>
                <li>Desarrollo minuto a minuto (sin “choclo”).</li>
                <li>Diferenciación: apoyo y desafío por nivel.</li>
                <li>Exit ticket y rúbrica en 1 minuto.</li>
              </ul>

              <div className="actions" style={{ marginTop: 14 }}>
                <Link href="/lesson-planner">
                  <button>Crear un plan ahora</button>
                </Link>
                <span className="pill">Sin base de datos</span>
              </div>

              <p className="smallNote">
                Temas sugeridos: análisis de oraciones, verbos, sustantivos/adjetivos, puntuación,
                comprensión lectora, coherencia y cohesión.
              </p>
            </div>
          </section>

          <section className="card">
            <div className="cardHead">
              <div>
                <h2>Ideal para tu portfolio</h2>
                <span>Deploy rápido + demo clara para LinkedIn (sin exponer tu API key).</span>
              </div>
            </div>
            <div className="cardBody">
              <p style={{ marginTop: 0, color: "var(--muted)", lineHeight: 1.6 }}>
                Este MVP está pensado para mostrarse: UI prolija, mobile-first, feedback estilo asistente,
                y salida estructurada. Próximo paso: exportar a PDF/Word y guardar historial.
              </p>
              <div className="actions" style={{ marginTop: 14 }}>
                <Link href="/lesson-planner">
                  <button className="secondary">Ver el planificador</button>
                </Link>
              </div>
            </div>
          </section>
        </div>

        <div className="footer">© {new Date().getFullYear()} EduCore · Lengua (Primaria) · Demo MVP</div>
      </main>
    </>
  );
}
