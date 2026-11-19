"use client";

import { useActionState } from "react";
import { sendNewsletterAction, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = {};

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

export default function NewsletterForm({ subscriberCount }: { subscriberCount: number }) {
  const [state, formAction, pending] = useActionState(sendNewsletterAction, initialState);
  return (
    <form action={formAction} className="mt-6 space-y-5">
      <div>
        <label htmlFor="nl-subject" className={labelCls}>
          Subject
        </label>
        <input
          id="nl-subject"
          name="subject"
          required
          placeholder="e.g. This week on Discaro: a fully funded UK Master's, and 3 new freebies"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="nl-body" className={labelCls}>
          Email body (plain text — blank lines make new paragraphs)
        </label>
        <textarea
          id="nl-body"
          name="body"
          required
          rows={14}
          placeholder={
            "Hello,\n\nHere is what is new on Discaro this week…\n\n— The Discaro team"
          }
          className={inputCls}
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.saved && (
        <p role="status" className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800">
          {state.message ?? "Sent."}
        </p>
      )}
      <button
        type="submit"
        disabled={pending || subscriberCount === 0}
        className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
      >
        {pending
          ? "Sending…"
          : subscriberCount === 0
            ? "No subscribers yet"
            : `Send to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`}
      </button>
    </form>
  );
}
