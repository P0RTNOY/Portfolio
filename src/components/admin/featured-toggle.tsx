"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { toggleFeaturedAction } from "@/app/admin/(protected)/projects/actions";
import { cn } from "@/lib/utils";

type FeaturedToggleProps = {
  featured: boolean;
  projectId: string;
};

export function FeaturedToggle({ featured, projectId }: FeaturedToggleProps) {
  const [optimistic, setOptimistic] = React.useState(featured);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleToggle() {
    const next = !optimistic;
    setOptimistic(next);
    setPending(true);
    setError(null);

    try {
      const result = await toggleFeaturedAction(projectId, next);
      if (result.error) {
        setOptimistic(!next);
        setError(result.error);
      }
    } catch {
      setOptimistic(!next);
      setError("Featured status could not be updated.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      aria-label={optimistic ? "Unmark as featured" : "Mark as featured"}
      aria-pressed={optimistic}
      className={cn(
        "flex size-11 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-white",
        optimistic
          ? "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
          : "text-zinc-300 hover:text-zinc-400 dark:text-zinc-600 dark:hover:text-zinc-500",
        pending && "pointer-events-none opacity-60",
      )}
      disabled={pending}
      onClick={handleToggle}
      type="button"
    >
      <Star
        aria-hidden="true"
        className={cn(optimistic && "fill-current")}
        size={18}
      />
      {error ? (
        <span className="sr-only" role="alert">
          {error}
        </span>
      ) : null}
    </button>
  );
}
