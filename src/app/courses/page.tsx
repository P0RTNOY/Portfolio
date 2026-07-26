import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { CoursesGrid } from "@/components/courses/courses-grid";
import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { getPublicPortfolioData } from "@/lib/public-portfolio-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning",
  description:
    "A transparent learning timeline for Omer Portnoy covering applied AI, software security, and computer science practice.",
};

export default async function CoursesPage() {
  const { courses, settings } = await getPublicPortfolioData();
  const inProgressCount = courses.filter(
    (course) => course.status === "in-progress",
  ).length;

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
              <p className="technical-label text-signal">Learning timeline</p>
              <p className="mt-6 text-sm text-muted">
                {courses.length} records · {inProgressCount} active
              </p>
            </div>
            <div>
              <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-ink sm:text-7xl lg:text-[6.5rem]">
                Progress, recorded{" "}
                <span className="display-serif italic text-signal">
                  without overclaiming.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                These entries document active study and completed learning. They
                show subject matter, current status, and authored focus—never a
                claim of proficiency based on enrollment alone.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell py-14 sm:py-20 lg:py-24">
        <CoursesGrid courses={courses} />
      </section>
    </ProjectPageShell>
  );
}
