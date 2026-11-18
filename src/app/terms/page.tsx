import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `The terms for using ${SITE.name}.`,
};

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms of Use"
      intro="Last updated: 18 November 2026. By using this site you agree to these terms."
    >
      <h2>What {SITE.name} is</h2>
      <p>
        {SITE.name} is an information and discovery service. We research and summarise freebies,
        rewards, tools, tutorials and opportunities published by third parties. We are not the
        provider of those offers, and inclusion here is not an endorsement or a guarantee.
      </p>
      <h2>Verify before you act</h2>
      <p>
        Offers change and expire. Although every listing is checked by a person and carries a
        last-verified date, always confirm the current terms, eligibility and deadlines on the
        official website before applying, paying or sharing personal information.
      </p>
      <h2>No financial advice</h2>
      <p>
        Content about earning platforms, cashback and rewards is general information, not
        financial advice. Earnings are never guaranteed — by us or, despite what some platforms
        claim, by anyone.
      </p>
      <h2>External websites</h2>
      <p>
        We link to third-party websites we do not control. We are not responsible for their
        content, availability or practices.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Original content on {SITE.name} belongs to {SITE.name} unless stated otherwise; do not
        republish it wholesale. Third-party names and trademarks belong to their owners and are
        used only to identify the products and programmes being discussed.
      </p>
      <h2>Liability</h2>
      <p>
        The site is provided "as is". To the fullest extent permitted by law, {SITE.name} is not
        liable for losses arising from reliance on listings or from third-party offers.
      </p>
      <h2>Changes</h2>
      <p>
        These terms may be updated; the current version always lives at this address with its
        date.
      </p>
    </StaticPage>
  );
}
