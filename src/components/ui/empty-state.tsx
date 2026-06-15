import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = React.ComponentProps<"div"> & {
  action?: React.ReactNode;
  description: string;
  icon?: LucideIcon;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  icon: Icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/30",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          <Icon aria-hidden="true" size={24} />
        </div>
      ) : null}
      <h3 className="text-base font-bold text-zinc-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
