"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, AlertCircle, User, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") ?? "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const passwordValid = Object.values(passwordChecks).every(Boolean);
  const nameValid = name.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSubmit =
    mode === "login"
      ? email.length > 0 && password.length > 0
      : nameValid && emailValid && passwordValid;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && !passwordValid) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo."
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback?redirect=/onboarding`
              : undefined,
        },
      });
      if (error) {
        setLoading(false);
        return setError(translate(error.message));
      }
      // If email confirm is disabled in Supabase, the user is logged in immediately
      if (data.session) {
        router.push("/onboarding");
        router.refresh();
        return;
      }
      setLoading(false);
      setSuccessMsg(
        "Cuenta creada. Revisa tu correo para confirmar el acceso, luego inicia sesión."
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) return setError(translate(error.message));
      router.push(redirect);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center border-b border-[var(--color-border)]">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <h1 className="text-display text-4xl md:text-5xl mb-3">
            {mode === "login" ? "Volver a tu rutina." : "Crea tu cuenta."}
          </h1>
          <p className="text-[var(--color-fg-muted)] mb-8">
            {mode === "login"
              ? "Tu progreso te está esperando."
              : "60 segundos. Sin tarjeta. 7 días gratis."}
          </p>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field
                icon={<User className="w-4 h-4" />}
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={setName}
                required
              />
            )}
            <Field
              icon={<Mail className="w-4 h-4" />}
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={setEmail}
              required
            />
            <Field
              icon={<Lock className="w-4 h-4" />}
              type="password"
              placeholder={
                mode === "signup" ? "Crea una contraseña segura" : "Contraseña"
              }
              value={password}
              onChange={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
              minLength={mode === "signup" ? 8 : 1}
            />

            {mode === "signup" && (passwordFocused || password.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-[10px] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] space-y-1.5">
                  <Check2
                    ok={passwordChecks.length}
                    label="Mínimo 8 caracteres"
                  />
                  <Check2
                    ok={passwordChecks.upper}
                    label="Una letra mayúscula (A–Z)"
                  />
                  <Check2 ok={passwordChecks.digit} label="Un número (0–9)" />
                  <Check2
                    ok={passwordChecks.symbol}
                    label="Un símbolo (!@#$%…)"
                  />
                </div>
              </motion.div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-[10px] bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-sm text-[var(--color-error)]">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-[10px] bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/30 text-sm">
                {successMsg}
              </div>
            )}

            <Button
              size="lg"
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full glow-accent mt-2"
            >
              {loading
                ? "..."
                : mode === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}{" "}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-[var(--color-fg-muted)]">
            {mode === "login" ? (
              <>
                ¿Aún no tienes cuenta?{" "}
                <Link
                  href={`/signup?redirect=${redirect}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Crear cuenta
                </Link>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <Link
                  href={`/login?redirect=${redirect}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
  required,
  minLength,
  onFocus,
  onBlur,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full pl-11 pr-4 py-3.5 rounded-[12px] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-dim)] transition placeholder:text-[var(--color-fg-subtle)]"
      />
    </div>
  );
}

function Check2({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs transition ${
        ok ? "text-[var(--color-success)]" : "text-[var(--color-fg-muted)]"
      }`}
    >
      {ok ? (
        <Check className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 shrink-0 opacity-60" />
      )}
      {label}
    </div>
  );
}

function translate(msg: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "Email o contraseña incorrectos.",
    "User already registered": "Ese email ya está registrado. Inicia sesión.",
    "Email not confirmed":
      "Email sin confirmar. Revisa tu correo o desactiva confirmación en Supabase.",
  };
  return map[msg] ?? msg;
}
