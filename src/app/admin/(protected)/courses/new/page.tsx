import type { Metadata } from "next";

import { createCourseAction } from "@/app/admin/(protected)/courses/actions";
import { CourseForm } from "@/components/admin/course-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "New Course | Portfolio Admin",
};

export default function NewCoursePage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          Create
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          New course
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
          Add a learning record manually, or import public course details from a URL and apply the suggestions you want.
        </p>
      </div>

      <CourseForm action={createCourseAction} submitLabel="Create course" />
    </div>
  );
}

