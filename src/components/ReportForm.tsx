"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

/*
  "Report expired / broken" — writes to the reports table, which the
  RLS policy opens for public inserts (and nothing else). Reports are
  reviewed by a person; the listing is never changed automatically.
*/
export default function ReportForm({ opportunityId }: { opportunityId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) {
      setState("error");
      return;
    }
    setState("sending");
    const { error } = await sb
      .from("reports")
      .insert({ opportunity_id: opportunityId, reason: reason.trim() });
    setState(error ? "error" : "sent");
  }

  if (state === "sent") {
    return (
      <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
        Thank you — your report is in. A person will re-check this listing against the official
        source.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-accent-deep"
      >
        <Flag className="h-4 w-4" aria-hidden /> Report an expired or broken listing
      </button>
      {open && (
        <form onSubmit={submit} className="mt-3">
          <label htmlFor="report-reason" className="sr-only">
            What is wrong with this listing?
          </label>
          <textarea
            id="report-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={3}
            placeholder="e.g. The application page says entries closed last week…"
            className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
            >
              {state === "sending" ? "Sending…" : "Send report"}
            </button>
            {state === "error" && (
              <p className="text-sm text-red-700" role="alert">
                The report could not be sent just now — please try again shortly.
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
