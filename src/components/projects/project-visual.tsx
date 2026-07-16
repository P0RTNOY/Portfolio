import { Layers3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/validations/project";

type ProjectVisualProps = {
  imageUrl?: string | null;
  featured?: boolean;
  role?: string | null;
  status?: ProjectStatus;
  summary?: string | null;
  techStack?: string[];
  title: string;
  className?: string;
};

function safeBackgroundImage(url: string) {
  return `url("${url.replaceAll('"', "%22")}")`;
}

const statusLabels: Record<ProjectStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  completed: "Completed",
  archived: "Archived",
};

export function ProjectVisual({
  imageUrl,
  title,
  className,
  featured,
  role,
  status,
  summary,
  techStack = [],
}: ProjectVisualProps) {
  const stackPreview = techStack.slice(0, 4);

  if (imageUrl) {
    return (
      <div
        aria-label={`${title} thumbnail`}
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-md border border-zinc-200 bg-cover bg-center dark:border-zinc-800",
          className,
        )}
        role="img"
        style={{ backgroundImage: safeBackgroundImage(imageUrl) }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.02),rgba(9,9,11,0.48))]" />
        <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
          {status ? <Badge>{statusLabels[status]}</Badge> : null}
          {featured ? (
            <Badge className="border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
              Featured
            </Badge>
          ) : null}
        </div>
        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-4 text-white backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300/90">
            Project snapshot
          </p>
          <p className="mt-2 text-lg font-semibold leading-tight">{title}</p>
          {role ? <p className="mt-1 text-sm text-white/75">{role}</p> : null}
          {summary ? (
            <p className="mt-3 text-sm leading-6 text-white/80">{summary}</p>
          ) : null}
          {stackPreview.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {stackPreview.map((tech) => (
                <Badge
                  className="border-white/10 bg-white/10 text-white"
                  key={tech}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={`${title} project thumbnail`}
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-md border border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800",
        className,
      )}
      role="img"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.28),transparent_35%),linear-gradient(315deg,rgba(245,158,11,0.26),transparent_36%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.15),transparent_32%)]" />
      <div className="relative flex h-full flex-col gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          {status ? <Badge>{statusLabels[status]}</Badge> : null}
          {featured ? (
            <Badge className="border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
              Featured
            </Badge>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200/80">
            Case study snapshot
          </p>
          <h3 className="max-w-md text-2xl font-bold leading-tight">{title}</h3>
          {role ? <p className="text-sm text-white/75">{role}</p> : null}
        </div>

        {summary ? (
          <p className="max-w-md text-sm leading-6 text-white/80">{summary}</p>
        ) : null}

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                Role
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {role || "Not listed"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                Focus
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {summary ? "Problem-first" : "Shipped work"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                Stack
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {stackPreview.length > 0 ? stackPreview.join(" · ") : "TBD"}
              </p>
            </div>
          </div>
        </div>

        {stackPreview.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {stackPreview.map((tech) => (
              <Badge className="border-white/10 bg-white/10 text-white" key={tech}>
                {tech}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Layers3 aria-hidden="true" size={18} />
            Case-study visual
          </div>
        )}
      </div>
    </div>
  );
}
