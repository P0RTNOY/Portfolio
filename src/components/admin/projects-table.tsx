import Link from "next/link";
import { Pencil } from "lucide-react";

import { DeleteProjectDialog } from "@/components/admin/delete-project-dialog";
import { FeaturedToggle } from "@/components/admin/featured-toggle";
import { StatusSelect } from "@/components/admin/status-select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Project } from "@/lib/projects";

type ProjectsTableProps = {
  projects: Project[];
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <>
      {/* Desktop table */}
      <Card className="hidden overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Project
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-semibold text-zinc-500 dark:text-zinc-400">
                  Featured
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Tech Stack
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Updated
                </th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {projects.map((project) => (
                <tr
                  className="transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40"
                  key={project.id}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-950 dark:text-white">
                        {project.title}
                      </span>
                      <span className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {project.shortDescription}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusSelect
                      projectId={project.id}
                      status={project.status}
                    />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex justify-center">
                      <FeaturedToggle
                        featured={project.featured}
                        projectId={project.id}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <Badge className="text-[11px]" key={tech}>
                          {tech}
                        </Badge>
                      ))}
                      {project.techStack.length > 3 ? (
                        <Badge className="text-[11px]">
                          +{project.techStack.length - 3}
                        </Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                    {formatDate(project.updatedAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                        href={`/admin/projects/${project.id}/edit`}
                      >
                        <Pencil aria-hidden="true" size={14} />
                        Edit
                      </Link>
                      <DeleteProjectDialog
                        projectId={project.id}
                        projectTitle={project.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {projects.map((project) => (
          <Card className="p-4" key={project.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-zinc-950 dark:text-white">
                    {project.title}
                  </h3>
                  <FeaturedToggle
                    featured={project.featured}
                    projectId={project.id}
                  />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {project.shortDescription}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {project.techStack.slice(0, 4).map((tech) => (
                <Badge className="text-[11px]" key={tech}>
                  {tech}
                </Badge>
              ))}
              {project.techStack.length > 4 ? (
                <Badge className="text-[11px]">
                  +{project.techStack.length - 4}
                </Badge>
              ) : null}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <StatusSelect
                projectId={project.id}
                status={project.status}
              />
              <div className="flex items-center gap-1">
                <Link
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                  href={`/admin/projects/${project.id}/edit`}
                >
                  <Pencil aria-hidden="true" size={14} />
                  Edit
                </Link>
                <DeleteProjectDialog
                  projectId={project.id}
                  projectTitle={project.title}
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
              Updated {formatDate(project.updatedAt)}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
