type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

export async function groqChatJSON(messages: GroqMessage[], signal?: AbortSignal) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Falta GROQ_API_KEY en .env.local");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.35,
    }),
    signal,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Groq error ${res.status}: ${txt.slice(0, 400)}`);
  }

  const data: any = await res.json();
  const raw = data?.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("Respuesta vacía del modelo");

  // Intento directo
  try {
    return JSON.parse(raw);
  } catch {
    // Intento extraer primer bloque JSON
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const slice = raw.slice(start, end + 1);
      try {
        return JSON.parse(slice);
      } catch {}
    }
    throw new Error("El modelo no devolvió JSON válido. Primeros 280 chars: " + raw.slice(0, 280));
  }
}
