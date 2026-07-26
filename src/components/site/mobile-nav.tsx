"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { publicNavItems } from "@/components/site/site-navigation";

type MobileNavProps = {
  activeSection?: string;
  pathname?: string;
};

export function MobileNav({
  activeSection = "",
  pathname = "/",
}: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const navId = React.useId();
  const panelRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    first?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  function isActive(item: (typeof publicNavItems)[number]) {
    if (item.href === "/cv") return pathname === "/cv";
    if (item.id === "work" && pathname.startsWith("/projects")) return true;
    return pathname === "/" && activeSection === item.id;
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        aria-controls={navId}
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="grid size-11 place-items-center border border-ink/20 text-ink transition-colors duration-200 hover:border-signal hover:text-signal"
        onClick={() => setOpen((current) => !current)}
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
          <button
            aria-label="Close navigation"
            className="fixed inset-0 top-[var(--header-height)] z-40 cursor-default bg-ink/35 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            type="button"
          />
          <nav
            ref={panelRef}
            aria-label="Mobile navigation"
            className="fixed inset-x-0 top-[var(--header-height)] z-50 overscroll-contain border-b border-ink/15 bg-paper shadow-[0_24px_60px_rgba(29,30,27,0.14)]"
            id={navId}
          >
            <div className="page-shell py-5">
              <p className="technical-label mb-4 text-muted">Navigate</p>
              <div className="divide-y divide-ink/10 border-y border-ink/15">
                {publicNavItems.map((item, index) => {
                  const active = isActive(item);

                  return (
                    <Link
                      aria-current={active ? "page" : undefined}
                      className="group flex min-h-15 items-center justify-between py-3 text-lg font-semibold tracking-[-0.02em] text-ink"
                      href={item.href}
                      key={item.id}
                      onClick={() => setOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="technical-label w-6 text-[0.58rem] text-muted">
                          0{index + 1}
                        </span>
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-px transition-[width,background-color] duration-300 ${
                          active
                            ? "w-8 bg-signal"
                            : "w-4 bg-ink/25 group-hover:w-8 group-hover:bg-signal"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
              <Link
                className="mt-5 flex min-h-12 items-center justify-between bg-ink px-4 font-semibold text-night-text"
                href="/#contact"
                onClick={() => setOpen(false)}
              >
                Start a conversation
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
