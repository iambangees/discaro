import type { ReactNode } from "react";

export default function StaticPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-ink">{title}</h1>
      {intro && <p className="mt-3 text-base leading-relaxed text-ink-soft">{intro}</p>}
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink-soft [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </main>
  );
}
