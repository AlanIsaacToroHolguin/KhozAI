"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Music2,
  Sparkles,
  Brain,
  Activity,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { WaveBg } from "@/components/wave-bg";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* NAV */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-10 text-sm text-[var(--color-fg-muted)]">
            <a href="#producto" className="hover:text-[var(--color-fg)] transition">
              Producto
            </a>
            <a href="#enfoque" className="hover:text-[var(--color-fg)] transition">
              Enfoque
            </a>
            <a href="#precio" className="hover:text-[var(--color-fg)] transition">
              Precio
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button size="sm" variant="ghost">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="btn-pill">
                Empezar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-16 pb-32">
        <WaveBg />
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          {/* Central icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block mb-10"
          >
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-violet)] to-[var(--color-pink)] opacity-30 blur-2xl" />
              <div className="relative w-full h-full rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/40 backdrop-blur-sm flex items-center justify-center glow-icon">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  fill="none"
                  className="text-[var(--color-accent)]"
                >
                  <defs>
                    <linearGradient id="hero-icon" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7dd3fc" />
                      <stop offset="100%" stopColor="#f0abfc" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M14 42 L28 12 L42 42 M20 30 H36"
                    stroke="url(#hero-icon)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] mb-8"
          >
            KhozAI · Práctica de guitarra con IA
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[1.05] tracking-tight max-w-4xl mx-auto"
          >
            Construimos rutinas que hacen
            <br />
            que tu guitarra suene{" "}
            <span className="gradient-text">release-ready</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-lg md:text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto leading-relaxed"
          >
            KhozAI diseña{" "}
            <span className="text-[var(--color-accent)]">tu sesión diaria</span>
            : ejercicios personalizados, metrónomo, preview de audio y tracking
            de progreso. Para músicos que quieren resultados, no tutoriales
            infinitos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/signup">
              <Button size="lg" className="btn-pill min-w-[220px]">
                <Sparkles className="w-4 h-4" /> Crear cuenta gratis
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="btn-pill min-w-[220px]">
                <Headphones className="w-4 h-4" /> Ver demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 text-xs text-[var(--color-fg-subtle)]"
          >
            7 días gratis · Sin tarjeta · Cancela cuando quieras
          </motion.div>
        </div>
      </section>

      {/* PRODUCT MOCK */}
      <section id="producto" className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionLabel>El producto</SectionLabel>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight max-w-3xl mx-auto">
            Una pantalla. Una decisión.{" "}
            <span className="gradient-text-soft">Empezar</span>.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Glow behind card */}
          <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-br from-[var(--color-accent)]/20 via-[var(--color-violet)]/20 to-[var(--color-pink)]/20 blur-3xl -z-10" />
          <div className="card-base p-8 backdrop-blur-xl bg-[var(--color-bg-elevated)]/80">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--color-border)]">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-1.5">
                  Práctica de hoy
                </div>
                <div className="text-2xl font-semibold">
                  25 min · 4 ejercicios
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-[var(--color-coral-dim)] text-[var(--color-coral)] text-xs font-mono font-semibold">
                🔥 12 días
              </div>
            </div>
            <div className="space-y-1">
              {[
                ["Alternate picking cromático", "Técnica", "7 min", "90 BPM"],
                ["Improvisación en D dórico", "Improvisación", "8 min", "100 BPM"],
                ["Legato hammer-ons", "Técnica", "6 min", "110 BPM"],
                ["Rítmica funk en 16avos", "Ritmo", "5 min", "95 BPM"],
              ].map(([name, cat, dur, bpm]) => (
                <div
                  key={name}
                  className="flex items-center justify-between py-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-violet)] group-hover:scale-150 transition" />
                    <span className="text-sm font-medium truncate">{name}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-xs text-[var(--color-fg-muted)] font-mono">
                    <span className="w-24 text-right">{cat}</span>
                    <span className="w-12 text-right">{dur}</span>
                    <span className="w-16 text-right">{bpm}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ENFOQUE — 3 cards */}
      <section id="enfoque" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <SectionLabel>Enfoque</SectionLabel>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight max-w-3xl mx-auto">
            Tres principios.{" "}
            <span className="gradient-text-soft">Cero relleno.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <Brain className="w-6 h-6" />,
              title: "Personalización real",
              body: "La IA selecciona ejercicios curados según tu nivel, géneros, sensación reportada y objetivo. Cada día distinto. Cada día tuyo.",
              gradient: "from-[var(--color-accent)] to-[var(--color-violet)]",
            },
            {
              icon: <Activity className="w-6 h-6" />,
              title: "Foco en el intermedio",
              body: "No competimos con apps para principiantes. Si te sientes estancado después de un año tocando, eres nuestra audiencia.",
              gradient: "from-[var(--color-violet)] to-[var(--color-pink)]",
            },
            {
              icon: <Music2 className="w-6 h-6" />,
              title: "Herramientas, no videos",
              body: "Metrónomo, preview de audio, tablatura, tracking de BPM. La práctica se hace tocando, no viendo.",
              gradient: "from-[var(--color-pink)] to-[var(--color-accent)]",
            },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-base p-7 relative overflow-hidden group hover:border-[var(--color-border-strong)] transition"
            >
              <div
                className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${p.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition`}
              />
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.gradient} p-[1px] mb-6`}
                >
                  <div className="w-full h-full rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center">
                    <div
                      className={`bg-gradient-to-br ${p.gradient} bg-clip-text text-transparent`}
                    >
                      {p.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                  {p.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRECIO */}
      <section id="precio" className="max-w-3xl mx-auto px-6 py-24 text-center">
        <SectionLabel>Precio</SectionLabel>
        <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-12">
          Menos que <span className="gradient-text-soft">una clase</span>.
          <br />
          Todos los días.
        </h2>

        <div className="relative max-w-md mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-accent)]/30 via-[var(--color-violet)]/30 to-[var(--color-pink)]/30 blur-2xl -z-10" />
          <div className="card-base p-10 backdrop-blur-xl bg-[var(--color-bg-elevated)]/80">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-violet)] text-[#0a1620] text-[10px] font-mono font-bold uppercase tracking-widest">
              Early Access
            </div>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-7xl font-bold">$9</span>
              <span className="text-[var(--color-fg-muted)]">USD/mes</span>
            </div>
            <div className="text-sm text-[var(--color-fg-muted)] mb-8">
              o $49 USD el primer año · 100 primeros usuarios
            </div>
            <Link href="/signup" className="block">
              <Button size="lg" className="btn-pill w-full">
                Empezar 7 días gratis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center">
        <h2 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl mx-auto">
          La diferencia entre el que mejora
          <br />
          y el que no, es la{" "}
          <span className="gradient-text">rutina</span>.
        </h2>
        <p className="text-[var(--color-fg-muted)] mt-8 max-w-md mx-auto">
          Empieza hoy. En 60 días vas a oír la diferencia.
        </p>
        <Link href="/signup" className="inline-block mt-10">
          <Button size="lg" className="btn-pill">
            <Sparkles className="w-4 h-4" /> Crear cuenta gratis
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--color-border)] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <Logo />
          <div className="text-xs text-[var(--color-fg-subtle)] font-mono">
            © {new Date().getFullYear()} KhozAI · Medellín, CO
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] mb-6">
      {children}
    </div>
  );
}
