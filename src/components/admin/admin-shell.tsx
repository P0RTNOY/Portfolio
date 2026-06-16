"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminToastHandler } from "@/components/admin/admin-toast-handler";
import { LogoutButton } from "@/components/admin/logout-button";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
};

const adminNavItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/settings", label: "Site content" },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-zinc-100/70 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <Link
              className="text-sm font-bold tracking-wide text-zinc-950 dark:text-white"
              href="/admin"
            >
              Portfolio Admin
            </Link>
            <p className="hidden text-xs text-zinc-500 sm:block">
              Manage project content and publishing state.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="hidden min-h-10 items-center rounded-md px-3 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white sm:inline-flex"
              href="/"
            >
              View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <nav
            aria-label="Admin navigation"
            className="flex gap-2 overflow-x-auto rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950 lg:flex-col"
          >
            {adminNavItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  className={cn(
                    "min-h-11 shrink-0 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500",
                    isActive
                      ? "bg-zinc-100 font-bold text-zinc-950 dark:bg-zinc-900 dark:text-white"
                      : "font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900/50 dark:hover:text-white",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
      <React.Suspense>
        <AdminToastHandler />
      </React.Suspense>
    </div>
  );
}
