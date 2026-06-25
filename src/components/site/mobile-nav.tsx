"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/projects" },
  { label: "Courses", href: "/courses" },
  { label: "CV", href: "/#cv" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const navId = React.useId();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        aria-controls={navId}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex size-11 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {open ? (
          <X aria-hidden="true" size={20} />
        ) : (
          <Menu aria-hidden="true" size={20} />
        )}
      </button>

      {open ? (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 top-16 z-30 bg-zinc-950/20 backdrop-blur-sm dark:bg-zinc-950/50"
            onClick={() => setOpen(false)}
          />
          <nav
            aria-label="Mobile navigation"
            className="fixed left-0 right-0 top-16 z-40 border-b border-zinc-200 bg-white px-4 py-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
            id={navId}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  className="rounded-md px-3 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
