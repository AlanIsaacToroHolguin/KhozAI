"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Flame,
  Play,
  TrendingUp,
  Calendar,
  Music,
  Target,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { SEED_EXERCISES, type Exercise } from "@/lib/exercises";
import { generateRoutine, type Routine, type UserProfile } from "@/lib/routine-generator";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_ROUTINE: Routine = {
  id: "demo",
  date: new Date().toISOString().split("T")[0],
  totalMinutes: 26,
  exercises: SEED_EXERCISES.slice(0, 4),
  intro:
    "Hoy trabajamos técnica e improvisación. No te saltes el calentamiento, toca lento primero.",
};

export default function Dashboard() {
  const router = useRouter();
  const [routine, setRoutine] = useState<Routine>(FALLBACK_ROUTINE);
  const [streak] = useState(12);
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  })();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const meta = (user.user_metadata ?? {}) as { full_name?: string };
      const full = (meta.full_name || "").trim();
      if (!cancelled && full) setFirstName(full.split(" ")[0]);

      // Load profile from Supabase
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !profile) {
        // No profile yet → onboard them
        router.replace("/onboarding");
        return;
      }

      const userProfile: UserProfile = {
        level: profile.level,
        yearsPlaying: profile.years_playing,
        genres: profile.genres ?? [],
        focus: profile.focus,
        timePerDay: profile.time_per_day,
      };
      const generated = await generateRoutine(userProfile);
      if (!cancelled) {
        setRoutine(generated);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-accent)] animate-spin" />
          <div className="text-sm text-[var(--color-fg-muted)]">
            Preparando tu rutina…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-40 border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-1 text-sm">
            <button className="px-3 py-1.5 rounded-md text-[var(--color-fg)] bg-[var(--color-bg-elevated)]">
              Hoy
            </button>
            <button className="px-3 py-1.5 rounded-md text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition">
              Progreso
            </button>
            <button className="px-3 py-1.5 rounded-md text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition">
              Biblioteca
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-coral-dim)] text-[var(--color-coral)] text-sm font-medium">
              <Flame className="w-4 h-4" /> {streak}
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* GREETING */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-sm text-[var(--color-fg-muted)] mb-2">
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>
          <h1 className="text-display text-5xl md:text-6xl">
            {firstName ? (
              <>
                {greeting},{" "}
                <span className="text-[var(--color-accent)]">{firstName}</span>.
              </>
            ) : (
              <>
                Tu rutina de{" "}
                <span className="text-[var(--color-accent)]">hoy</span>.
              </>
            )}
          </h1>
          <p className="text-[var(--color-fg-muted)] mt-3 max-w-xl">
            {routine.intro}
          </p>
        </motion.div>

        {/* HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-base p-8 md:p-10 mb-6 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-[var(--color-accent)] opacity-10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-[var(--color-accent)] mb-3">
              Práctica de hoy
            </div>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <div className="text-display text-5xl md:text-6xl leading-none">
                {routine.totalMinutes} min ·{" "}
                <span className="text-[var(--color-fg-muted)]">
                  {routine.exercises.length} ejercicios
                </span>
              </div>
              <Link href={`/exercise/${routine.exercises[0]?.id}`}>
                <Button size="xl" className="glow-accent">
                  <Play className="w-5 h-5 fill-current" /> Empezar
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <Stat
                icon={<Clock className="w-4 h-4" />}
                label="Esta semana"
                value="2h 45m"
              />
              <Stat
                icon={<TrendingUp className="w-4 h-4" />}
                label="BPM promedio"
                value="+12"
              />
              <Stat
                icon={<Target className="w-4 h-4" />}
                label="Adherencia"
                value="92%"
              />
            </div>
          </div>
        </motion.div>

        {/* EXERCISE LIST */}
        <div className="space-y-2 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tus ejercicios</h2>
            <button className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition">
              Regenerar rutina
            </button>
          </div>
          {routine.exercises.map((ex, i) => (
            <ExerciseRow key={ex.id} exercise={ex} index={i} />
          ))}
        </div>

        {/* WEEKLY GRID */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-base p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
            <h3 className="font-semibold">Tu semana</h3>
          </div>
          <div className="flex gap-2">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => {
              const done = i < 4;
              const today = i === 4;
              return (
                <div key={i} className="flex-1 text-center">
                  <div className="text-xs text-[var(--color-fg-muted)] mb-2">
                    {d}
                  </div>
                  <div
                    className={`aspect-square rounded-[10px] flex items-center justify-center text-sm ${
                      done
                        ? "bg-[var(--color-accent)] text-[var(--color-bg)] font-medium"
                        : today
                        ? "border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-medium"
                        : "bg-[var(--color-bg-elevated-2)] text-[var(--color-fg-subtle)]"
                    }`}
                  >
                    {done ? "✓" : i + 12}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-[12px] bg-[var(--color-bg-elevated-2)] border border-[var(--color-border)]">
      <div className="flex items-center gap-2 text-[var(--color-fg-muted)] text-xs mb-2">
        {icon} {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function ExerciseRow({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.05 }}
    >
      <Link
        href={`/exercise/${exercise.id}`}
        className="card-base p-4 flex items-center gap-4 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elevated-2)] transition group"
      >
        <div className="w-10 h-10 rounded-[10px] bg-[var(--color-bg-elevated-2)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
          <Music className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium">{exercise.name}</div>
          <div className="text-xs text-[var(--color-fg-muted)] mt-0.5 capitalize">
            {exercise.category} · {exercise.durationMin} min ·{" "}
            <span className="font-mono">{exercise.bpm} BPM</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-0.5">
            {[1, 2, 3, 4, 5].map((l) => (
              <div
                key={l}
                className={`w-1 h-4 rounded-full ${
                  l <= exercise.level
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-border-strong)]"
                }`}
              />
            ))}
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-fg-subtle)] group-hover:text-[var(--color-fg)] group-hover:translate-x-0.5 transition" />
        </div>
      </Link>
    </motion.div>
  );
}
