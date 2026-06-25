import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Award } from "lucide-react";

import { CourseVisual } from "@/components/courses/course-visual";
import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCourseBySlug } from "@/lib/courses";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

type CourseDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

const statusLabels: Record<string, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
};

export async function generateMetadata({
  params,
}: CourseDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course not found | Generic Portfolio",
    };
  }

  return {
    title: `${course.title} | Generic Portfolio`,
    description: course.shortDescription,
  };
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-teal-600 dark:bg-teal-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { slug } = await params;
  const [course, settings] = await Promise.all([
    getCourseBySlug(slug),
    getSiteSettings(),
  ]);

  if (!course) {
    notFound();
  }

  const credentialUrl = course.certificateUrl ?? course.credentialUrl;

  return (
    <ProjectPageShell siteName={settings.siteName}>
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <CourseVisual
            className="lg:order-2"
            imageUrl={course.imageUrl}
            title={course.title}
          />
          <div className="flex flex-col justify-center">
            <ButtonLink className="mb-6 w-fit" href="/courses" variant="ghost">
              <ArrowLeft aria-hidden="true" size={16} />
              Back to courses
            </ButtonLink>
            <div className="flex flex-wrap gap-2">
              <Badge>{statusLabels[course.status]}</Badge>
              {course.featured ? (
                <Badge className="border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
                  Featured
                </Badge>
              ) : null}
            </div>
            <p className="mt-5 text-sm font-semibold uppercase text-zinc-500 dark:text-zinc-400">
              {course.provider}
              {course.instructor ? ` · ${course.instructor}` : ""}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {course.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={course.courseUrl}
                rel="noreferrer"
                target="_blank"
              >
                View course
                <ArrowUpRight aria-hidden="true" size={18} />
              </ButtonLink>
              {credentialUrl ? (
                <ButtonLink
                  href={credentialUrl}
                  rel="noreferrer"
                  target="_blank"
                  variant="secondary"
                >
                  <Award aria-hidden="true" size={18} />
                  Credential
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                Overview
              </h2>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-base leading-8 text-zinc-600 dark:text-zinc-300">
                {course.fullDescription ||
                  "A detailed course description can be added from the admin dashboard."}
              </p>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Course details
              </h2>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <ProgressBar progress={course.progress} />
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">
                  Started
                </p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                  {formatDate(course.startedAt)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">
                  Completed
                </p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                  {formatDate(course.completedAt)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">
                  Skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {course.skills.length > 0 ? (
                    course.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-zinc-600 dark:text-zinc-300">
                      Add topics from the dashboard.
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </ProjectPageShell>
  );
}

