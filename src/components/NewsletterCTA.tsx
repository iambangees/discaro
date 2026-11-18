"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

/*
  Phase 1: the newsletter backend (Resend + subscriber storage) arrives in
  Phase 5. Until then the form is honest about that instead of pretending
  to subscribe anyone — nothing entered here is stored or sent anywhere.
*/
export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("That email address doesn't look complete — check it and try again.");
      return;
    }
    setMessage(
      "You're early — subscriptions open when the newsletter launches, and nothing you typed was stored. Please check back at launch."
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
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              <Send className="h-4 w-4" aria-hidden />
              Notify me
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
