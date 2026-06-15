import * as React from "react";

import { cn } from "@/lib/utils";

type LabelProps = React.ComponentProps<"label"> & {
  required?: boolean;
};

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-semibold text-zinc-950 dark:text-white",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="ml-0.5 text-red-500">
          *
        </span>
      ) : null}
    </label>
  );
}
