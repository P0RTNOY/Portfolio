import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Generic portfolio. Placeholder content for now.</p>
        <div className="flex gap-4">
          <Link className="hover:text-zinc-950 dark:hover:text-white" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-zinc-950 dark:hover:text-white" href="/#contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
