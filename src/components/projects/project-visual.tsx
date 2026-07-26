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
  variant?: "card" | "detail";
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
  variant = "card",
}: ProjectVisualProps) {
  const stackPreview = techStack.slice(0, 4);

  return (
    <figure
      aria-hidden={variant === "card" && !imageUrl ? true : undefined}
      className={cn(
        "overflow-hidden rounded-md border border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800",
        className,
      )}
    >
      <div
        aria-hidden={imageUrl ? undefined : true}
        aria-label={imageUrl ? `${title} project image` : undefined}
        className={cn(
          "relative isolate aspect-[16/9] min-h-36 overflow-hidden bg-zinc-900",
          imageUrl ? "bg-cover bg-center" : null,
        )}
        role={imageUrl ? "img" : undefined}
        style={
          imageUrl ? { backgroundImage: safeBackgroundImage(imageUrl) } : undefined
        }
      >
        {imageUrl ? (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.04),rgba(9,9,11,0.58))]" />
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.28),transparent_35%),linear-gradient(315deg,rgba(245,158,11,0.26),transparent_36%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:18px_18px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.15),transparent_32%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Layers3 size={32} />
              </span>
            </div>
          </>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-x-4 top-4 flex flex-wrap gap-2"
        >
          {status ? <Badge>{statusLabels[status]}</Badge> : null}
          {featured ? (
            <Badge className="border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
              Featured
            </Badge>
          ) : null}
        </div>
      </div>

      {variant === "detail" ? (
        <figcaption className="space-y-4 p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200/80">
              Project snapshot
            </p>
            <p className="mt-2 break-words text-xl font-bold leading-tight sm:text-2xl">
              {title}
            </p>
            {role ? (
              <p className="mt-2 break-words text-sm leading-6 text-white/75">
                {role}
              </p>
            ) : null}
          </div>

          {summary ? (
            <p className="break-words text-sm leading-6 text-white/80">
              {summary}
            </p>
          ) : null}

          {stackPreview.length > 0 ? (
            <div className="flex flex-wrap gap-2" aria-label="Technology stack">
              {stackPreview.map((tech) => (
                <Badge
                  className="min-w-0 max-w-full break-all whitespace-normal border-white/10 bg-white/10 text-left text-white"
                  key={tech}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
