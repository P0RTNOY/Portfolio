import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Award } from "lucide-react";

import { CourseVisual } from "@/components/courses/course-visual";
import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getCourseLearningImpact,
  getCourseStageLabel,
} from "@/lib/courses";
import {
  getPublicCourseBySlug,
  getPublicPortfolioData,
} from "@/lib/public-portfolio-content";

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

const statusContext: Record<string, string> = {
  planned:
    "This record documents a future learning priority. The overview below defines the intended scope; it does not claim completed work.",
  "in-progress":
    "This record is a progress log for learning that is currently underway. The overview below explains the authored scope and its junior software engineering relevance.",
  completed:
    "This record documents a completed learning track. A certificate or credential is linked separately when one is available.",
  archived:
    "This historical record preserves earlier learning context and is not presented as current activity.",
};

export async function generateMetadata({
  params,
}: CourseDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course not found | Omer Portnoy",
    };
  }

  return {
    title: course.title,
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
    <div
      aria-label="Course progress"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={progress}
      role="progressbar"
    >
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div
        aria-hidden="true"
        className="mt-2 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
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
  const [course, { settings }] = await Promise.all([
    getPublicCourseBySlug(slug),
    getPublicPortfolioData(),
  ]);

  if (!course) {
    notFound();
  }

  const credentialUrl = course.certificateUrl ?? course.credentialUrl;
  const learningImpact = getCourseLearningImpact(course);
  const stageLabel = getCourseStageLabel(course);

  return (
    <ProjectPageShell
      contactEmail={settings.contactEmail}
      githubUrl={settings.githubUrl}
      linkedinUrl={settings.linkedinUrl}
      siteName={settings.siteName}
    >
      <section className="border-b border-ink/20 bg-paper">
        <div className="page-shell grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <CourseVisual
            className="lg:order-2"
            featured={course.featured}
            imageUrl={course.imageUrl}
            progress={course.progress}
            stageLabel={stageLabel}
            status={course.status}
          />
          <div className="flex flex-col justify-center">
            <ButtonLink className="mb-6 w-fit" href="/courses" variant="ghost">
              <ArrowLeft aria-hidden="true" size={16} />
              Back to courses
            </ButtonLink>
            <div className="flex flex-wrap gap-2">
              <Badge>{statusLabels[course.status]}</Badge>
              {course.featured ? (
                <Badge className="border-signal/25 bg-signal/8 text-signal-deep">
                  Featured
                </Badge>
              ) : null}
            </div>
            <p className="technical-label mt-5 text-muted">
              {course.provider}
              {course.instructor ? ` · ${course.instructor}` : ""}
            </p>
            <h1 className="text-balance mt-4 max-w-3xl text-4xl font-semibold leading-[1] tracking-[-0.055em] text-ink sm:text-6xl">
              {course.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {course.shortDescription}
            </p>
            <p className="mt-5 max-w-2xl border-l border-signal/55 pl-4 text-sm leading-7 text-ink-soft">
              <span className="font-semibold">Learning focus: </span>
              {learningImpact}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={course.courseUrl}
                rel="noreferrer"
                target="_blank"
              >
                View learning resource
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

      <section className="page-shell grid gap-8 py-16 sm:py-24 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Card className="border-teal-200 bg-teal-50/70 dark:border-teal-900 dark:bg-teal-950/30">
            <CardHeader>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                How to read this record
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-8 text-zinc-700 dark:text-zinc-200">
                {statusContext[course.status]}
              </p>
            </CardContent>
          </Card>
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
