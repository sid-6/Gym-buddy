import { env, publicEnv } from "@/lib/env";

const SYSTEM = `You are Ask GymBuddy, a beginner fitness coach inside the GymBuddy app.
Use only facts in the user context. If a value is missing, say it is not logged yet.
Do not invent weights, PRs, calories, medical diagnoses, or a plan that is not in the context.
Do not paste raw logs, set lists, or pipe-separated history. Summarize in 2–5 short sentences.
Do not give medical advice. Be practical and explain why.
Help with: today's workout, what to do first, form focus, nutrition already logged, previous sessions, and how to improve the next session.`;

const MODEL = "openrouter/free";

function lastSessionName(workoutsLine: string) {
  const rest = workoutsLine.replace(/^Recent workouts:\s*/i, "").trim();
  if (!rest || rest.toLowerCase() === "none completed") return null;
  const first = rest.split("|")[0]?.trim() ?? "";
  const name = first.split(" on ")[0]?.trim();
  return name || null;
}

function localAnswer(question: string, context: string) {
  const lines = context.split("\n").filter(Boolean);
  const q = question.toLowerCase();
  const pick = (prefix: string) =>
    lines.find((line) => line.toLowerCase().startsWith(prefix.toLowerCase())) ?? "";

  const goal = pick("Goal:").replace(/^Goal:\s*/i, "");
  const experience = pick("Experience:").replace(/^Experience:\s*/i, "");
  const weight = pick("Latest weight:");
  const calories = pick("Calorie goal:");
  const lastWorkout = lastSessionName(pick("Recent workouts:"));

  if (q.includes("form") || q.includes("posture") || q.includes("technique")) {
    return [
      "Keep a tall spine, brace your core, and move with control instead of bouncing the weight.",
      "Open Form & posture or an exercise’s Form cues for the written cue for that move.",
      experience ? `You are logged as ${experience}, so use loads you can finish with clean reps.` : null,
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (q.includes("eat") || q.includes("diet") || q.includes("calorie") || q.includes("meal") || q.includes("protein")) {
    const mealsLogged = /today meals:\s*not logged/i.test(calories);
    return mealsLogged
      ? "Today’s meals are not logged yet. Add them in Nutrition so GymBuddy can use real calories and macros."
      : "Use the meals already logged in Nutrition and stay near your calorie goal. Add any missing meals so the numbers stay honest.";
  }

  if (q.includes("weight") || q.includes("progress") || q.includes("pr")) {
    const weightLogged = weight && !/not logged/i.test(weight);
    return [
      weightLogged ? "Your latest weigh-in is saved in Progress." : "No weigh-in is saved yet. Add today’s weight in Edit profile.",
      "Log weighted sets in a live workout to track PRs. Skipped sets are not counted as lifts.",
    ].join(" ");
  }

  return [
    goal && experience ? `You’re training for ${goal} as a ${experience}.` : goal ? `Your goal is ${goal}.` : "Your goal is not set yet.",
    lastWorkout
      ? `Your last saved session was ${lastWorkout}. Preview today’s workout from Home, then start and log what you actually did.`
      : "No completed workouts yet. Preview today’s session from Home, then start and log sets.",
  ].join(" ");
}

function errorKind(status: number, body: string) {
  const lower = body.toLowerCase();
  if (status === 401 || (lower.includes("invalid") && lower.includes("key")) || lower.includes("unauthorized")) {
    return "invalid_key" as const;
  }
  if (status === 429 || lower.includes("quota") || lower.includes("credits") || lower.includes("rate")) {
    return "quota" as const;
  }
  return "provider_error" as const;
}

export async function askCoach(question: string, context: string) {
  const key = env.openrouterApiKey;
  const fallback = localAnswer(question, context);
  if (!key) {
    return { text: fallback, notice: "not_configured" as const };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": publicEnv.appUrl,
        "X-Title": "GymBuddy",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Context:\n${context}\n\nQuestion:\n${question}` },
        ],
      }),
    });
    const raw = await response.text();
    if (!response.ok) {
      return { text: fallback, notice: errorKind(response.status, raw) };
    }
    const payload = JSON.parse(raw) as {
      choices?: Array<{ message?: { content?: string | Array<{ text?: string; content?: string }> } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    const text =
      typeof content === "string"
        ? content.trim()
        : Array.isArray(content)
          ? content
              .map((part) => (typeof part === "string" ? part : part.text ?? part.content ?? ""))
              .join("")
              .trim()
          : "";
    if (!text) return { text: fallback, notice: "empty" as const };
    return { text };
  } catch {
    return { text: fallback, notice: "provider_error" as const };
  }
}
