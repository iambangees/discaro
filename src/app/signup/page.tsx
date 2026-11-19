"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, MailCheck } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) {
      setError("Accounts are not configured for this deployment yet.");
      return;
    }
    setBusy(true);
    setError("");
    const { data, error: signUpError } = await sb.auth.signUp({
      email,
      password,
      options: { data: { display_name: name.trim() } },
    });
    if (signUpError) {
      setBusy(false);
      setError(
        signUpError.message.includes("already registered")
          ? "That email already has an account — try signing in instead."
          : `Sign-up failed: ${signUpError.message}`,
      );
      return;
    }
    if (data.session) {
      router.push("/account");
      router.refresh();
      return;
    }
    // No session means email confirmation is switched on for this project.
    setBusy(false);
    setConfirmSent(true);
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none";

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-line bg-surface p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white">
          <Compass className="h-5.5 w-5.5" aria-hidden />
        </span>
        {confirmSent ? (
          <>
            <span className="mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
              <MailCheck className="h-5.5 w-5.5" aria-hidden />
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">Check your email</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              We sent a confirmation link to <strong className="text-ink">{email}</strong>. Tap it
              to activate your account, then sign in — your bookmarks will be waiting.
            </p>
            <Link
              href="/login"
              className="mt-6 block rounded-xl bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              Go to sign in
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">Create your account</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Free forever. Save opportunities and articles to your own list, and pick them up on
              any device.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-sm font-semibold text-ink">
                  Your name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-ink">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-1.5 block text-sm font-semibold text-ink"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                />
                <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
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
                {busy ? "Creating your account…" : "Create free account"}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-accent-deep hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
