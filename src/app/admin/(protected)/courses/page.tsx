import type { Metadata } from "next";
import { GraduationCap, Plus } from "lucide-react";

import { CoursesTable } from "@/components/admin/courses-table";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { listCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses | Portfolio Admin",
};

export default async function AdminCoursesPage() {
  const courses = await listCourses();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
            Learning records
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Courses
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Manage completed and in-progress courses, including public source links, progress, certificates, and AI-imported course metadata.
          </p>
        </div>
        <ButtonLink href="/admin/courses/new" size="md">
          <Plus aria-hidden="true" size={18} />
          New course
        </ButtonLink>
      </div>

      {courses.length > 0 ? (
        <CoursesTable courses={courses} />
      ) : (
        <EmptyState
          action={
            <ButtonLink href="/admin/courses/new">
              <Plus aria-hidden="true" size={16} />
              Add first course
            </ButtonLink>
          }
          description="Add course records manually or import public metadata from a course URL."
          icon={GraduationCap}
          title="No courses yet"
        />
      )}
    </div>
  );
}

