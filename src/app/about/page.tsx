import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE.name} is, how listings are verified, and how the site makes money.`,
};

export default function AboutPage() {
  return (
    <StaticPage
      title={`About ${SITE.name}`}
      intro={`${SITE.name} is a global digital discovery platform: a searchable home for useful freebies, rewards, technology, tutorials, opportunities and honest reviews.`}
    >
      <h2>More than a blog</h2>
      <p>
        Most "best tools" lists are scraped, sponsored or stale. {SITE.name} is built as a
        destination instead: articles and guides on one side, and a structured{" "}
        <Link href="/opportunities">Opportunity Directory</Link> on the other — where every entry
        carries eligibility, requirements, rewards, an expiry date and the date a person last
        verified it.
      </p>
      <h2>Our standard</h2>
      <p>
        Nothing fictional is ever presented as real. If an opportunity has closed, it is marked
        expired rather than quietly deleted or left to waste your time. If a link earns us a
        commission, that is disclosed — see our{" "}
        <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> — and it never buys a
        kinder review.
      </p>
      <h2>What you'll find</h2>
      <p>
        <Link href="/freebies">Freebies</Link>, <Link href="/rewards">Rewards</Link>,{" "}
        <Link href="/technology">Technology</Link>, <Link href="/tutorials">Tutorials</Link>,{" "}
        <Link href="/opportunities">Opportunities</Link> and{" "}
        <Link href="/reviews">Reviews</Link> — written for a worldwide audience, in plain
        language.
      </p>
      <h2>How {SITE.name} makes money</h2>
      <p>
        Advertising, affiliate partnerships, sponsored articles (always labelled), newsletter
        sponsorships and premium resources. Revenue keeps the lights on; it does not decide what
        we recommend.
      </p>
    </StaticPage>
  );
}
