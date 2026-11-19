import { getServerSupabase } from "@/lib/supabase-server";

/*
  Newsletter sending via the Resend API (plain fetch, no SDK).
  Server-only: RESEND_API_KEY must never reach the browser.
  Without a verified sending domain, Resend's onboarding sender can
  only deliver to the Resend account owner's own email address — the
  API's error is surfaced to the admin verbatim when that happens.
*/

export function newsletterConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bodyToHtml(body: string): string {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;line-height:1.65;color:#0a1a33">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px">
    <p style="margin:0 0 20px;font-size:13px;font-weight:700;letter-spacing:.08em;color:#0b6bff">THE DISCARO BRIEFING</p>
    ${paragraphs}
    <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#5b6b8c">You're receiving this because you subscribed to The Discaro Briefing at discaro.vercel.app. Reply to this email to unsubscribe.</p>
  </div>`;
}

export interface SendResult {
  sent: number;
  error?: string;
}

export async function sendNewsletter(subject: string, body: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: 0, error: "Resend is not configured (RESEND_API_KEY is missing)." };
  const from = process.env.RESEND_FROM ?? "Discaro <onboarding@resend.dev>";

  const sb = await getServerSupabase();
  if (!sb) return { sent: 0, error: "Supabase is not configured." };
  const { data: subs, error: subError } = await sb
    .from("newsletter_subscribers")
    .select("email")
    .order("created_at", { ascending: true })
    .limit(1000);
  if (subError) return { sent: 0, error: `Could not read subscribers: ${subError.message}` };
  const emails = (subs ?? []).map((s) => s.email).filter(Boolean);
  if (emails.length === 0) return { sent: 0, error: "There are no subscribers yet." };

  const html = bodyToHtml(body);
  let sent = 0;
  // Resend's batch endpoint accepts up to 100 emails per call.
  for (let i = 0; i < emails.length; i += 100) {
    const chunk = emails.slice(i, i + 100);
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chunk.map((to) => ({ from, to, subject, html, text: body }))),
    });
    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const payload = (await res.json()) as { message?: string };
        if (payload?.message) detail = payload.message;
      } catch {
        // keep the HTTP status as the detail
      }
      return {
        sent,
        error:
          sent > 0
            ? `Sent ${sent}, then Resend stopped the batch: ${detail}`
            : `Resend refused the send: ${detail}`,
      };
    }
    sent += chunk.length;
  }
  return { sent };
}
