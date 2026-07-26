import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ProjectsGrid } from "@/components/projects/projects-grid";
import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { getPublicPortfolioData } from "@/lib/public-portfolio-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering case studies covering full-stack products, backend systems, AI prototypes, and automation work by Omer Portnoy.",
};

export default async function ProjectsPage() {
  const { projects, settings } = await getPublicPortfolioData();
  const completedCount = projects.filter(
    (project) => project.status === "completed",
  ).length;
  const activeCount = projects.filter(
    (project) => project.status === "in-progress",
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
            href="/#work"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to portfolio
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <div>
              <p className="technical-label text-signal">Project archive</p>
              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted">
                <span>{projects.length} documented</span>
                <span>{activeCount} active</span>
                <span>{completedCount} completed</span>
              </div>
            </div>
            <div>
              <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-ink sm:text-7xl lg:text-[6.5rem]">
                Engineering work,{" "}
                <span className="display-serif italic text-signal">
                  decision by decision.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Each case study starts with a real product constraint, then shows
                the role, architecture, implementation decisions, current
                evidence, and what remains unfinished.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-14 sm:py-20 lg:py-24">
        <ProjectsGrid projects={projects} />
      </section>
    </ProjectPageShell>
  );
}
