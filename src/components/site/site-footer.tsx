import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
            Generic Portfolio
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {currentYear} &mdash; Built with Next.js & Tailwind CSS
          </p>
        </div>
        <div className="flex gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <Link
            className="transition-colors hover:text-zinc-950 dark:hover:text-white"
            href="/projects"
          >
            Projects
          </Link>
          <Link
            className="transition-colors hover:text-zinc-950 dark:hover:text-white"
            href="/#about"
          >
            About
          </Link>
          <Link
            className="transition-colors hover:text-zinc-950 dark:hover:text-white"
            href="/admin"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
