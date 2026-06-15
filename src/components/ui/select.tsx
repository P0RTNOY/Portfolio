import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = React.ComponentProps<"select">;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex min-h-11 w-full cursor-pointer appearance-none rounded-md border border-zinc-200 bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.5rem_center] bg-no-repeat px-3 pr-8 py-2 text-base text-zinc-950 shadow-sm shadow-zinc-950/[0.02] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus-visible:outline-white sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}
