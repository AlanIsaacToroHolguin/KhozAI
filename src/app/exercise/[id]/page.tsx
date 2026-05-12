"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Pause,
  Play,
  Repeat,
  Minus,
  Plus,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SEED_EXERCISES, type Exercise } from "@/lib/exercises";
import { Metronome, playExercisePreview, preloadGuitar } from "@/lib/audio";

export default function ExercisePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const exercise: Exercise = useMemo(
    () => SEED_EXERCISES.find((e) => e.id === params.id) || SEED_EXERCISES[0],
    [params.id]
  );

  const [bpm, setBpm] = useState(exercise.bpm);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const [showDone, setShowDone] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [muted, setMuted] = useState(false);

  const metronomeRef = useRef<Metronome | null>(null);
  const previewStopRef = useRef<(() => void) | null>(null);

  // init metronome instance + warmup guitar samples in background
  useEffect(() => {
    metronomeRef.current = new Metronome();
    metronomeRef.current.setOnBeat(setBeat);
    preloadGuitar();
    return () => {
      metronomeRef.current?.dispose();
      previewStopRef.current?.();
    };
  }, []);

  useEffect(() => {
    metronomeRef.current?.setBpm(bpm);
  }, [bpm]);

  function togglePlay() {
    if (playing) {
      metronomeRef.current?.stop();
      setPlaying(false);
      setBeat(0);
    } else {
      metronomeRef.current?.start();
      setPlaying(true);
    }
  }

  async function togglePreview() {
    if (previewPlaying) {
      previewStopRef.current?.();
      previewStopRef.current = null;
      setPreviewPlaying(false);
      return;
    }
    if (!exercise.preview || exercise.preview.length === 0) return;
    setPreviewLoading(true);
    try {
      const stop = await playExercisePreview(exercise.preview, bpm, () => {
        setPreviewPlaying(false);
        previewStopRef.current = null;
      });
      previewStopRef.current = stop;
      setPreviewPlaying(true);
    } finally {
      setPreviewLoading(false);
    }
  }

  function handleComplete() {
    metronomeRef.current?.stop();
    setShowDone(false);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <Logo />
          <button
            onClick={() => setMuted(!muted)}
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition"
            aria-label={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-[var(--color-accent)] mb-2 capitalize">
            {exercise.category} · Nivel {exercise.level}
          </div>
          <h1 className="text-display text-4xl md:text-5xl mb-3">
            {exercise.name}
          </h1>
          <p className="text-[var(--color-fg-muted)] max-w-2xl">
            {exercise.objective}
          </p>
        </div>

        {/* PREVIEW BUTTON */}
        {exercise.preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center justify-between gap-4 p-4 rounded-[14px] bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/30"
          >
            <div>
              <div className="text-sm font-medium">¿Quieres escucharlo primero?</div>
              <div className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                Te lo toco al BPM actual para que sepas cómo debe sonar.
              </div>
            </div>
            <Button
              size="md"
              variant="secondary"
              onClick={togglePreview}
              disabled={previewLoading}
              className="shrink-0"
            >
              {previewLoading ? (
                <>Cargando guitarra…</>
              ) : previewPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Detener
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Escuchar
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* TAB */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-6 md:p-8 mb-6 overflow-x-auto"
        >
          <pre className="font-mono text-sm md:text-base text-[var(--color-fg)] leading-relaxed whitespace-pre">
{exercise.tab}
          </pre>
        </motion.div>

        <div className="card-base p-6 mb-8 border-l-4 border-l-[var(--color-accent)]">
          <div className="text-xs uppercase tracking-wider text-[var(--color-accent)] mb-2">
            Por qué este ejercicio
          </div>
          <p className="text-[var(--color-fg)] leading-relaxed">{exercise.why}</p>
        </div>

        {/* PLAYER */}
        <div className="card-base p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <AnimatePresence>
                  {playing && (
                    <motion.div
                      key={beat}
                      initial={{ scale: 0.6, opacity: 0.8 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 60 / bpm }}
                      className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
                    />
                  )}
                </AnimatePresence>
                <div
                  className={`relative w-10 h-10 rounded-full transition-colors ${
                    playing
                      ? beat === 0
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-accent-dim)]"
                      : "bg-[var(--color-bg-elevated-2)]"
                  }`}
                />
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 rounded-full transition-colors ${
                      playing && beat === i
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-border-strong)]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBpm(Math.max(40, bpm - 5))}
                className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated-2)] hover:bg-[var(--color-border-strong)] flex items-center justify-center transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center min-w-[80px]">
                <div className="text-display text-3xl">{bpm}</div>
                <div className="text-xs text-[var(--color-fg-muted)] font-mono uppercase tracking-wider">
                  BPM
                </div>
              </div>
              <button
                onClick={() => setBpm(Math.min(240, bpm + 5))}
                className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated-2)] hover:bg-[var(--color-border-strong)] flex items-center justify-center transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setBpm(Math.round(exercise.bpm * 0.8))}
              >
                -20%
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setBpm(exercise.bpm)}
              >
                <Repeat className="w-4 h-4" /> Reset
              </Button>
              <Button
                size="lg"
                onClick={togglePlay}
                className="glow-accent min-w-[140px]"
              >
                {playing ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" /> Pausa
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Click
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              metronomeRef.current?.stop();
              setPlaying(false);
              setShowDone(true);
            }}
          >
            <Check className="w-4 h-4" /> Marcar como completado
          </Button>
        </div>
      </main>

      <AnimatePresence>
        {showDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowDone(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="card-base p-10 max-w-md w-full text-center"
            >
              <h2 className="text-display text-3xl mb-2">¿Cómo se sintió?</h2>
              <p className="text-[var(--color-fg-muted)] mb-8 text-sm">
                Esto entrena la IA para el ejercicio de mañana.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { v: "facil", emoji: "😅", label: "Fácil" },
                  { v: "justo", emoji: "👌", label: "Justo" },
                  { v: "dificil", emoji: "🔥", label: "Difícil" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={handleComplete}
                    className="p-4 rounded-[14px] bg-[var(--color-bg-elevated-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-dim)] transition group"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition">
                      {o.emoji}
                    </div>
                    <div className="text-sm font-medium">{o.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
