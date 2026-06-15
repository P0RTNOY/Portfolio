import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectsLoadingState() {
  return (
    <ProjectPageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton mt-5 h-10 w-full max-w-xl rounded" />
        <div className="skeleton mt-4 h-6 w-full max-w-2xl rounded" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Card key={item}>
              <div className="skeleton aspect-[16/10] rounded-t-lg" />
              <CardContent className="space-y-4 p-5">
                <div className="skeleton h-5 w-2/3 rounded" />
                <div className="skeleton h-16 rounded" />
                <div className="flex gap-2">
                  <div className="skeleton h-7 w-20 rounded" />
                  <div className="skeleton h-7 w-24 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </ProjectPageShell>
  );
}
