import Link from "next/link";

import { cn } from "@/lib/utils";

export type ProofItem = {
  label: string;
  value: string;
  href?: string;
};

export type PortfolioProofStripProps = {
  items: ProofItem[];
};

export function PortfolioProofStrip({ items }: PortfolioProofStripProps) {
  return (
    <div
      aria-label="Portfolio proof points"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => {
        const content = (
          <>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              {item.label}
            </span>
            <span className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">
              {item.value}
            </span>
          </>
        );

        const baseClasses =
          "flex h-full min-h-28 flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm shadow-zinc-950/[0.03] transition-colors hover:border-teal-300 hover:bg-teal-50/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20 dark:hover:border-teal-800 dark:hover:bg-teal-950/20";

        return item.href ? (
          <Link className={cn(baseClasses)} href={item.href} key={item.label}>
            {content}
          </Link>
        ) : (
          <div className={baseClasses} key={item.label}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
