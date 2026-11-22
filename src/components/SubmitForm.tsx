"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/supabase-browser";

const INPUT =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-base text-ink outline-none placeholder:text-muted focus:border-accent";
const LABEL = "text-sm font-semibold text-ink";

/**
 * "Suggest an opportunity" form. Signed-in visitors only; the insert
 * runs under the submissions RLS policies (own user_id, always
 * "pending"). Suggestions are reviewed by an admin and never publish
 * automatically.
 */
export default function SubmitForm() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(() => getBrowserSupabase() === null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [officialUrl, setOfficialUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [rewardInfo, setRewardInfo] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (cancelled) return;
      setUserId(user?.id ?? null);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb || !userId || busy) return;
    const url = officialUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      setError("Please paste the full official link, starting with https://");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: insertError } = await sb.from("submissions").insert({
      user_id: userId,
      title: title.trim(),
      organisation: organisation.trim(),
      official_url: url,
      summary: summary.trim(),
      reward_info: rewardInfo.trim(),
      expires_at: expiresAt || null,
    });
    setBusy(false);
    if (insertError) {
      setError("Your suggestion could not be sent. Please check the fields and try again.");
      return;
    }
    setDone(true);
  }

  if (!ready) return null;

  if (!userId) {
    return (
      <p className="rounded-3xl border border-line bg-surface p-5 text-sm leading-relaxed text-ink-soft">
        <Link href="/login?next=/submit" className="font-semibold text-accent-deep underline">
          Sign in
        </Link>{" "}
        to suggest an opportunity. Suggestions are tied to your account so you can follow their
        review status on your account page.
      </p>
    );
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-900">Thank you — suggestion received.</p>
        <p className="mt-1.5 text-sm leading-relaxed text-emerald-800">
          Every suggestion is checked against its official source before anything is listed.
          You can follow its status under <strong>My submissions</strong> on{" "}
          <Link href="/account" className="font-semibold underline">
            your account page
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
      <div>
        <label htmlFor="sub-title" className={LABEL}>
          Opportunity name *
        </label>
        <input
          id="sub-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          maxLength={200}
          placeholder="e.g. Commonwealth Shared Scholarships"
          className={INPUT}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="sub-org" className={LABEL}>
          Organisation
        </label>
        <input
          id="sub-org"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          maxLength={200}
          placeholder="Who runs it?"
          className={INPUT}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="sub-url" className={LABEL}>
          Official link *
        </label>
        <input
          id="sub-url"
          value={officialUrl}
          onChange={(e) => setOfficialUrl(e.target.value)}
          required
          maxLength={1000}
          inputMode="url"
          placeholder="https://… the programme's own page"
          className={INPUT}
        />
        <p className="mt-1.5 text-xs text-muted">
          The link to the programme on its official site — not a news post or a social media share.
        </p>
      </div>
      <div className="mt-4">
        <label htmlFor="sub-summary" className={LABEL}>
          What is it? *
        </label>
        <textarea
          id="sub-summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          placeholder="A few sentences: who it is for, what it offers, and anything else worth knowing."
          className={INPUT}
        />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sub-reward" className={LABEL}>
            What do successful applicants get?
          </label>
          <input
            id="sub-reward"
            value={rewardInfo}
            onChange={(e) => setRewardInfo(e.target.value)}
            maxLength={1000}
            placeholder="e.g. Full tuition + monthly stipend"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="sub-expires" className={LABEL}>
            Closing date (if known)
          </label>
          <input
            id="sub-expires"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className={INPUT}
          />
        </div>
      </div>
      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send suggestion"}
        </button>
        <span className="text-xs text-muted">
          Reviewed by a person against the official source — never published automatically.
        </span>
      </div>
    </form>
  );
}
