"use client";

import { RotateCcw } from "lucide-react";
import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Public portfolio render failed.", error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 py-16">
      <section className="w-full max-w-2xl border border-ink/20 bg-paper p-7 sm:p-10">
        <p className="technical-label text-signal">Something interrupted the page</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
          The portfolio could not finish loading.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted">
          Try the page again. If the issue continues, the project source and
          contact details are still available through GitHub.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="inline-flex min-h-12 items-center gap-2 bg-ink px-5 text-sm font-semibold text-night-text transition-colors hover:bg-signal"
            onClick={reset}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={17} />
            Try again
          </button>
          <a
            className="inline-flex min-h-12 items-center border border-ink/25 px-5 text-sm font-semibold text-ink"
            href="https://github.com/P0RTNOY"
            rel="noreferrer"
            target="_blank"
          >
            Visit GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
