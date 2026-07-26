import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type SiteFooterProps = {
  siteName?: string;
  contactEmail?: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
};

export function SiteFooter({
  siteName = "Omer Portnoy",
  contactEmail = "omerportnoy@gmail.com",
  githubUrl = "https://github.com/P0RTNOY",
  linkedinUrl,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/12 bg-night text-night-text">
      <div className="page-shell py-10 sm:py-12">
        <div className="grid gap-8 border-b border-white/12 pb-9 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="technical-label text-night-muted">Omer Portnoy / 2026</p>
            <p className="mt-3 max-w-xl text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
              Engineering practical products across full-stack systems and AI.
            </p>
          </div>
          <a
            className="group flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-night-text transition-colors hover:text-[#ef8b67]"
            href={`mailto:${contactEmail}`}
          >
            {contactEmail}
            <ArrowUpRight
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              size={16}
            />
          </a>
        </div>
        <div className="flex flex-col gap-5 pt-7 text-sm text-night-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {siteName}. Designed and engineered with intent.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link className="transition-colors hover:text-night-text" href="/projects">
              Projects
            </Link>
            <Link className="transition-colors hover:text-night-text" href="/courses">
              Learning
            </Link>
            <Link className="transition-colors hover:text-night-text" href="/cv">
              CV
            </Link>
            {githubUrl ? (
              <a
                className="transition-colors hover:text-night-text"
                href={githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            ) : null}
            {linkedinUrl ? (
              <a
                className="transition-colors hover:text-night-text"
                href={linkedinUrl}
                rel="noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
