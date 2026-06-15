"use client";

import * as React from "react";

import { updateStatusAction } from "@/app/admin/(protected)/projects/actions";
import { Select } from "@/components/ui/select";
import type { ProjectStatus } from "@/lib/validations/project";
import { projectStatusValues } from "@/lib/validations/project";

type StatusSelectProps = {
  projectId: string;
  status: ProjectStatus;
};

const statusLabels: Record<ProjectStatus, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
};

export function StatusSelect({ projectId, status }: StatusSelectProps) {
  const [pending, setPending] = React.useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setPending(true);

    try {
      await updateStatusAction(projectId, next);
    } catch {
      // Server-side revalidation will reset to correct value
    } finally {
      setPending(false);
    }
  }

  return (
    <Select
      aria-label="Project status"
      className={pending ? "pointer-events-none opacity-60" : ""}
      defaultValue={status}
      disabled={pending}
      onChange={handleChange}
    >
      {projectStatusValues.map((value) => (
        <option key={value} value={value}>
          {statusLabels[value]}
        </option>
      ))}
    </Select>
  );
}
