import { FolderKanban, Star, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listProjects } from "@/lib/projects";

export default async function AdminPage() {
  const projects = await listProjects();
  const featuredCount = projects.filter((project) => project.featured).length;
  const inProgressCount = projects.filter(
    (project) => project.status === "in-progress",
  ).length;

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      icon: FolderKanban,
    },
    {
      label: "Featured",
      value: featuredCount,
      icon: Star,
    },
    {
      label: "In progress",
      value: inProgressCount,
      icon: Timer,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          Protected area
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Admin dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
          This area is protected by a signed session cookie. Project editing UI
          will be added in the next phase.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-semibold text-zinc-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-zinc-950 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <stat.icon aria-hidden="true" size={20} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            Next step
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Phase 6 will add the projects table, create/edit forms, delete
            confirmation, featured toggles, and validation feedback.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
