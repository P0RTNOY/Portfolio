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
  const [value, setValue] = React.useState<ProjectStatus>(status);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ProjectStatus;
    setValue(next);
    setPending(true);
    setError(null);

    try {
      const result = await updateStatusAction(projectId, next);
      if (result.error) {
        setValue(status);
        setError(result.error);
      }
    } catch {
      setValue(status);
      setError("Status could not be updated.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-w-36">
      <Select
        aria-label="Project status"
        className={pending ? "pointer-events-none opacity-60" : ""}
        disabled={pending}
        onChange={handleChange}
        value={value}
      >
        {projectStatusValues.map((optionValue) => (
          <option key={optionValue} value={optionValue}>
            {statusLabels[optionValue]}
          </option>
        ))}
      </Select>
      {error ? (
        <p className="sr-only" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
