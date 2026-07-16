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
    "A transparent roadmap and progress log for learning relevant to junior software engineering.",
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
            title="A transparent learning roadmap and progress log."
            description="Each entry reports its authored focus, status, and progress. Together they document planned, current, completed, and historical learning relevant to junior software engineering without treating a course record as proof of proficiency."
          />
          <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            For a junior software engineering review, the recorded topics show
            the specific subject of each resource while status and progress
            distinguish intended study from work underway or completed.
            Certificates and credential links appear separately only when an
            artifact is available.
          </p>
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
