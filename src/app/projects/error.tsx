"use client";

import { RotateCcw } from "lucide-react";

import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProjectsErrorProps = {
  reset: () => void;
};

export default function ProjectsError({ reset }: ProjectsErrorProps) {
  return (
    <ProjectPageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="py-10">
            <p className="text-base font-semibold text-zinc-950 dark:text-white">
              Projects could not be loaded
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Check the database connection and try loading the project list
              again.
            </p>
            <Button className="mt-6" onClick={reset} variant="secondary">
              <RotateCcw aria-hidden="true" size={16} />
              Try again
            </Button>
          </CardContent>
        </Card>
      </section>
    </ProjectPageShell>
  );
}
