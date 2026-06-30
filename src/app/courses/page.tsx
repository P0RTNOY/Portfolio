import type { Metadata } from "next";

import { CoursesGrid } from "@/components/courses/courses-grid";
import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { listCourses } from "@/lib/courses";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning | Omer Portnoy",
  description:
    "A learning timeline for Omer Portnoy's AI, backend, cloud, security, and software engineering growth.",
};

export default async function CoursesPage() {
  const [courses, settings] = await Promise.all([
    listCourses(),
    getSiteSettings(),
  ]);
  const completedCount = courses.filter(
    (course) => course.status === "completed",
  ).length;
  const inProgressCount = courses.filter(
    (course) => course.status === "in-progress",
  ).length;

  return (
    <ProjectPageShell siteName={settings.siteName}>
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Courses"
            title="Learning timeline."
            description="Courses, certifications, and technical learning paths that support practical AI, backend, cloud, security, and software engineering work."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge>{courses.length} total</Badge>
            <Badge>{completedCount} completed</Badge>
            <Badge>{inProgressCount} in progress</Badge>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <CoursesGrid courses={courses} />
      </section>
    </ProjectPageShell>
  );
}
