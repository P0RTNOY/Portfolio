import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createProjectAction } from "@/app/admin/(protected)/projects/actions";
import { ProjectForm } from "@/components/admin/project-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white"
          href="/admin/projects"
        >
          <ArrowLeft aria-hidden="true" size={14} />
          Back to projects
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Create project
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Add a new project to your portfolio.
        </p>
      </div>

      <Card>
        <CardContent className="py-8">
          <ProjectForm
            action={createProjectAction}
            submitLabel="Create project"
          />
        </CardContent>
      </Card>
    </div>
  );
}
