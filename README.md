# EduCore — Planificador de clases (Lengua, Primaria) — Groq MVP

MVP simple y estable (sin Tailwind) para generar planes de clase de **Lengua (primaria)** usando **Groq API**.

## Requisitos
- Node.js 18+ (recomendado 20)
- Una API key de Groq

## Setup
```bash
npm install
cp .env.example .env.local
# editá .env.local y pegá tu GROQ_API_KEY
npm run dev
```

Abrí:
- http://localhost:3000/lesson-planner

## Notas de UX
- Respuesta con “voz de asistente” (no muestra “Generando…”).
- Revelado progresivo por secciones (pseudo-streaming).
- Anti-bug de regeneración: AbortController + runId.
