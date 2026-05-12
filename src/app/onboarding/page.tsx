"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  level: string;
  yearsPlaying: number;
  genres: string[];
  focus: string;
  timePerDay: number;
};

type Step = {
  title: string;
  subtitle: string;
  type: "options" | "multi" | "slider";
  key: keyof Profile;
  options?: { value: string | number; label: string; desc: string }[] | string[];
  min?: number;
  max?: number;
  suffix?: string;
};

const initial: Profile = {
  level: "",
  yearsPlaying: 0,
  genres: [],
  focus: "",
  timePerDay: 0,
};

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [profile, setProfile] = useState<Profile>(initial);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Preload existing profile so "Actualizar cuestionario" prefills answers
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data) return;
      setProfile({
        level: data.level ?? "",
        yearsPlaying: data.years_playing ?? 0,
        genres: data.genres ?? [],
        focus: data.focus ?? "",
        timePerDay: data.time_per_day ?? 0,
      });
    })();
  }, []);

  const steps: Step[] = [
    {
      title: "¿Cuál es tu nivel ahora mismo?",
      subtitle: "Sé honesto. Esto define todo lo que viene.",
      type: "options" as const,
      key: "level" as const,
      options: [
        { value: "principiante", label: "Principiante", desc: "Menos de 1 año tocando" },
        { value: "intermedio", label: "Intermedio", desc: "1–4 años, sé acordes y escalas básicas" },
        { value: "avanzado", label: "Avanzado", desc: "+4 años, improvisando con teoría" },
      ],
    },
    {
      title: "¿Hace cuánto tocas guitarra?",
      subtitle: "Mueve el slider hasta tu mejor estimación.",
      type: "slider" as const,
      key: "yearsPlaying" as const,
      min: 0,
      max: 20,
      suffix: " años",
    },
    {
      title: "¿Qué géneros te mueven?",
      subtitle: "Elige los que más tocas. La IA enfocará el material.",
      type: "multi" as const,
      key: "genres" as const,
      options: [
        "Rock", "Blues", "Metal", "Jazz", "Funk", "Pop",
        "Indie", "Clásica", "Flamenco", "Bossa Nova", "Country", "Reggae",
      ],
    },
    {
      title: "¿Qué quieres mejorar primero?",
      subtitle: "Solo una. Vas a poder cambiar después.",
      type: "options" as const,
      key: "focus" as const,
      options: [
        { value: "tecnica", label: "Técnica", desc: "Picking, legato, velocidad, limpieza" },
        { value: "improvisacion", label: "Improvisación", desc: "Modos, frases, soleo musical" },
        { value: "teoria", label: "Teoría aplicada", desc: "Acordes, intervalos, armonía funcional" },
        { value: "ritmo", label: "Ritmo", desc: "Groove, muting, subdivisión" },
        { value: "lectura", label: "Lectura", desc: "Partitura, tablatura a primera vista" },
      ],
    },
    {
      title: "¿Cuánto tiempo puedes practicar al día?",
      subtitle: "Realista. Es mejor 20 min diarios que 2 horas los domingos.",
      type: "options" as const,
      key: "timePerDay" as const,
      options: [
        { value: 15, label: "15 minutos", desc: "Sesión corta, alto enfoque" },
        { value: 25, label: "25 minutos", desc: "El sweet spot recomendado" },
        { value: 45, label: "45 minutos", desc: "Sesión completa" },
        { value: 60, label: "60+ minutos", desc: "Modo monje" },
      ],
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  function canAdvance() {
    const val = profile[current.key];
    if (Array.isArray(val)) return val.length > 0;
    return val !== "" && val !== 0;
  }

  async function next() {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    setGenerating(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      }

      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          level: profile.level,
          years_playing: profile.yearsPlaying,
          genres: profile.genres,
          focus: profile.focus,
          time_per_day: profile.timePerDay,
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;

      // Cache locally for instant dashboard load
      if (typeof window !== "undefined") {
        localStorage.setItem("khozai-profile", JSON.stringify(profile));
      }

      await new Promise((r) => setTimeout(r, 1800));
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setGenerating(false);
      const msg =
        err instanceof Error
          ? err.message
          : "No pudimos guardar tu perfil. ¿Ya corriste el SQL en Supabase?";
      setSaveError(msg);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP BAR */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-[var(--color-border)]">
        <Logo />
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i <= step ? "w-8 bg-[var(--color-accent)]" : "w-4 bg-[var(--color-border-strong)]"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-[var(--color-fg-muted)] font-mono">
          {step + 1} / {steps.length}
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {generating ? (
          <GeneratingState />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-2xl"
            >
              <h1 className="text-display text-4xl md:text-5xl mb-3 leading-tight">
                {current.title}
              </h1>
              <p className="text-[var(--color-fg-muted)] mb-10">
                {current.subtitle}
              </p>

              {current.type === "options" && (
                <div className="space-y-2">
                  {(current.options as { value: string | number; label: string; desc: string }[]).map((opt) => {
                    const selected = (profile[current.key] as string | number) === opt.value;
                    return (
                      <button
                        key={String(opt.value)}
                        onClick={() =>
                          setProfile({ ...profile, [current.key]: opt.value })
                        }
                        className={`w-full text-left p-4 rounded-[12px] border transition-all duration-200 ${
                          selected
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)]"
                            : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]"
                        }`}
                      >
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-sm text-[var(--color-fg-muted)] mt-0.5">
                          {opt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {current.type === "multi" && (
                <div className="flex flex-wrap gap-2">
                  {(current.options as string[]).map((opt) => {
                    const selected = profile.genres.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          const g = selected
                            ? profile.genres.filter((x) => x !== opt)
                            : [...profile.genres, opt];
                          setProfile({ ...profile, genres: g });
                        }}
                        className={`px-4 py-2.5 rounded-full border text-sm transition-all duration-200 ${
                          selected
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
                            : "border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-elevated-2)]"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {current.type === "slider" && (
                <div>
                  <div className="text-display text-7xl text-[var(--color-accent)] mb-6">
                    {profile.yearsPlaying}
                    <span className="text-2xl text-[var(--color-fg-muted)] ml-2">
                      {profile.yearsPlaying === 1 ? "año" : "años"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={current.min}
                    max={current.max}
                    value={profile.yearsPlaying}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        yearsPlaying: Number(e.target.value),
                      })
                    }
                    className="w-full accent-[var(--color-accent)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--color-fg-muted)] mt-2 font-mono">
                    <span>0</span>
                    <span>{current.max}+</span>
                  </div>
                </div>
              )}

              {saveError && (
                <div className="flex items-start gap-2 p-3 mt-6 rounded-[10px] bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-sm text-[var(--color-error)]">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* NAV */}
              <div className="flex items-center justify-between mt-12">
                <Button
                  variant="ghost"
                  onClick={() => step > 0 && setStep(step - 1)}
                  disabled={step === 0}
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </Button>
                <Button
                  size="lg"
                  onClick={next}
                  disabled={!canAdvance()}
                  className={canAdvance() ? "glow-accent" : ""}
                >
                  {isLast ? "Generar mi rutina" : "Siguiente"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

function GeneratingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-[var(--color-accent)] opacity-20 pulse-ring" />
        <div className="absolute inset-2 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-[var(--color-bg)]" />
        </div>
      </div>
      <h2 className="text-display text-4xl mb-3">Generando tu plan…</h2>
      <p className="text-[var(--color-fg-muted)]">
        Analizando tu nivel, géneros y objetivos.
      </p>
      <div className="mt-8 space-y-1 text-sm font-mono text-[var(--color-fg-subtle)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          → Seleccionando ejercicios de tu nivel
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          → Ajustando BPM y duración
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          → Optimizando progresión
        </motion.div>
      </div>
    </motion.div>
  );
}
