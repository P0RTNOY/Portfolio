import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MobileNav } from "@/components/site/mobile-nav";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/projects" },
  { label: "Courses", href: "/courses" },
  { label: "CV", href: "/#cv" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

type SiteHeaderProps = {
  siteName?: string;
};

export function SiteHeader({ siteName = "Portfolio" }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-background/90 backdrop-blur dark:border-zinc-800/80">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-zinc-950"
        href="#main-content"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="text-sm font-bold tracking-wide text-zinc-950 dark:text-white"
          href="/"
        >
          {siteName}
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ButtonLink
            className="hidden md:inline-flex"
            href="/#contact"
            size="sm"
            variant="secondary"
          >
            Contact
            <ArrowRight aria-hidden="true" size={16} />
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
