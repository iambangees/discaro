"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

/*
  The Discaro Briefing sign-up. Subscriptions are stored for real in the
  newsletter_subscribers table (public-insert RLS, unique email). Sending
  is done from the admin dashboard via Resend.
*/
export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setMessage("That email address doesn't look complete — check it and try again.");
      return;
    }
    const sb = getBrowserSupabase();
    if (!sb) {
      setMessage("Subscriptions are not available right now — please try again later.");
      return;
    }
    setBusy(true);
    setMessage(null);
    const { error } = await sb.from("newsletter_subscribers").insert({ email: value });
    setBusy(false);
    if (error) {
      if (error.code === "23505") {
        setMessage("You're already on the list — no need to sign up twice.");
        setEmail("");
      } else {
        setMessage("Something went wrong saving that — please try again in a moment.");
      }
      return;
    }
    setMessage(
      "You're in. The Briefing goes out when there's a week worth sending — no spam, ever.",
    );
    setEmail("");
  }

  return (
    <section className="rounded-3xl bg-navy px-6 py-10 text-white sm:px-10">
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-accent-soft">
            <Mail className="h-4 w-4" aria-hidden /> THE DISCARO BRIEFING
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            The week's best finds, in one email
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            New freebies, live opportunities before they expire, and the tools actually worth
            trying. No spam, no bought placements — unsubscribe any time.
          </p>
        </div>
        <form onSubmit={onSubmit} className="w-full max-w-md lg:ml-auto" noValidate>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="flex gap-2">
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
            >
              <Send className="h-4 w-4" aria-hidden />
              {busy ? "Joining…" : "Subscribe"}
            </button>
          </div>
          {message && (
            <p role="status" className="mt-3 text-sm leading-relaxed text-accent-soft">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
