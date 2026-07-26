"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { MobileNav } from "@/components/site/mobile-nav";
import { useActiveSection } from "@/components/site/section-observer";
import { publicNavItems } from "@/components/site/site-navigation";

type SiteHeaderProps = {
  siteName?: string;
};

export function SiteHeader({ siteName = "Omer Portnoy" }: SiteHeaderProps) {
  const sectionIds = React.useMemo(
    () => publicNavItems.filter((item) => item.href.includes("#")).map((item) => item.id),
    [],
  );
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = React.useState(false);
  const activeSection = useActiveSection(sectionIds, pathname === "/");

  React.useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }

    const frame = window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function isActive(item: (typeof publicNavItems)[number]) {
    if (item.href === "/cv") return pathname === "/cv";
    if (item.id === "work" && pathname.startsWith("/projects")) return true;
    return pathname === "/" && activeSection === item.id;
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-ink/15 bg-paper/94 shadow-[0_12px_36px_rgba(29,30,27,0.06)] backdrop-blur-xl"
          : "border-ink/10 bg-background/88 backdrop-blur-lg"
      }`}
    >
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-night-text"
        href="#main-content"
      >
        Skip to main content
      </a>
      <div className="page-shell flex min-h-[var(--header-height)] items-center justify-between gap-6">
        <Link
          aria-label={`${siteName}, home`}
          className="group flex min-h-11 items-center gap-3 outline-none"
          href="/"
        >
          <span className="display-serif grid size-9 place-items-center rounded-full border border-ink/25 text-[1.05rem] italic transition-[color,border-color,transform] duration-300 group-hover:-rotate-6 group-hover:border-signal group-hover:text-signal group-focus-visible:border-cobalt">
            OP
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold tracking-[-0.02em] text-ink">
              {siteName}
            </span>
            <span className="technical-label mt-0.5 block text-[0.58rem] text-muted">
              Software engineer
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {publicNavItems.map((item) => {
            const active = isActive(item);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 items-center px-3 text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:bg-signal after:transition-transform after:duration-300 ${
                  active
                    ? "text-ink after:scale-x-100"
                    : "text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100"
                }`}
                href={item.href}
                key={item.id}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="group hidden min-h-11 items-center gap-2 border border-ink bg-ink px-4 text-sm font-semibold text-night-text transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-signal active:translate-y-0 lg:inline-flex"
            href="/#contact"
          >
            Let&apos;s talk
            <ArrowUpRight
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              size={16}
            />
          </Link>
          <MobileNav activeSection={activeSection} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
