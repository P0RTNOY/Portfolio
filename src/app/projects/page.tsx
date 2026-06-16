import type { Metadata } from "next";

import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | Generic Portfolio",
  description: "Browse database-backed portfolio projects.",
};

export default async function ProjectsPage() {
  const projects = await listProjects();
  const featuredCount = projects.filter((project) => project.featured).length;
  const completedCount = projects.filter(
    (project) => project.status === "completed",
  ).length;

  return (
    <ProjectPageShell>
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Projects"
            title="Database-backed project library."
            description="These entries come from Supabase Postgres and can be edited from the admin dashboard."
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
