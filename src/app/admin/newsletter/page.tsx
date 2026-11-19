import { listSubscribers } from "@/lib/admin";
import { newsletterConfigured } from "@/lib/newsletter";
import NewsletterForm from "@/components/admin/NewsletterForm";

export const instant = false;

export default async function AdminNewsletterPage() {
  const subscribers = await listSubscribers();
  const configured = newsletterConfigured();
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Send the Briefing</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Write an issue of The Discaro Briefing and send it to everyone on the subscriber list (
        {subscribers.length} {subscribers.length === 1 ? "person" : "people"}). Sends go through
        Resend.
      </p>
      {!configured && (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>Sending is not switched on yet.</strong> The Resend API key (RESEND_API_KEY) is
          not set for this deployment, so the form below will report that when used. Add the key
          in Vercel → Project → Settings → Environment Variables, then redeploy.
        </p>
      )}
      <NewsletterForm subscriberCount={subscribers.length} />
    </main>
  );
}
