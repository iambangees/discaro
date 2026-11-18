import type { Metadata } from "next";
import Link from "next/link";
import { Flag, Mail, MessageSquare } from "lucide-react";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `How to reach the ${SITE.name} team.`,
};

export default function ContactPage() {
  return (
    <StaticPage
      title="Contact"
      intro={`${SITE.name} is preparing for launch. Public contact channels open with the launch — this page explains what each route will be for, so the right messages reach the right place.`}
    >
      <div className="grid gap-4 sm:grid-cols-3 [&>div]:rounded-2xl [&>div]:border [&>div]:border-line [&>div]:bg-surface [&>div]:p-5">
        <div>
          <Mail className="h-5 w-5 text-accent" aria-hidden />
          <h2 className="!pt-3 text-base">General enquiries</h2>
          <p className="mt-1 text-sm">
            Questions, corrections and partnership enquiries. The address publishes here at
            launch.
          </p>
        </div>
        <div>
          <Flag className="h-5 w-5 text-accent" aria-hidden />
          <h2 className="!pt-3 text-base">Report a listing</h2>
          <p className="mt-1 text-sm">
            Found an expired or broken opportunity? A "Report" button on every listing opens with
            the directory in Phase 3.
          </p>
        </div>
        <div>
          <MessageSquare className="h-5 w-5 text-accent" aria-hidden />
          <h2 className="!pt-3 text-base">Suggest a find</h2>
          <p className="mt-1 text-sm">
            Community submissions of freebies and opportunities arrive in a later phase — every
            suggestion is verified before it can appear.
          </p>
        </div>
      </div>
      <p>
        Until launch, the fastest way to follow progress is the newsletter — subscribe on the{" "}
        <Link href="/">homepage</Link> and you'll hear when contact opens.
      </p>
    </StaticPage>
  );
}
