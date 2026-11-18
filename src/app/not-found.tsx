import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep">
        <Compass className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink">This page wandered off</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
        The page you're looking for doesn't exist (or hasn't been built yet). Everything we have
        published lives one click away.
      </p>
      <Link
        href="/discover"
        className="mt-8 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
      >
        Start discovering
      </Link>
    </main>
  );
}
