"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type DialogProps = {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function Dialog({ children, onClose, open, title }: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else {
      dialog.close();
      previousFocusRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(e: Event) {
      e.preventDefault();
      onClose();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "w-full max-w-md rounded-xl border border-zinc-200 bg-white p-0 shadow-xl shadow-zinc-950/10 backdrop:bg-zinc-950/50 backdrop:backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950/50",
        "animate-[dialog-fade-in_200ms_ease-out]",
        "backdrop:animate-[dialog-backdrop-in_200ms_ease-out]",
      )}
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
          {title}
        </h2>
        <button
          aria-label="Close dialog"
          className="flex size-11 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white dark:focus-visible:outline-white"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  );
}
