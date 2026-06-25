import { ArrowUpRight, Award } from "lucide-react";
import Link from "next/link";

import { CourseVisual } from "@/components/courses/course-visual";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Course } from "@/lib/courses";

type CourseCardProps = {
  course: Course;
};

const statusLabels: Record<string, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
};

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-teal-600 dark:bg-teal-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-colors duration-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-950/5 motion-safe:transition-transform motion-safe:hover:-translate-y-1 dark:hover:border-zinc-700 dark:hover:shadow-black/20">
      <CourseVisual imageUrl={course.imageUrl} title={course.title} />
      <CardContent className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{statusLabels[course.status]}</Badge>
          {course.featured ? (
            <Badge className="border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
              Featured
            </Badge>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
            {course.provider}
            {course.instructor ? ` · ${course.instructor}` : ""}
          </p>
          <h3 className="mt-2 text-lg font-bold text-zinc-950 dark:text-white">
            <Link
              className="outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-500"
              href={`/courses/${course.slug}`}
            >
              {course.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {course.shortDescription}
          </p>
        </div>

        <ProgressBar progress={course.progress} />

        <div className="flex flex-wrap gap-2">
          {course.skills.slice(0, 5).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:text-white"
            href={`/courses/${course.slug}`}
          >
            Details
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          {course.certificateUrl ?? course.credentialUrl ? (
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:text-white"
              href={course.certificateUrl ?? course.credentialUrl ?? ""}
              rel="noreferrer"
              target="_blank"
            >
              <Award aria-hidden="true" size={16} />
              Credential
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

