import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-950 shadow-sm shadow-zinc-950/[0.02] transition-colors placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:outline-white sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}
