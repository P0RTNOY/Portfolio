import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";

import { DeleteCourseDialog } from "@/components/admin/delete-course-dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Course } from "@/lib/courses";

type CoursesTableProps = {
  courses: Course[];
};

const statusLabels: Record<string, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="min-w-28">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-teal-600 dark:bg-teal-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function CoursesTable({ courses }: CoursesTableProps) {
  return (
    <>
      <Card className="hidden overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Course
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Progress
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Skills
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">
                  Updated
                </th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {courses.map((course) => (
                <tr
                  className="transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40"
                  key={course.id}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-950 dark:text-white">
                        {course.title}
                      </span>
                      <span className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {course.provider}
                        {course.instructor ? ` · ${course.instructor}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge>{statusLabels[course.status]}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <ProgressBar progress={course.progress} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((skill) => (
                        <Badge className="text-[11px]" key={skill}>
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 ? (
                        <Badge className="text-[11px]">
                          +{course.skills.length - 3}
                        </Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                    {formatDate(course.updatedAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                        href={course.courseUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <ExternalLink aria-hidden="true" size={14} />
                        Source
                      </a>
                      <Link
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                        href={`/admin/courses/${course.id}/edit`}
                      >
                        <Pencil aria-hidden="true" size={14} />
                        Edit
                      </Link>
                      <DeleteCourseDialog
                        courseId={course.id}
                        courseTitle={course.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-col gap-3 lg:hidden">
        {courses.map((course) => (
          <Card className="p-4" key={course.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-zinc-950 dark:text-white">
                  {course.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {course.shortDescription}
                </p>
              </div>
              <Badge>{statusLabels[course.status]}</Badge>
            </div>

            <div className="mt-4">
              <ProgressBar progress={course.progress} />
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {course.skills.slice(0, 4).map((skill) => (
                <Badge className="text-[11px]" key={skill}>
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Updated {formatDate(course.updatedAt)}
              </p>
              <div className="flex items-center gap-1">
                <Link
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                  href={`/admin/courses/${course.id}/edit`}
                >
                  <Pencil aria-hidden="true" size={14} />
                  Edit
                </Link>
                <DeleteCourseDialog
                  courseId={course.id}
                  courseTitle={course.title}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

