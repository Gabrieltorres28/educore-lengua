import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EduCore — Lengua (Primaria)",
  description: "Planificador de clases de Lengua para primaria con IA (Groq). Agenda, actividad central, evaluación y rúbrica.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "EduCore — Planificador de Lengua (Primaria)",
    description: "Generá planes de clase claros y listos para el aula, en español.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
