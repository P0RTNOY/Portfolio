import { ArrowUpRight, GitBranch } from "lucide-react";
import Link from "next/link";

import { ProjectVisual } from "@/components/projects/project-visual";
import { StatusBadge } from "@/components/projects/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectStackPreview, type Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const stackPreview = getProjectStackPreview(project.techStack, 4);
  const problemSolved =
    project.problemSolved?.replace(/\s+/g, " ").trim() ||
    project.shortDescription;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-colors duration-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-950/5 motion-safe:transition-transform motion-safe:hover:-translate-y-1 dark:hover:border-zinc-700 dark:hover:shadow-black/20">
      <ProjectVisual
        featured={project.featured}
        imageUrl={project.imageUrl}
        role={project.role}
        status={project.status}
        summary={project.shortDescription}
        techStack={stackPreview}
        title={project.title}
      />
      <CardContent className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} />
          {project.featured ? (
            <Badge className="border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
              Featured
            </Badge>
          ) : null}
        </div>

        <div>
          <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
            <Link
              className="outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-500"
              href={`/projects/${project.slug}`}
            >
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {project.role || "Role not listed"}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300 line-clamp-4">
            {problemSolved}
          </p>
        </div>

        {stackPreview.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
              Stack
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {stackPreview.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:text-white"
            href={`/projects/${project.slug}`}
          >
            Read case study
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          {project.githubUrl ? (
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:text-white"
              href={project.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <GitBranch aria-hidden="true" size={16} />
              GitHub
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:text-white"
              href={project.liveUrl}
              rel="noreferrer"
              target="_blank"
            >
              Live
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
