import { ArrowLeft } from "lucide-react";

import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectNotFound() {
  return (
    <ProjectPageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-dashed">
          <CardContent className="py-12">
            <p className="text-sm font-semibold uppercase text-teal-700 dark:text-teal-300">
              Project not found
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              This project is not available.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
              It may have been removed, archived, or not added to the portfolio
              database yet.
            </p>
            <ButtonLink className="mt-8" href="/projects" variant="secondary">
              <ArrowLeft aria-hidden="true" size={16} />
              Back to projects
            </ButtonLink>
          </CardContent>
        </Card>
      </section>
    </ProjectPageShell>
  );
}
