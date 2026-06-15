import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { listProjects } from "@/lib/projects";

export default async function AdminProjectsPlaceholderPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-8">
      <div>
        <Badge className="mb-4">Phase 6 preview</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Project management
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
          CRUD controls are coming next. For now, this protected page confirms
          admin routing and database access are working.
        </p>
      </div>
      <Card>
        <CardContent className="py-8">
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
            {projects.length} projects ready for management
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            The next phase will replace this placeholder with a table and forms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
