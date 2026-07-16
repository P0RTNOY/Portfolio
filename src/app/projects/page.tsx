import type { Metadata } from "next";

import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { listProjects } from "@/lib/projects";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | Omer Portnoy",
  description:
    "Project case studies for Omer Portnoy's AI, automation, and full-stack software work.",
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    listProjects(),
    getSiteSettings(),
  ]);
  const featuredCount = projects.filter((project) => project.featured).length;
  const completedCount = projects.filter(
    (project) => project.status === "completed",
  ).length;

  return (
    <ProjectPageShell siteName={settings.siteName}>
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Projects"
            title="Project case studies that answer hiring questions."
            description="Start with the role, the problem, and the stack. Then open a project to see the architecture, tradeoffs, implementation decisions, and current evidence."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge>{projects.length} total</Badge>
            <Badge>{featuredCount} featured</Badge>
            <Badge>{completedCount} completed</Badge>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <ProjectsGrid projects={projects} />
      </section>
    </ProjectPageShell>
  );
}
