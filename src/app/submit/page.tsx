import type { Metadata } from "next";
import SubmitForm from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Suggest an opportunity",
  description:
    "Know a grant, scholarship, fellowship or programme Discaro should list? Suggest it — every suggestion is verified against its official source before listing.",
};

export default function SubmitPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold tracking-wide text-accent-deep">COMMUNITY</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Suggest an opportunity</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        Found a grant, scholarship, fellowship, competition or programme that belongs in the{" "}
        directory? Send it in. A person checks every suggestion against the official source
        before it is listed — that is how the directory stays trustworthy — so please link to
        the programme&apos;s own page, not a repost.
      </p>
      <div className="mt-8">
        <SubmitForm />
      </div>
    </main>
  );
}
