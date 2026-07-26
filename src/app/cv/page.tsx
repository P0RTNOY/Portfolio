import type { Metadata } from "next";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { ResumeViewer } from "@/components/site/resume-viewer";
import {
  CV_FOCUS_AREAS,
  CV_METADATA_DESCRIPTION,
  getCvPageCopy,
} from "@/lib/cv-copy";
import { getPublicPortfolioData } from "@/lib/public-portfolio-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CV",
  description: CV_METADATA_DESCRIPTION,
};

export default async function CvPage() {
  const { settings } = await getPublicPortfolioData();
  const cvPageCopy = getCvPageCopy(Boolean(settings.resumeUrl));

  return (
    <ProjectPageShell
      contactEmail={settings.contactEmail}
      githubUrl={settings.githubUrl}
      linkedinUrl={settings.linkedinUrl}
      siteName={settings.siteName}
    >
      <section className="border-b border-ink/20 bg-paper">
        <div className="page-shell py-14 sm:py-20 lg:py-24">
          <Link
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
            href="/#experience"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to portfolio
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <div>
              <p className="technical-label text-signal">Candidate overview</p>
              {settings.resumeUrl ? (
                <a
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-signal"
                  href="/api/cv/download"
                >
                  <Download aria-hidden="true" size={16} />
                  Download PDF
                </a>
              ) : null}
            </div>
            <div>
              <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-ink sm:text-7xl lg:text-[6.5rem]">
                The background behind{" "}
                <span className="display-serif italic text-signal">
                  the project work.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {cvPageCopy.description}
              </p>
            </div>
          </div>
          <ul className="mt-12 grid border-y border-ink/20 sm:grid-cols-2 lg:grid-cols-5">
            {CV_FOCUS_AREAS.map((focusArea, index) => (
              <li
                className="flex min-h-24 items-center gap-3 border-b border-ink/14 px-4 py-4 text-sm font-semibold text-ink sm:border-r lg:border-b-0"
                key={focusArea}
              >
                <span className="technical-label text-signal">
                  0{index + 1}
                </span>
                {focusArea}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-18">
        <ResumeViewer resumeUrl={settings.resumeUrl} />
      </section>
    </ProjectPageShell>
  );
}
