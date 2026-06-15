"use client";

import * as React from "react";
import { CheckCircle2, X } from "lucide-react";

type ToastProps = {
  message: string;
  onDismiss: () => void;
};

export function Toast({ message, onDismiss }: ToastProps) {
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  function handleAnimationEnd() {
    if (exiting) {
      onDismiss();
    }
  }

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-6 sm:left-auto sm:right-6"
      role="status"
    >
      <div
        className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-lg shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950/50 sm:w-auto sm:max-w-md"
        onAnimationEnd={handleAnimationEnd}
        style={{
          animation: exiting
            ? "toast-slide-out 200ms ease-in forwards"
            : "toast-slide-in 250ms ease-out",
        }}
      >
        <CheckCircle2
          aria-hidden="true"
          className="shrink-0 text-emerald-600 dark:text-emerald-400"
          size={18}
        />
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {message}
        </p>
        <button
          aria-label="Dismiss notification"
          className="ml-auto flex size-11 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 dark:focus-visible:outline-white"
          onClick={() => setExiting(true)}
          type="button"
        >
          <X aria-hidden="true" size={14} />
        </button>
      </div>
    </div>
  );
}
