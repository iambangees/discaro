"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveOpportunity, type ActionState } from "@/app/admin/actions";
import type { Opportunity } from "@/lib/data";

const initialState: ActionState = {};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

interface EligibilityRow {
  region: string;
  notes: string;
}

export default function OpportunityEditor({
  opportunity,
  postOptions,
}: {
  opportunity: Opportunity | null;
  postOptions: { id: string; title: string }[];
}) {
  const [state, formAction, pending] = useActionState(saveOpportunity, initialState);
  const [rows, setRows] = useState<EligibilityRow[]>(
    opportunity?.eligibility?.length ? opportunity.eligibility : [{ region: "Worldwide", notes: "" }],
  );
  const [opensVal, setOpensVal] = useState(toLocalInput(opportunity?.opens_at ?? null));
  const [expiresVal, setExpiresVal] = useState(toLocalInput(opportunity?.expires_at ?? null));
  const [verifiedVal, setVerifiedVal] = useState(toLocalInput(opportunity?.last_verified_at ?? null));

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={opportunity?.id ?? ""} />
      <input type="hidden" name="eligibility_json" value={JSON.stringify(rows)} />
      <div>
        <label htmlFor="oe-title" className={labelCls}>Title</label>
        <input id="oe-title" name="title" required defaultValue={opportunity?.title ?? ""} className={inputCls} placeholder="e.g. Tony Elumelu Foundation Entrepreneurship Programme" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="oe-slug" className={labelCls}>Slug (URL)</label>
          <input id="oe-slug" name="slug" defaultValue={opportunity?.slug ?? ""} className={inputCls} placeholder="auto-generated from the title" />
        </div>
        <div>
          <label htmlFor="oe-org" className={labelCls}>Organisation</label>
          <input id="oe-org" name="organisation" defaultValue={opportunity?.organisation ?? ""} className={inputCls} />
        </div>
      </div>
      <div>
        <label htmlFor="oe-summary" className={labelCls}>Summary</label>
        <textarea id="oe-summary" name="summary" rows={3} defaultValue={opportunity?.summary ?? ""} className={inputCls} placeholder="What it is, in two or three honest sentences" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="oe-reward" className={labelCls}>What you get</label>
          <textarea id="oe-reward" name="reward_info" rows={4} defaultValue={opportunity?.reward_info ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="oe-req" className={labelCls}>Requirements</label>
          <textarea id="oe-req" name="requirements" rows={4} defaultValue={opportunity?.requirements ?? ""} className={inputCls} />
        </div>
      </div>

      <fieldset>
        <legend className={labelCls}>Eligibility (who can apply)</legend>
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                aria-label={`Region ${i + 1}`}
                value={row.region}
                onChange={(e) => setRows(rows.map((r, j) => (j === i ? { ...r, region: e.target.value } : r)))}
                className={inputCls}
                placeholder="Region — e.g. Worldwide, Nigeria, Africa"
              />
              <input
                aria-label={`Notes ${i + 1}`}
                value={row.notes}
                onChange={(e) => setRows(rows.map((r, j) => (j === i ? { ...r, notes: e.target.value } : r)))}
                className={inputCls}
                placeholder="Notes — e.g. founders aged 18+"
              />
              <button
                type="button"
                aria-label="Remove row"
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
                className="shrink-0 rounded-xl border border-line px-3 text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows([...rows, { region: "", notes: "" }])}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:border-accent/50 hover:text-accent-deep"
        >
          <Plus className="h-4 w-4" aria-hidden /> Add region
        </button>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="oe-official" className={labelCls}>Official application link *</label>
          <input id="oe-official" name="official_url" required defaultValue={opportunity?.official_url ?? ""} className={inputCls} placeholder="https://the-real-programme.org/apply" />
        </div>
        <div>
          <label htmlFor="oe-source" className={labelCls}>Source URL (where you verified it)</label>
          <input id="oe-source" name="source_url" defaultValue={opportunity?.source_url ?? ""} className={inputCls} placeholder="https://…" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="oe-status" className={labelCls}>Status</label>
          <select id="oe-status" name="status" defaultValue={opportunity?.status ?? "active"} className={inputCls}>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="expired">Expired</option>
            <option value="paused">Paused (hidden)</option>
          </select>
        </div>
        <div>
          <label htmlFor="oe-opens" className={labelCls}>Opens</label>
          <input id="oe-opens" name="opens_at" type="datetime-local" value={opensVal} onChange={(e) => setOpensVal(e.target.value)} className={inputCls} />
          {opensVal && (
            <button type="button" onClick={() => setOpensVal("")} className="mt-1.5 text-xs font-semibold text-accent-deep hover:underline">
              Clear date
            </button>
          )}
        </div>
        <div>
          <label htmlFor="oe-expires" className={labelCls}>Closes</label>
          <input id="oe-expires" name="expires_at" type="datetime-local" value={expiresVal} onChange={(e) => setExpiresVal(e.target.value)} className={inputCls} />
          {expiresVal && (
            <button type="button" onClick={() => setExpiresVal("")} className="mt-1.5 text-xs font-semibold text-accent-deep hover:underline">
              Clear date
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="oe-verified" className={labelCls}>Last verified</label>
          <input id="oe-verified" name="last_verified_at" type="datetime-local" value={verifiedVal} onChange={(e) => setVerifiedVal(e.target.value)} className={inputCls} />
          {verifiedVal && (
            <button type="button" onClick={() => setVerifiedVal("")} className="mt-1.5 text-xs font-semibold text-accent-deep hover:underline">
              Clear date
            </button>
          )}
          <label className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-ink">
            <input type="checkbox" name="verified_today" className="h-4 w-4 accent-[#0b6bff]" />
            I verified this listing today
          </label>
        </div>
        <div>
          <label htmlFor="oe-related" className={labelCls}>Related article (optional)</label>
          <select id="oe-related" name="related_post_id" defaultValue={opportunity?.related_post_id ?? ""} className={inputCls}>
            <option value="">None</option>
            {postOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>
      {state.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep disabled:opacity-60">
        {pending ? "Saving…" : opportunity ? "Save changes" : "Add opportunity"}
      </button>
    </form>
  );
}
