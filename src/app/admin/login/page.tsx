"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) {
      setError("Supabase is not configured for this deployment.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: signInError } = await sb.auth.signInWithPassword({ email, password });
    if (signInError) {
      setBusy(false);
      setError("Sign-in failed — check the email and password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-line bg-surface p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white">
          <Compass className="h-5.5 w-5.5" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">Admin sign-in</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          For the Discaro team only. There is no public sign-up — accounts are created by the site
          owner in Supabase.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
