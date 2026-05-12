import { SEED_EXERCISES, type Exercise } from "./exercises";

export type UserProfile = {
  level: "principiante" | "intermedio" | "avanzado";
  yearsPlaying: number;
  genres: string[];
  focus: "tecnica" | "improvisacion" | "teoria" | "lectura" | "ritmo";
  timePerDay: number;
};

export type Routine = {
  id: string;
  date: string;
  totalMinutes: number;
  exercises: Exercise[];
  intro: string;
};

const FOCUS_LABELS: Record<UserProfile["focus"], string> = {
  tecnica: "técnica",
  improvisacion: "improvisación",
  teoria: "teoría aplicada",
  lectura: "lectura",
  ritmo: "ritmo y groove",
};

/**
 * Abstraction: swap this for a real Claude/OpenAI call later.
 * Curates a routine from the seed library scored by profile fit.
 */
export async function generateRoutine(profile: UserProfile): Promise<Routine> {
  const levelMap = { principiante: 1.5, intermedio: 3, avanzado: 4.5 };
  const targetLevel = levelMap[profile.level] ?? 3;
  const userGenres = new Set(profile.genres ?? []);

  const scored = SEED_EXERCISES.map((ex) => {
    let score = 0;
    // Level proximity
    score += 5 - Math.abs(ex.level - targetLevel);
    // Focus alignment
    if (ex.category === profile.focus) score += 5;
    // Genre match — heavy weight: +6 per matching genre
    const matches = ex.genres.filter((g) => userGenres.has(g)).length;
    score += matches * 6;
    // Slight randomness so it's not identical every day
    score += Math.random() * 1.2;
    return { ex, score, matches };
  }).sort((a, b) => b.score - a.score);

  // Pick exercises that fit within the time budget
  const picked: Exercise[] = [];
  let used = 0;
  for (const { ex } of scored) {
    if (used + ex.durationMin <= profile.timePerDay + 2) {
      picked.push(ex);
      used += ex.durationMin;
    }
    if (picked.length >= 4) break;
  }
  if (picked.length === 0) picked.push(scored[0].ex);

  // Genre-aware personalized intro
  const intro = buildIntro(profile, picked);

  return {
    id: `routine-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    totalMinutes: picked.reduce((s, e) => s + e.durationMin, 0),
    exercises: picked,
    intro,
  };
}

function buildIntro(profile: UserProfile, exercises: Exercise[]): string {
  const focusText = FOCUS_LABELS[profile.focus] ?? "práctica";
  const genres = profile.genres ?? [];
  const matchedGenres = new Set<string>();
  exercises.forEach((e) =>
    e.genres.forEach((g) => {
      if (genres.includes(g)) matchedGenres.add(g);
    })
  );
  const primary = genres[0];

  if (matchedGenres.size > 0 && primary) {
    const list = Array.from(matchedGenres).slice(0, 2).join(" y ");
    return `Rutina enfocada en ${focusText} con sabor a ${list}. Vas a notar el lenguaje del ${primary.toLowerCase()} desde el primer ejercicio — toca lento al principio.`;
  }
  if (primary) {
    return `Hoy trabajamos ${focusText} con bases que te van a servir para ${primary.toLowerCase()}. Respeta el tempo, después la velocidad llega sola.`;
  }
  return `Hoy trabajamos ${focusText}. Toca lento primero, después rápido. Velocidad es precisión apurada.`;
}
