import { ArrowUpRight, Award } from "lucide-react";
import Link from "next/link";

import {
  getCourseLearningImpact,
  getCourseStageLabel,
  type Course,
} from "@/lib/courses";

type CourseCardProps = {
  course: Course;
};

const statusLabels: Record<Course["status"], string> = {
  planned: "Planned",
  "in-progress": "In progress",
  completed: "Completed",
  archived: "Archived",
};

export function CourseCard({ course }: CourseCardProps) {
  const learningImpact = getCourseLearningImpact(course);
  const stageLabel = getCourseStageLabel(course);
  const credentialUrl = course.certificateUrl ?? course.credentialUrl;

  return (
    <article className="group flex h-full flex-col border border-ink/18 bg-paper p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-signal/65 hover:shadow-[0_24px_60px_rgba(29,30,27,0.1)] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <span className="technical-label text-signal">{course.provider}</span>
        <span className="border border-ink/15 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
          {statusLabels[course.status]}
        </span>
      </div>
      <h2 className="mt-8 text-2xl font-semibold tracking-[-0.045em] text-ink sm:text-3xl">
        <Link
          className="transition-colors hover:text-signal"
          href={`/courses/${course.slug}`}
        >
          {course.title}
        </Link>
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted">
        {course.shortDescription}
      </p>
      <div className="mt-6 border-l border-signal/45 pl-4">
        <p className="technical-label text-[0.58rem] text-muted">
          Learning focus
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{learningImpact}</p>
      </div>
      <div
        aria-label={`${course.progress}% course progress`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={course.progress}
        className="mt-7"
        role="progressbar"
      >
        <div className="flex justify-between gap-4 text-xs font-semibold text-muted">
          <span>{stageLabel}</span>
          <span>{course.progress}%</span>
        </div>
        <div aria-hidden="true" className="mt-2 h-1.5 bg-ink/10">
          <div
            className="h-full bg-signal"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {course.skills.slice(0, 5).map((skill) => (
          <li
            className="border border-ink/14 px-2.5 py-1.5 font-mono text-[0.64rem] text-muted"
            key={skill}
          >
            {skill}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/14 pt-5">
        <Link
          className="group/link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-signal"
          href={`/courses/${course.slug}`}
        >
          Read record
          <ArrowUpRight
            aria-hidden="true"
            className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            size={16}
          />
        </Link>
        {credentialUrl ? (
          <a
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
            href={credentialUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Award aria-hidden="true" size={16} />
            Credential
          </a>
        ) : null}
      </div>
    </article>
  );
}
