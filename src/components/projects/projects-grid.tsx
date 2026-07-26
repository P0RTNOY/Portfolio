import { FolderKanban } from "lucide-react";

import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Project } from "@/lib/projects";

type ProjectsGridProps = {
  projects: Project[];
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        description="Published project cards will appear here when content is available."
        icon={FolderKanban}
        title="No published projects yet"
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard index={index} key={project.id} project={project} />
      ))}
    </div>
  );
}
