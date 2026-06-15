import { FolderKanban, Plus } from "lucide-react";

import { ProjectsTable } from "@/components/admin/projects-table";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { listProjects } from "@/lib/projects";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Projects
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {projects.length === 0
              ? "No projects yet. Create your first one."
              : `${projects.length} project${projects.length === 1 ? "" : "s"} total`}
          </p>
        </div>
        <ButtonLink href="/admin/projects/new" size="md">
          <Plus aria-hidden="true" size={18} />
          New project
        </ButtonLink>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          action={
            <ButtonLink href="/admin/projects/new">
              <Plus aria-hidden="true" size={18} />
              Create your first project
            </ButtonLink>
          }
          description="Projects you create here will appear on your public portfolio. Start by adding your first project."
          icon={FolderKanban}
          title="No projects yet"
        />
      ) : (
        <ProjectsTable projects={projects} />
      )}
    </div>
  );
}
