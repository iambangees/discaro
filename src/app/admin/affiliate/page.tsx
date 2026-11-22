import { listAffiliateLinks } from "@/lib/admin";
import { SITE } from "@/lib/site";
import {
  deleteAffiliateLink,
  saveAffiliateLink,
  setAffiliateLinkActive,
} from "../actions";

export const instant = false;

const INPUT =
  "w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent";
const BTN = "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors";
const BTN_LINE = `${BTN} border border-line text-ink hover:border-accent/50`;
const BTN_DANGER = `${BTN} border border-red-200 text-red-700 hover:border-red-400`;

export default async function AdminAffiliatePage() {
  const links = await listAffiliateLinks();
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Affiliate links</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Create a tracked link here, then paste its <strong>/go/…</strong> address into an article
        wherever you would normally paste the merchant link. Clicks are counted each time a
        reader follows it. Articles containing affiliate links should keep the article&apos;s
        affiliate flag on, so the disclosure banner shows.
      </p>

      <form
        action={saveAffiliateLink}
        className="mt-6 grid gap-3 rounded-3xl border border-line bg-surface p-5 sm:grid-cols-[1fr_1fr_1.4fr_auto] sm:items-end"
      >
        <div>
          <label htmlFor="aff-label" className="text-sm font-semibold text-ink">
            Label
          </label>
          <input id="aff-label" name="label" required maxLength={120} placeholder="e.g. NordVPN deal" className={`mt-1.5 ${INPUT}`} />
        </div>
        <div>
          <label htmlFor="aff-merchant" className="text-sm font-semibold text-ink">
            Merchant
          </label>
          <input id="aff-merchant" name="merchant" maxLength={120} placeholder="Optional" className={`mt-1.5 ${INPUT}`} />
        </div>
        <div>
          <label htmlFor="aff-url" className="text-sm font-semibold text-ink">
            Destination URL
          </label>
          <input id="aff-url" name="url" required maxLength={2000} inputMode="url" placeholder="https://merchant.example/…?aff=…" className={`mt-1.5 ${INPUT}`} />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
        >
          Add link
        </button>
      </form>

      {links.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No affiliate links yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {links.map((l) => (
            <li key={l.id} className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-ink">{l.label}</span>
                {l.merchant && <span className="text-sm text-muted">· {l.merchant}</span>}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    l.active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {l.active ? "active" : "inactive"}
                </span>
                <span className="ml-auto text-sm font-semibold text-ink">
                  {l.clicks} {l.clicks === 1 ? "click" : "clicks"}
                </span>
              </div>
              <p className="mt-2 break-all text-sm text-ink-soft">
                <span className="font-semibold text-ink">Paste this:</span>{" "}
                <code className="rounded bg-accent-soft px-1.5 py-0.5 text-[13px] text-accent-deep">
                  {SITE.url}/go/{l.id}
                </code>
              </p>
              <p className="mt-1 break-all text-sm text-muted">
                Goes to: {l.url}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={setAffiliateLinkActive}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="active" value={l.active ? "false" : "true"} />
                  <button type="submit" className={BTN_LINE}>
                    {l.active ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <form action={deleteAffiliateLink}>
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit" className={BTN_DANGER}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
