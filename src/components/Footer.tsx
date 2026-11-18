import Link from "next/link";
import { Compass } from "lucide-react";
import { CATEGORIES, LEGAL_LINKS, SITE } from "@/lib/site";
import CopyrightYear from "@/components/CopyrightYear";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
              <Compass className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xl font-bold tracking-tight">{SITE.name}</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            {SITE.motto}. A global discovery platform for freebies, rewards, technology,
            tutorials, opportunities and honest reviews.
          </p>
        </div>

        <nav aria-label="Categories">
          <p className="text-sm font-semibold tracking-wide text-white/90">Discover</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-white/70 transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="text-sm font-semibold tracking-wide text-white/90">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-white/70 transition-colors hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white/70 transition-colors hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/discover" className="text-white/70 transition-colors hover:text-white">
                Discover
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="text-sm font-semibold tracking-wide text-white/90">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            {LEGAL_LINKS.filter((l) => l.href !== "/about" && l.href !== "/contact").map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/70 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs leading-relaxed text-white/50 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© <CopyrightYear /> {SITE.name}. All rights reserved.</p>
          <p>
            Some links on {SITE.name} are affiliate links. They never change what we say — see our{" "}
            <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-white">
              Affiliate Disclosure
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
