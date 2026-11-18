import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: `How ${SITE.name} earns money from links and sponsorships — in plain language.`,
};

export default function AffiliateDisclosurePage() {
  return (
    <StaticPage
      title="Affiliate Disclosure"
      intro="Plain language, no fine-print tricks: this is how money flows around Discaro, and the rules it never breaks."
    >
      <h2>Some links earn us a commission</h2>
      <p>
        Some links on {SITE.name} are affiliate links. If you click one and later sign up or buy
        something, the company may pay us a commission. It costs you nothing extra — the price
        you pay is the same as going direct.
      </p>
      <h2>Labels you can see</h2>
      <p>
        Articles or listings containing affiliate links carry a visible note. Sponsored articles
        are labelled "Sponsored" at the top, and sponsored placements never appear inside our
        rankings or verdicts unlabelled.
      </p>
      <h2>What money can't buy here</h2>
      <p>
        A commission never decides whether something is listed, how it is ranked, or what a
        review concludes. If a product is poor, the review says so — including products with
        affiliate programmes. If a listing is wrong or expired, we correct or mark it regardless
        of what it earns.
      </p>
      <h2>Why we do it</h2>
      <p>
        Affiliate income, advertising and sponsorships fund the human verification that makes{" "}
        {SITE.name} useful. We would rather disclose that plainly than pretend it doesn't happen.
      </p>
    </StaticPage>
  );
}
