import { CheckCircle2, CircleDot, Clock3, Archive } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/validations/project";

const statusConfig = {
  planned: {
    label: "Planned",
    icon: Clock3,
    className:
      "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200",
  },
  "in-progress": {
    label: "In progress",
    icon: CircleDot,
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
  },
} satisfies Record<ProjectStatus, { label: string; icon: typeof Clock3; className: string }>;

type StatusBadgeProps = {
  status: ProjectStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1.5", config.className, className)}>
      <Icon aria-hidden="true" size={14} />
      {config.label}
    </Badge>
  );
}
