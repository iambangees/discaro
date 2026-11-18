import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles your information.`,
};

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      intro="Last updated: 18 November 2026. This is the launch version of this policy; it will be updated before any feature that collects personal data goes live."
    >
      <h2>What we collect</h2>
      <p>
        {SITE.name} is designed to be read without an account. At launch the site itself stores
        no personal profiles. When the newsletter launches, we will store the email address you
        subscribe with — and nothing else — solely to send that newsletter. When visitor accounts
        arrive in a later phase, this policy will be updated first, before the feature ships.
      </p>
      <h2>Analytics</h2>
      <p>
        We plan to use privacy-respecting aggregate analytics to understand which pages are
        useful. Analytics will never be used to identify individual readers, and we do not sell
        personal data — to anyone, ever.
      </p>
      <h2>Cookies</h2>
      <p>
        The site may use strictly-necessary cookies (for example, to remember a display
        preference). Advertising partners, once enabled, may set their own cookies; their use is
        governed by their own policies, and sponsored content on {SITE.name} is always labelled.
      </p>
      <h2>External links</h2>
      <p>
        Listings link out to official third-party websites. Once you leave {SITE.name}, that
        site's privacy policy applies — check it before submitting personal information anywhere.
      </p>
      <h2>Your choices</h2>
      <p>
        Newsletter emails always include an unsubscribe link. If accounts are introduced, you
        will be able to delete your account and its saved data from within the product.
      </p>
      <h2>Changes</h2>
      <p>
        If this policy changes materially, the new version will be posted here with a fresh date
        before it takes effect.
      </p>
    </StaticPage>
  );
}
