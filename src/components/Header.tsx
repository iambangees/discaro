"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Menu, Search, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";
import AccountNav from "@/components/AccountNav";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} — home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <Compass className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-none">
            <span className="block text-xl font-bold tracking-tight text-ink">{SITE.name}</span>
            <span className="mt-0.5 hidden text-[11px] font-medium text-muted sm:block">
              {SITE.motto}
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-deep"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/search"
            aria-label="Search Discaro"
            className="ml-1 rounded-lg p-2 text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-deep"
          >
            <Search className="h-5 w-5" aria-hidden />
          </Link>
          <AccountNav />
          <Link
            href="/opportunities"
            className="ml-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Find opportunities
          </Link>
        </nav>

        <button
          type="button"
          className="ml-auto rounded-lg border border-line p-2 text-ink lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-4 py-3 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-accent-soft"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-accent-soft"
                onClick={() => setOpen(false)}
              >
                Search
              </Link>
            </li>
            <AccountNav mobile />
          </ul>
        </nav>
      )}
    </header>
  );
}
