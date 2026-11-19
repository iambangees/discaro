"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

/** Header account slot: sign-in link when out, bookmarks link when in. */
export default function AccountNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  const sb = getBrowserSupabase();

  useEffect(() => {
    if (!sb) return;
    sb.auth.getUser().then(({ data: { user } }) => setSignedIn(!!user));
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => setSignedIn(!!session?.user));
    return () => subscription.unsubscribe();
  }, [pathname, sb]);

  if (!sb) {
    // Accounts not configured — always show the signed-out variant.
    return mobile ? (
      <li>
        <Link
          href="/login"
          className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-accent-soft"
        >
          Sign in
        </Link>
      </li>
    ) : (
      <Link
        href="/login"
        className="ml-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-deep"
      >
        Sign in
      </Link>
    );
  }

  if (signedIn === null) return null;

  if (mobile) {
    return signedIn ? (
      <li>
        <Link
          href="/account"
          className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-accent-soft"
        >
          My bookmarks
        </Link>
      </li>
    ) : (
      <li>
        <Link
          href="/login"
          className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-accent-soft"
        >
          Sign in
        </Link>
      </li>
    );
  }

  return signedIn ? (
    <Link
      href="/account"
      className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-deep"
    >
      <Bookmark className="h-4 w-4" aria-hidden /> My bookmarks
    </Link>
  ) : (
    <Link
      href="/login"
      className="ml-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-deep"
    >
      Sign in
    </Link>
  );
}
