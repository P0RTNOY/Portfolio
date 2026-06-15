import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateProjectAction } from "@/app/admin/(protected)/projects/actions";
import { ProjectForm } from "@/components/admin/project-form";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectById } from "@/lib/projects";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return { title: "Project Not Found | Admin | Generic Portfolio" };
  }

  return { title: `Edit ${project.title} | Admin | Generic Portfolio` };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const boundAction = updateProjectAction.bind(null, id);

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
          Edit project
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Editing{" "}
          <span className="font-semibold text-zinc-950 dark:text-white">
            {project.title}
          </span>
        </p>
      </div>

      <Card>
        <CardContent className="py-8">
          <ProjectForm
            action={boundAction}
            defaultValues={project}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
