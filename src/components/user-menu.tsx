"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, RefreshCw, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type UserInfo = { name: string; email: string };

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const meta = (u.user_metadata ?? {}) as { full_name?: string };
      const name = (meta.full_name || "").trim() || "Tu cuenta";
      setUser({
        name,
        email: u.email ?? "",
      });
    });
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!user) return null;

  const initial = user.name.trim().charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 pr-2 pl-1 py-1 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition"
      >
        <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] text-[#0a1620] flex items-center justify-center text-sm font-semibold">
          {initial}
        </div>
        <span className="text-sm font-medium text-[var(--color-fg)] hidden sm:inline">
          {firstName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--color-fg-muted)] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-40 w-72 card-base p-2 shadow-2xl">
            <div className="px-3 py-3 border-b border-[var(--color-border)] mb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[#0a1620] flex items-center justify-center text-base font-semibold">
                  {initial}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-[var(--color-fg-muted)] truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/onboarding"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-fg)] transition"
            >
              <RefreshCw className="w-4 h-4" /> Actualizar mi cuestionario
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-fg)] transition"
            >
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
