export type Difficulty = "facil" | "justo" | "dificil";

export type ExerciseCategory =
  | "tecnica"
  | "improvisacion"
  | "teoria"
  | "lectura"
  | "ritmo";

export type Genre =
  | "Rock"
  | "Blues"
  | "Metal"
  | "Jazz"
  | "Funk"
  | "Pop"
  | "Indie"
  | "Clásica"
  | "Flamenco"
  | "Bossa Nova"
  | "Country"
  | "Reggae";

export type PreviewNote =
  | {
      pitch: string | string[];
      duration: string;
      velocity?: number;
    }
  | { mute: true; duration: string };

export type Exercise = {
  id: string;
  name: string;
  objective: string;
  category: ExerciseCategory;
  level: 1 | 2 | 3 | 4 | 5;
  bpm: number;
  durationMin: number;
  why: string;
  tab: string;
  alphaTex?: string;
  preview?: PreviewNote[];
  /** Géneros para los que este ejercicio es especialmente relevante */
  genres: Genre[];
};

export const SEED_EXERCISES: Exercise[] = [
  // ===== Técnica universal =====
  {
    id: "ex-alt-picking-1",
    name: "Alternate picking cromático",
    objective: "Sincronizar mano derecha e izquierda",
    category: "tecnica",
    level: 2,
    bpm: 90,
    durationMin: 7,
    why: "El cromático aísla la coordinación pura, sin que la teoría te distraiga. Es el ejercicio #1 para limpiar tu picking.",
    tab: `e|---------------------------------------------|
B|---------------------------------------------|
G|---------------------------------------------|
D|---------------------------------------------|
A|---------------------------------------------|
E|--1--2--3--4--1--2--3--4--1--2--3--4--1--2--|`,
    genres: ["Rock", "Metal", "Jazz", "Blues", "Funk", "Pop", "Indie", "Country"],
    preview: [
      { pitch: "F2", duration: "8n" },
      { pitch: "F#2", duration: "8n" },
      { pitch: "G2", duration: "8n" },
      { pitch: "G#2", duration: "8n" },
      { pitch: "F2", duration: "8n" },
      { pitch: "F#2", duration: "8n" },
      { pitch: "G2", duration: "8n" },
      { pitch: "G#2", duration: "8n" },
    ],
  },
  {
    id: "ex-legato-1",
    name: "Legato hammer-ons",
    objective: "Fluidez y tono sin pick",
    category: "tecnica",
    level: 3,
    bpm: 110,
    durationMin: 6,
    why: "El legato es lo que separa a un guitarrista mecánico de uno que canta con el instrumento. Trabaja la fuerza independiente de cada dedo.",
    tab: `e|-5h7h8-7h8-5h7-5----|
B|---------------------|
G|---------------------|
D|---------------------|
A|---------------------|
E|---------------------|`,
    genres: ["Rock", "Metal", "Blues", "Jazz", "Indie"],
    preview: [
      { pitch: "A4", duration: "8n" },
      { pitch: "B4", duration: "8n" },
      { pitch: "C5", duration: "8n" },
      { pitch: "B4", duration: "8n" },
      { pitch: "C5", duration: "8n" },
      { pitch: "A4", duration: "8n" },
      { pitch: "B4", duration: "8n" },
      { pitch: "A4", duration: "4n" },
    ],
  },

  // ===== Rock / Blues =====
  {
    id: "ex-pentatonic-1",
    name: "Pentatónica con bends expresivos",
    objective: "Convertir escalas en frases musicales",
    category: "improvisacion",
    level: 2,
    bpm: 85,
    durationMin: 6,
    why: "Tocar notas no es música. Bends, vibrato y silencios son lo que hace que una nota llore. Esto es donde nace tu voz.",
    tab: `e|-------5-8-5-------|
B|---5-8-------8-5---|
G|-7-----------------|
D|-------------------|
A|-------------------|
E|-------------------|`,
    genres: ["Rock", "Blues", "Country", "Indie"],
    preview: [
      { pitch: "D4", duration: "8n" },
      { pitch: "E4", duration: "8n" },
      { pitch: "G4", duration: "8n" },
      { pitch: "A4", duration: "8n" },
      { pitch: "C5", duration: "4n" },
      { pitch: "A4", duration: "8n" },
      { pitch: "G4", duration: "8n" },
      { pitch: "E4", duration: "4n" },
    ],
  },
  {
    id: "ex-blues-12bar-1",
    name: "Turnaround de blues en A",
    objective: "Cerrar un blues como un profesional",
    category: "improvisacion",
    level: 3,
    bpm: 80,
    durationMin: 7,
    why: "El turnaround es la huella digital del bluesman. Aprende este y tu solo deja de sonar a Guitar Hero y empieza a sonar a Mississippi.",
    tab: `e|-------------------|
B|----5-4-3-2--------|
G|------5-4-3-2------|
D|--------5-4-3-2----|
A|-------------------|
E|-------------------|`,
    genres: ["Blues", "Rock"],
    preview: [
      { pitch: ["E4", "B3"], duration: "4n" },
      { pitch: ["D#4", "A#3"], duration: "4n" },
      { pitch: ["D4", "A3"], duration: "4n" },
      { pitch: ["C#4", "G#3"], duration: "4n" },
    ],
  },

  // ===== Metal =====
  {
    id: "ex-palm-mute-galloping",
    name: "Galloping con palm mute",
    objective: "Subdivisión de 16avos con muting controlado",
    category: "ritmo",
    level: 3,
    bpm: 120,
    durationMin: 6,
    why: "El gallop (Iron Maiden, Metallica) define el sonido del metal moderno. Coordinar palm mute + alternate picking es lo que separa hacks de músicos serios.",
    tab: `e|-------------------|
B|-------------------|
G|-------------------|
D|-------------------|
A|-------------------|
E|-0-0-0-3-0-0-0-3---|`,
    genres: ["Metal", "Rock"],
    preview: [
      { pitch: "E2", duration: "16n" },
      { pitch: "E2", duration: "16n" },
      { pitch: "E2", duration: "8n" },
      { pitch: "G2", duration: "4n" },
      { pitch: "E2", duration: "16n" },
      { pitch: "E2", duration: "16n" },
      { pitch: "E2", duration: "8n" },
      { pitch: "G2", duration: "4n" },
    ],
  },

  // ===== Jazz =====
  {
    id: "ex-jazz-ii-v-i",
    name: "ii-V-I en C mayor",
    objective: "Internalizar la progresión más usada del jazz",
    category: "improvisacion",
    level: 3,
    bpm: 90,
    durationMin: 8,
    why: "Si tocas jazz, conocer ii-V-I a ojos cerrados no es opcional. Aquí: Dm7 → G7 → Cmaj7. Toca los arpegios, escucha cómo cada acorde quiere ir al siguiente.",
    tab: `e|-------------------|
B|-6-5-3-------------|
G|-5-4-4-------------|
D|-7-3-5-------------|
A|-5-5-3-------------|
E|-------------------|`,
    genres: ["Jazz", "Bossa Nova"],
    preview: [
      // Dm7 arpeggio
      { pitch: "D3", duration: "8n" },
      { pitch: "F3", duration: "8n" },
      { pitch: "A3", duration: "8n" },
      { pitch: "C4", duration: "8n" },
      // G7
      { pitch: "G2", duration: "8n" },
      { pitch: "B3", duration: "8n" },
      { pitch: "D4", duration: "8n" },
      { pitch: "F4", duration: "8n" },
      // Cmaj7
      { pitch: "C3", duration: "4n" },
      { pitch: "E3", duration: "8n" },
      { pitch: "G3", duration: "8n" },
      { pitch: "B3", duration: "2n" },
    ],
  },
  {
    id: "ex-jazz-bebop-scale",
    name: "Escala bebop dominante",
    objective: "Sonar a jazz auténtico, no a pentatónica disfrazada",
    category: "improvisacion",
    level: 4,
    bpm: 100,
    durationMin: 7,
    why: "La bebop es la escala mayor con un cromatismo extra (7♭) — fue el secreto de Parker, Wes Montgomery y Pat Martino para que las notas del acorde caigan justo en los tiempos fuertes.",
    tab: `e|-------------------|
B|-------------------|
G|---5-6-7-9---------|
D|-7-7-9-9-10-12-----|
A|-------------------|
E|-------------------|`,
    genres: ["Jazz"],
    preview: [
      { pitch: "G3", duration: "8n" },
      { pitch: "A3", duration: "8n" },
      { pitch: "B3", duration: "8n" },
      { pitch: "C4", duration: "8n" },
      { pitch: "D4", duration: "8n" },
      { pitch: "E4", duration: "8n" },
      { pitch: "F4", duration: "8n" },
      { pitch: "F#4", duration: "8n" },
      { pitch: "G4", duration: "4n" },
    ],
  },
  {
    id: "ex-jazz-comping",
    name: "Comping con drop-2 voicings",
    objective: "Acompañar como guitarrista de jazz",
    category: "ritmo",
    level: 3,
    bpm: 110,
    durationMin: 8,
    why: "Drop-2 es el voicing que usaron Joe Pass, Wes y Grant Green. Compactos, móviles, suenan a club de jazz a la primera nota. Más útil que aprender 50 acordes.",
    tab: `e|-5-5-3-3-------|
B|-5-5-4-4-------|
G|-5-5-3-3-------|
D|-3-3-5-5-------|
A|---------------|
E|---------------|`,
    genres: ["Jazz", "Bossa Nova"],
    preview: [
      { pitch: ["G3", "C4", "E4", "A4"], duration: "4n" },
      { pitch: ["G3", "B3", "F4", "G4"], duration: "4n" },
      { pitch: ["G3", "C4", "E4", "A4"], duration: "4n" },
      { pitch: ["G3", "B3", "F4", "G4"], duration: "4n" },
    ],
  },
  {
    id: "ex-jazz-walking-bass",
    name: "Walking bass + acordes",
    objective: "Tocar bajo y comping a la vez (chord-melody)",
    category: "tecnica",
    level: 4,
    bpm: 85,
    durationMin: 9,
    why: "Hacer dos cosas a la vez en jazz es la diferencia entre tocar y SER toda la sección rítmica. Pulgar lleva el bajo en negras, dedos tocan acorde en los offbeats.",
    tab: `e|---------------|
B|---5---5---5---|
G|---5---4---5---|
D|---5---5---5---|
A|-5---3---5-----|
E|---------------|`,
    genres: ["Jazz", "Bossa Nova"],
    preview: [
      { pitch: "A2", duration: "4n" },
      { pitch: ["D4", "G4", "C5"], duration: "8n" },
      { pitch: "G2", duration: "4n" },
      { pitch: ["B3", "F4", "B4"], duration: "8n" },
      { pitch: "C3", duration: "4n" },
      { pitch: ["E4", "G4", "C5"], duration: "8n" },
      { pitch: "F2", duration: "4n" },
      { pitch: ["A3", "E4", "A4"], duration: "8n" },
    ],
  },

  // ===== Funk =====
  {
    id: "ex-rhythm-funk-1",
    name: "Rítmica funk en 16avos",
    objective: "Groove y muting con la mano derecha",
    category: "ritmo",
    level: 3,
    bpm: 95,
    durationMin: 5,
    why: "El 80% del feel en una banda lo decide el guitarrista rítmico. El muting controlado es lo que diferencia a un principiante de un pro.",
    tab: `e|-x-x-9-x-x-9-x-x---|
B|-x-x-9-x-x-9-x-x---|
G|-x-x-9-x-x-9-x-x---|
D|-------------------|
A|-------------------|
E|-------------------|`,
    genres: ["Funk", "Pop", "Reggae"],
    preview: [
      { mute: true, duration: "16n" },
      { mute: true, duration: "16n" },
      { pitch: ["E4", "G#4", "C#5"], duration: "16n", velocity: 0.9 },
      { mute: true, duration: "16n" },
      { mute: true, duration: "16n" },
      { pitch: ["E4", "G#4", "C#5"], duration: "16n", velocity: 0.9 },
      { mute: true, duration: "16n" },
      { mute: true, duration: "16n" },
      { mute: true, duration: "16n" },
      { mute: true, duration: "16n" },
      { pitch: ["E4", "G#4", "C#5"], duration: "16n", velocity: 0.9 },
      { mute: true, duration: "16n" },
      { mute: true, duration: "16n" },
      { pitch: ["E4", "G#4", "C#5"], duration: "16n", velocity: 0.9 },
      { mute: true, duration: "16n" },
      { mute: true, duration: "16n" },
    ],
  },

  // ===== Modal (rock/jazz/funk shared) =====
  {
    id: "ex-dorian-1",
    name: "Improvisación en D dórico",
    objective: "Sentir el sonido del modo dórico",
    category: "improvisacion",
    level: 3,
    bpm: 100,
    durationMin: 8,
    why: "El dórico es la base del rock, jazz y funk moderno. Si lo internalizas, desbloqueas el 60% del lenguaje improvisatorio actual.",
    tab: `e|---------------------|
B|---------------------|
G|---7--9--10--9--7---|
D|-7-------------------|
A|---------------------|
E|---------------------|`,
    genres: ["Rock", "Jazz", "Funk", "Indie"],
    preview: [
      { pitch: "A3", duration: "8n" },
      { pitch: "C4", duration: "8n" },
      { pitch: "D4", duration: "8n" },
      { pitch: "E4", duration: "8n" },
      { pitch: "D4", duration: "8n" },
      { pitch: "C4", duration: "8n" },
      { pitch: "A3", duration: "4n" },
    ],
  },

  // ===== Bossa / Clásica =====
  {
    id: "ex-bossa-pattern",
    name: "Patrón bossa nova",
    objective: "Independencia pulgar/dedos con síncopa brasileña",
    category: "ritmo",
    level: 3,
    bpm: 90,
    durationMin: 7,
    why: "La bossa nova vive en la síncopa. Pulgar marca tumbao, dedos puntean acorde fuera del tiempo. Cuando lo internalizas, todo lo demás (jazz fusion, MPB) se vuelve fácil.",
    tab: `e|---5---5---5---5---|
B|---5---5---5---5---|
G|---6---6---6---6---|
D|-7---7---7---7-----|
A|-------------------|
E|-------------------|`,
    genres: ["Bossa Nova", "Jazz"],
    preview: [
      { pitch: "D3", duration: "4n" },
      { pitch: ["F#4", "B4", "E5"], duration: "8n" },
      { pitch: "D3", duration: "8n" },
      { pitch: ["F#4", "B4", "E5"], duration: "8n" },
      { pitch: "D3", duration: "4n" },
      { pitch: ["F#4", "B4", "E5"], duration: "8n" },
      { pitch: "D3", duration: "8n" },
      { pitch: ["F#4", "B4", "E5"], duration: "8n" },
    ],
  },
];

export function getExerciseById(id: string): Exercise | undefined {
  return SEED_EXERCISES.find((e) => e.id === id);
}
