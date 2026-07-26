import { ArrowUpRight, GitBranch } from "lucide-react";
import Link from "next/link";

import { getProjectStackPreview, type Project } from "@/lib/projects";

type FeaturedProjectsProps = {
  projects: Project[];
};

function statusLabel(status: Project["status"]) {
  switch (status) {
    case "in-progress":
      return "Active build";
    case "completed":
      return "Completed";
    case "planned":
      return "In planning";
    case "archived":
      return "Archive";
  }
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {projects.map((project, index) => {
        const stack = getProjectStackPreview(project.techStack, 6);

        return (
          <article
            className="reveal-on-scroll group overflow-hidden border border-white/14 bg-night-soft"
            key={project.id}
          >
            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              <div
                className={`project-grid relative isolate flex min-h-72 overflow-hidden border-b border-white/12 p-6 sm:min-h-96 sm:p-9 lg:min-h-[34rem] lg:border-b-0 ${
                  index % 2 === 1 ? "lg:order-2 lg:border-l" : "lg:border-r"
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`absolute rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110 ${
                    index % 2 === 0
                      ? "-right-10 top-14 size-64 bg-signal/24"
                      : "-left-10 bottom-8 size-72 bg-cobalt/24"
                  }`}
                />
                <div
                  aria-hidden="true"
                  className={`absolute border border-white/16 transition-transform duration-700 ${
                    index % 2 === 0
                      ? "right-[12%] top-[18%] h-[54%] w-[58%] rotate-3 group-hover:rotate-0"
                      : "bottom-[14%] left-[14%] size-56 -rotate-6 rounded-full group-hover:rotate-0"
                  }`}
                />
                <div className="relative mt-auto w-full">
                  <div className="flex items-end justify-between gap-4 border-b border-white/16 pb-5">
                    <span className="display-serif text-[5rem] leading-none italic text-white/12 sm:text-[8rem]">
                      0{index + 1}
                    </span>
                    <span className="technical-label mb-2 text-night-muted">
                      {statusLabel(project.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-5 text-xs text-night-muted">
                    <div>
                      <span className="technical-label block text-[0.58rem] text-white/45">
                        Discipline
                      </span>
                      <span className="mt-2 block text-night-text">
                        {index % 2 === 0
                          ? "Full-stack product"
                          : "Applied AI prototype"}
                      </span>
                    </div>
                    <div>
                      <span className="technical-label block text-[0.58rem] text-white/45">
                        Role
                      </span>
                      <span className="mt-2 block text-night-text">
                        {project.role || "Software engineer"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col p-6 sm:p-9 lg:p-12 ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="technical-label text-[#ef8b67]">
                    Selected work / 0{index + 1}
                  </span>
                  {project.featured ? (
                    <span className="border border-white/14 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-night-muted">
                      Featured
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-8 text-3xl font-semibold tracking-[-0.045em] text-night-text sm:text-4xl lg:text-5xl">
                  {project.title}
                </h3>
                <p className="mt-5 max-w-2xl text-base leading-7 text-night-muted sm:text-lg sm:leading-8">
                  {project.shortDescription}
                </p>

                <div className="mt-8 border-l border-[#ef8b67]/55 pl-5">
                  <p className="technical-label text-white/45">The problem</p>
                  <p className="mt-3 line-clamp-4 text-sm leading-7 text-night-text/90">
                    {project.problemSolved || project.shortDescription}
                  </p>
                </div>

                {stack.length > 0 ? (
                  <ul
                    aria-label={`${project.title} technology stack`}
                    className="mt-8 flex flex-wrap gap-2"
                  >
                    {stack.map((technology) => (
                      <li
                        className="border border-white/14 px-3 py-2 font-mono text-[0.68rem] text-night-muted"
                        key={technology}
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 border-t border-white/12 pt-7">
                  <Link
                    className="group/link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-night-text transition-colors hover:text-[#ef8b67]"
                    href={`/projects/${project.slug}`}
                  >
                    Read case study
                    <ArrowUpRight
                      aria-hidden="true"
                      className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      size={17}
                    />
                  </Link>
                  {project.githubUrl ? (
                    <a
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-night-muted transition-colors hover:text-night-text"
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
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-night-muted transition-colors hover:text-night-text"
                      href={project.liveUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Live product
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
