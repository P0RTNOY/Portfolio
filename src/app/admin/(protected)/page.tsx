import { FolderKanban, Plus, Star, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
            Protected area
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Admin dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Manage your portfolio projects, update content, and control what
            visitors see on your public site.
          </p>
        </div>
        <ButtonLink href="/admin/projects/new" size="md">
          <Plus aria-hidden="true" size={18} />
          New project
        </ButtonLink>
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
            Quick actions
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/admin/projects" size="sm" variant="secondary">
              <FolderKanban aria-hidden="true" size={16} />
              Manage projects
            </ButtonLink>
            <ButtonLink href="/admin/projects/new" size="sm" variant="secondary">
              <Plus aria-hidden="true" size={16} />
              Create project
            </ButtonLink>
            <ButtonLink href="/" size="sm" variant="ghost">
              View public site
            </ButtonLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
