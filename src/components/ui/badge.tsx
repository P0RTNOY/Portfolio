import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span">;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center border border-ink/15 bg-paper px-2.5 font-mono text-[0.68rem] font-semibold text-muted",
        className,
      )}
      {...props}
    />
  );
}
