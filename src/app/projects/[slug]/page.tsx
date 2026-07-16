import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";

import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectVisual } from "@/components/projects/project-visual";
import { StatusBadge } from "@/components/projects/status-badge";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  buildCaseStudySections,
  getProjectEvidenceMessage,
} from "@/lib/case-study-content";
import { getProjectBySlug, getProjectStackPreview } from "@/lib/projects";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

type ProjectDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found | Omer Portnoy",
    };
  }

  return {
    title: `${project.title} | Omer Portnoy`,
    description: project.shortDescription,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function CaseStudyBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).filter((block) => block.trim().length > 0);

  return (
    <div className="space-y-4 text-base leading-8 text-zinc-600 dark:text-zinc-300">
      {blocks.map((block) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));

        if (isList) {
          return (
            <ul className="space-y-3" key={block}>
              {lines.map((line) => (
                <li className="flex gap-3" key={line}>
                  <span
                    aria-hidden="true"
                    className="mt-3 size-1.5 shrink-0 rounded-full bg-teal-600 dark:bg-teal-300"
                  />
                  <span>{line.replace(/^- /, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p className="whitespace-pre-line" key={block}>
            {block}
          </p>
        );
      })}
    </div>
  );
}

function statusDescription(status: string) {
  switch (status) {
    case "completed":
      return "The main implementation is complete and documented as a case study.";
    case "in-progress":
      return "Active work with a usable foundation and clear next improvements.";
    case "planned":
      return "Planned work that is being shaped before implementation.";
    case "archived":
      return "Archived work kept for reference.";
    default:
      return "Project status is tracked from the admin dashboard.";
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const caseStudySections = buildCaseStudySections({
    description: project.fullDescription,
    problemSolved: project.problemSolved,
    technicalChallenges: project.technicalChallenges,
  });
  const [overviewSection, ...remainingCaseStudySections] = caseStudySections;
  const stackPreview = getProjectStackPreview(project.techStack, 6);

  return (
    <ProjectPageShell siteName={settings.siteName}>
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <ProjectVisual
            className="lg:order-2"
            featured={project.featured}
            imageUrl={project.imageUrl}
            role={project.role}
            status={project.status}
            summary={project.shortDescription}
            techStack={stackPreview}
            title={project.title}
            variant="detail"
          />
          <div className="flex flex-col justify-center">
            <ButtonLink className="mb-6 w-fit" href="/projects" variant="ghost">
              <ArrowLeft aria-hidden="true" size={16} />
              Back to projects
            </ButtonLink>
            <div className="flex flex-wrap gap-2">
              <Badge>Case study</Badge>
              <StatusBadge status={project.status} />
              {project.featured ? (
                <Badge className="border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
                  Featured
                </Badge>
              ) : null}
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-base font-medium text-zinc-700 dark:text-zinc-200">
              {project.role || "Role not listed"}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {project.shortDescription}
            </p>
            {stackPreview.length > 0 ? (
              <div className="mt-8 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {stackPreview.map((tech) => (
                    <Badge
                      className="min-w-0 max-w-full break-all whitespace-normal text-left"
                      key={tech}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {project.githubUrl ? (
                <ButtonLink
                  href={project.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <GitBranch aria-hidden="true" size={18} />
                  GitHub
                </ButtonLink>
              ) : null}
              {project.liveUrl ? (
                <ButtonLink
                  href={project.liveUrl}
                  rel="noreferrer"
                  target="_blank"
                  variant="secondary"
                >
                  Live demo
                  <ArrowUpRight aria-hidden="true" size={18} />
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="project-overview-title"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <Card>
          <CardHeader>
            <h2
              className="text-xl font-bold text-zinc-950 dark:text-white"
              id="project-overview-title"
            >
              {overviewSection.title}
            </h2>
          </CardHeader>
          <CardContent>
            <CaseStudyBody body={overviewSection.body} />
          </CardContent>
        </Card>
      </section>

      <ProjectGallery images={project.screenshots} title={project.title} />

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-8">
          {remainingCaseStudySections.map((section, index) => (
            <Card key={`${section.title}-${index}`}>
              <CardHeader>
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                  {section.title}
                </h2>
              </CardHeader>
              <CardContent>
                <CaseStudyBody body={section.body} />
              </CardContent>
            </Card>
          ))}

          {project.screenshots.length === 0 ? (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                  Screenshots and media
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300">
                  {getProjectEvidenceMessage(project.githubUrl)}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Project details
              </h2>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">
                  Summary
                </p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                  {project.shortDescription}
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">Role</p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                  {project.role || "Role to be added"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">
                  Status
                </p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                  {statusDescription(project.status)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">Updated</p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                  {formatDate(project.updatedAt)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">
                  Tech stack
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.length > 0 ? (
                    project.techStack.map((tech) => (
                      <Badge
                        className="min-w-0 max-w-full break-all whitespace-normal text-left"
                        key={tech}
                      >
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-zinc-600 dark:text-zinc-300">
                      No technologies are listed for this project yet.
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {project.highlights.length > 0 ? (
            <Card>
              <CardHeader>
                <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                  Highlights
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {project.highlights.map((highlight) => (
                    <li className="flex gap-3" key={highlight}>
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-600 dark:bg-teal-300"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </section>
    </ProjectPageShell>
  );
}
