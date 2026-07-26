import { ArrowUpRight, GitBranch } from "lucide-react";
import Link from "next/link";

import { getProjectStackPreview, type Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  index?: number;
};

const statusLabels: Record<Project["status"], string> = {
  planned: "Planned",
  "in-progress": "Active build",
  completed: "Completed",
  archived: "Archived",
};

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const stackPreview = getProjectStackPreview(project.techStack, 5);
  const problem =
    project.problemSolved?.replace(/\s+/g, " ").trim() ||
    project.shortDescription;

  return (
    <article className="group relative grid h-full grid-rows-[auto_1fr] overflow-hidden border border-ink/18 bg-paper transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-signal/65 hover:shadow-[0_24px_60px_rgba(29,30,27,0.1)]">
      <div className="paper-grid relative min-h-56 overflow-hidden border-b border-ink/15 p-6">
        <div
          aria-hidden="true"
          className={`absolute rounded-full blur-2xl transition-transform duration-700 group-hover:scale-110 ${
            index % 2 === 0
              ? "-right-6 top-4 size-40 bg-signal/18"
              : "-left-6 bottom-4 size-44 bg-cobalt/18"
          }`}
        />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="technical-label text-signal">
              Project / {String(index + 1).padStart(2, "0")}
            </span>
            <span className="border border-ink/15 bg-paper/80 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
              {statusLabels[project.status]}
            </span>
          </div>
          <div className="mt-12">
            <span className="display-serif text-7xl italic leading-none text-ink/12">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-5 max-w-sm text-sm font-medium leading-6 text-ink-soft">
              {project.role || "Software engineer"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-7">
        <h2 className="text-2xl font-semibold tracking-[-0.045em] text-ink sm:text-3xl">
          <Link
            className="outline-none after:absolute after:inset-0"
            href={`/projects/${project.slug}`}
          >
            {project.title}
          </Link>
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">
          {project.shortDescription}
        </p>
        <div className="mt-6 border-l border-signal/45 pl-4">
          <p className="technical-label text-[0.58rem] text-muted">Problem</p>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">
            {problem}
          </p>
        </div>
        {stackPreview.length > 0 ? (
          <ul
            aria-label={`${project.title} technology stack`}
            className="mt-6 flex flex-wrap gap-2"
          >
            {stackPreview.map((technology) => (
              <li
                className="border border-ink/14 px-2.5 py-1.5 font-mono text-[0.64rem] text-muted"
                key={technology}
              >
                {technology}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="relative z-10 mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/14 pt-5">
          <Link
            className="group/link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-signal"
            href={`/projects/${project.slug}`}
          >
            Read case study
            <ArrowUpRight
              aria-hidden="true"
              className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              size={16}
            />
          </Link>
          {project.githubUrl ? (
            <a
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
              href={project.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <GitBranch aria-hidden="true" size={15} />
              GitHub
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
