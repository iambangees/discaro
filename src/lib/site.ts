/*
  Discaro site configuration — single source of truth for brand strings,
  navigation and the six content categories (Blueprint §2).
  Content itself is database-driven from Phase 2 onward; nothing here
  is article or opportunity data.
*/

export const SITE = {
  /** Canonical site URL (override with NEXT_PUBLIC_SITE_URL). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://discaro.vercel.app",
  name: "Discaro",
  motto: "Discover what's worth knowing",
  description:
    "Discaro is a global discovery platform for useful freebies, rewards, technology, tutorials, opportunities and honest reviews — every listing checked by a person.",
  // Pre-launch: no public contact address exists yet (see /contact).
} as const;

export type Category = {
  dbId?: string;
  slug: string;
  name: string;
  blurb: string;
  longBlurb: string;
  phase: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "freebies",
    name: "Freebies",
    blurb: "Free software, resources, trials and giveaways.",
    longBlurb:
      " genuinely free software, resources, trials and giveaways — with the catch, if there is one, stated up front.",
    phase: "Content arrives with the publishing system in Phase 2.",
  },
  {
    slug: "rewards",
    name: "Rewards",
    blurb: "Cashback, referral programmes and earning platforms.",
    longBlurb:
      " cashback offers, referral programmes and earning platforms, with realistic numbers instead of hype.",
    phase: "Content arrives with the publishing system in Phase 2.",
  },
  {
    slug: "technology",
    name: "Technology",
    blurb: "Apps, AI tools, software and digital services.",
    longBlurb:
      " apps, AI tools, software and digital services worth your time — explained plainly, without the marketing gloss.",
    phase: "Content arrives with the publishing system in Phase 2.",
  },
  {
    slug: "tutorials",
    name: "Tutorials",
    blurb: "Step-by-step guides and technology explanations.",
    longBlurb:
      " step-by-step guides and clear technology explanations that assume intelligence, not prior knowledge.",
    phase: "Content arrives with the publishing system in Phase 2.",
  },
  {
    slug: "opportunities",
    name: "Opportunities",
    blurb: "Remote opportunities, campaigns and online programmes.",
    longBlurb:
      " remote opportunities, campaigns and online programmes — each with eligibility, requirements, rewards and an expiry date, verified by a person.",
    phase: "The full directory, with filters and eligibility, arrives in Phase 3.",
  },
  {
    slug: "reviews",
    name: "Reviews",
    blurb: "Honest platform reviews and comparisons.",
    longBlurb:
      " honest platform reviews and comparisons. Sponsored and affiliate content is always labelled — see our Affiliate Disclosure.",
    phase: "Content arrives with the publishing system in Phase 2.",
  },
];

export const NAV_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/freebies", label: "Freebies" },
  { href: "/rewards", label: "Rewards" },
  { href: "/technology", label: "Technology" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/reviews", label: "Reviews" },
] as const;

export const LEGAL_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
] as const;

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
