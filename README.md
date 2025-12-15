📘 EduCore – Planificador de clases con IA (Lengua · Primaria)

EduCore es un MVP de software educativo impulsado por Inteligencia Artificial que asiste a docentes de nivel primario en la creación de planes de clase de Lengua, de forma clara, estructurada y pedagógicamente coherente.

El sistema utiliza IA generativa (Groq API) para transformar consignas simples en planes de clase completos, adaptados al grado, duración y contexto del aula.

✨ Características principales

🤖 IA aplicada a educación real (no demo genérica)

📚 Especializado en Lengua – Nivel Primario

🧠 Generación pedagógica estructurada:

Plan general

Agenda por tramos de tiempo

Actividad central

Apoyo y desafío

Exit ticket

Rúbrica de evaluación

💬 Respuesta progresiva estilo asistente humano

📱 Diseño responsive (desktop y mobile)

⚡ Performance optimizada con Groq

🔐 Sin login (pensado para acceso libre en MVP)

🧩 Tecnologías utilizadas

Next.js 14 (App Router)

TypeScript

Tailwind CSS

Groq API (LLM inference)

Server Actions / API Routes

Vercel-ready

🏗️ Arquitectura (simplificada)
src/
 ├─ app/
 │   ├─ page.tsx                → Landing
 │   ├─ lesson-planner/page.tsx → UI principal
 │   ├─ api/ai/lesson-plan/     → Endpoint IA
 │   └─ globals.css
 ├─ components/
 │   └─ Logo.tsx
 ├─ lib/
 │   └─ groq.ts                 → Cliente Groq


La IA devuelve JSON estructurado, que luego se renderiza de forma progresiva y elegante en la UI.

🚀 Instalación local
git clone https://github.com/GabrielTorres28/educore-lengua.git
cd educore-lengua
npm install


Crear archivo .env.local:

GROQ_API_KEY=tu_api_key_aqui


Ejecutar:

npm run dev


Abrir en:
👉 http://localhost:3000/lesson-planner

🌍 Deploy

El proyecto está preparado para deploy directo en Vercel.

Pasos:

Importar repositorio

Agregar variable de entorno GROQ_API_KEY

Deploy

🎯 Objetivo del proyecto

EduCore nace como primer módulo de un sistema educativo “docente-first”, donde la IA:

Reduce carga administrativa

Mejora planificación pedagógica

Acompaña al docente, no lo reemplaza

Este MVP demuestra IA aplicada con criterio, no solo generación de texto.

🛣️ Roadmap (próximos pasos)

 Más materias (Matemática, Cs. Sociales, Cs. Naturales)

 Ajuste por currícula argentina

 Exportar a PDF / Word

 Modo planificación semanal

 Perfil docente

 Analytics pedagógicos
