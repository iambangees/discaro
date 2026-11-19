"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) {
      setError("Accounts are not configured for this deployment yet.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: signInError } = await sb.auth.signInWithPassword({ email, password });
    if (signInError) {
      setBusy(false);
      setError("Sign-in failed — check the email and password, or create an account first.");
      return;
    }
    router.push(next || "/account");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none";

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-line bg-surface p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white">
          <Compass className="h-5.5 w-5.5" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">Welcome back</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Sign in to reach your saved bookmarks — the articles and opportunities you want to come
          back to.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          New to Discaro?{" "}
          <Link href="/signup" className="font-semibold text-accent-deep hover:underline">
            Create a free account
          </Link>
        </p>
      </div>
    </main>
  );
}
