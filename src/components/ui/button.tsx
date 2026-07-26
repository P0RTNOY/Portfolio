import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-ink bg-ink text-night-text hover:-translate-y-0.5 hover:border-signal hover:bg-signal active:translate-y-0 focus-visible:outline-cobalt",
        secondary:
          "border border-ink/25 bg-paper text-ink hover:-translate-y-0.5 hover:border-ink hover:bg-paper-strong active:translate-y-0 focus-visible:outline-cobalt",
        ghost:
          "text-muted hover:bg-ink/5 hover:text-ink focus-visible:outline-cobalt",
      },
      size: {
        sm: "min-h-11 px-3 text-sm",
        md: "min-h-11 px-4",
        lg: "min-h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<"a"> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({
  className,
  href,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  if (typeof href === "string" && href.startsWith("/")) {
    return (
      <Link
        className={cn(buttonVariants({ variant, size }), className)}
        href={href}
        {...props}
      />
    );
  }

  return (
    <a
      className={cn(buttonVariants({ variant, size }), className)}
      href={href}
      {...props}
    />
  );
}
