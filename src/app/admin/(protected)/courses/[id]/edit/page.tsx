import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateCourseAction } from "@/app/admin/(protected)/courses/actions";
import { CourseForm } from "@/components/admin/course-form";
import { Badge } from "@/components/ui/badge";
import { getCourseById } from "@/lib/courses";

type EditCoursePageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Course | Portfolio Admin",
};

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          Edit
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Edit course
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
          Update the course details, progress, links, and publishing state.
        </p>
      </div>

      <CourseForm
        action={updateCourseAction.bind(null, course.id)}
        defaultValues={course}
        submitLabel="Save course"
      />
    </div>
  );
}

