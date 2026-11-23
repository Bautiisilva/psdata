// psData · coach-ia
// Recibe un punto marcado en la comparación de dos vueltas y la pregunta del coach,
// y le pide a Claude que explique qué hizo distinto (o mal) cada piloto ahí.
// La clave de Anthropic vive en el secreto ANTHROPIC_API_KEY de Supabase, nunca en la página.
import Anthropic from "npm:@anthropic-ai/sdk@1.12.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const out = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const SYSTEM = `Sos el coach de datos de psData, una escuela de karting para chicos.
Te llega la telemetría de dos vueltas (piloto A y piloto B) alrededor de un punto que marcó el coach, y su pregunta.
Datos que recibís:
- m: metros desde el inicio de la vuelta. vA / vB: velocidad en km/h.
- dt: diferencia acumulada de tiempo en segundos (positivo = A va adelante de B; si crece, A está ganando tiempo ahí).
- giro: cuánto dobla la pista en ese tramo, en grados (+ derecha, − izquierda); cerca de 0 es recta.
- resumen: velocidades mínimas y máximas, dónde empieza a frenar cada uno, tiempo ganado o perdido en la ventana, y los tiempos de sector y de vuelta.
Cómo responder:
- Contestá la pregunta concreta, sobre ese punto. Decí qué hizo cada piloto ahí con números (frenó X m antes o después, pasó la curva a tantos km/h, salió más lento, cuánto tiempo perdió).
- Si la pregunta da por hecho que alguien hizo algo mal y los datos dicen lo contrario, decilo con amabilidad.
- Terminá con un consejo simple y concreto para la próxima vuelta, en palabras que entienda un chico de 8 a 14 años.
- Sé breve: 4 a 7 oraciones cortas, sin títulos ni tablas. Podés usar una lista corta si ayuda.
- Solo tenés velocidad, posición y tiempo: no inventes datos de acelerador, freno, volante ni RPM. Si algo no se puede saber con estos datos, decilo.
- Llamá a los pilotos por su nombre.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return out({ error: "Método no permitido" }, 405);

  // Solo usuarios con sesión iniciada en psData (admin o piloto)
  const auth = req.headers.get("authorization") || "";
  const apikey = req.headers.get("apikey") || Deno.env.get("SUPABASE_ANON_KEY") || "";
  if (!auth.startsWith("Bearer ")) return out({ error: "Iniciá sesión para usar la IA." }, 401);
  const u = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, { headers: { apikey, Authorization: auth } });
  if (!u.ok) return out({ error: "Iniciá sesión para usar la IA." }, 401);

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return out({ error: "Falta cargar el secreto ANTHROPIC_API_KEY en Supabase." }, 500);

  let body: { pregunta?: string; contexto?: unknown; idioma?: string };
  try { body = await req.json(); } catch { return out({ error: "Pedido inválido" }, 400); }
  const pregunta = String(body.pregunta || "").trim().slice(0, 600);
  const contexto = JSON.stringify(body.contexto ?? {});
  if (!pregunta) return out({ error: "Escribí una pregunta." }, 400);
  if (contexto.length > 20000) return out({ error: "Demasiados datos" }, 413);
  const idioma = body.idioma === "en"
    ? "Answer in English."
    : "Respondé en español rioplatense (voseo).";

  const client = new Anthropic({ apiKey: key });
  try {
    const r = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 8000,
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Telemetría (JSON):\n${contexto}\n\nPregunta del coach: ${pregunta}\n\n${idioma}`,
      }],
    });
    if (r.stop_reason === "refusal") return out({ error: "La IA no pudo responder esa pregunta. Probá reformularla." }, 422);
    const texto = r.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
    if (!texto) return out({ error: "La IA no devolvió respuesta. Probá de nuevo." }, 502);
    return out({ respuesta: texto });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return out({ error: "La clave de Anthropic no es válida (revisá el secreto ANTHROPIC_API_KEY)." }, 500);
    if (e instanceof Anthropic.RateLimitError) return out({ error: "Muchas preguntas seguidas. Esperá un minuto y probá de nuevo." }, 429);
    if (e instanceof Anthropic.APIError) return out({ error: `Error de la IA (${e.status ?? "?"}). Probá de nuevo.` }, 502);
    return out({ error: "No se pudo contactar a la IA. Probá de nuevo." }, 502);
  }
});
