import { GraduationCap } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type CourseVisualProps = {
  className?: string;
  imageUrl?: string | null;
  featured?: boolean;
  progress?: number;
  stageLabel?: string;
  status?: "planned" | "in-progress" | "completed" | "archived";
};

const statusCopy: Record<
  NonNullable<CourseVisualProps["status"]>,
  string
> = {
  planned: "Planned",
  "in-progress": "In progress",
  completed: "Completed",
  archived: "Archived",
};

export function CourseVisual({
  className,
  featured = false,
  imageUrl,
  progress = 0,
  stageLabel,
  status = "planned",
}: CourseVisualProps) {
  const statusText = statusCopy[status];

  if (imageUrl) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "relative aspect-[16/10] overflow-hidden border border-ink/18",
          className,
        )}
      >
        <Image
          alt=""
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          src={imageUrl}
          unoptimized
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.08),rgba(9,9,11,0.65))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {featured ? (
            <span className="rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-900 shadow-sm">
              Featured
            </span>
          ) : null}
          <span className="rounded-full border border-white/20 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
            {statusText}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 border border-white/10 bg-night/75 p-4 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-zinc-300">
            <span>{stageLabel ?? "Learning track"}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#ef8b67]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "project-grid relative flex aspect-[16/10] items-center justify-center overflow-hidden border border-ink/18 bg-night text-white",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(201,79,40,0.3),transparent_38%),linear-gradient(315deg,rgba(40,89,168,0.24),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        {featured ? (
          <span className="rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-900 shadow-sm">
            Featured
          </span>
        ) : null}
        <span className="rounded-full border border-white/20 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
          {statusText}
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-zinc-200">
          <span>{stageLabel ?? "Learning track"}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#ef8b67]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="relative hidden size-14 items-center justify-center rounded-lg border border-white/20 bg-white/10 sm:flex">
        <GraduationCap aria-hidden="true" size={24} />
      </div>
    </div>
  );
}
