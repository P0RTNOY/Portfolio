import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  GitBranch,
} from "lucide-react";
import Link from "next/link";

import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectPageShell } from "@/components/projects/project-page-shell";
import {
  buildCaseStudySections,
  getProjectEvidenceMessage,
} from "@/lib/case-study-content";
import { getProjectStackPreview } from "@/lib/projects";
import {
  getPublicPortfolioData,
  getPublicProjectBySlug,
} from "@/lib/public-portfolio-content";

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
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | Omer Portnoy`,
      description: project.shortDescription,
      type: "article",
      url: `/projects/${project.slug}`,
    },
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
    <div className="space-y-5 text-base leading-8 text-muted sm:text-lg">
      {blocks.map((block) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const isList =
          lines.length > 0 && lines.every((line) => line.startsWith("- "));

        if (isList) {
          return (
            <ul className="space-y-3" key={block}>
              {lines.map((line) => (
                <li className="flex gap-4" key={line}>
                  <span
                    aria-hidden="true"
                    className="mt-3 size-1.5 shrink-0 rounded-full bg-signal"
                  />
                  <span>{line.replace(/^- /, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p className="whitespace-pre-line text-pretty" key={block}>
            {block}
          </p>
        );
      })}
    </div>
  );
}

const statusDescriptions = {
  completed: "The primary implementation is complete and documented.",
  "in-progress": "Active work with a usable foundation and clear next steps.",
  planned: "Planned work being shaped before implementation.",
  archived: "Archived work retained as engineering context.",
} as const;

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const [project, { settings }] = await Promise.all([
    getPublicProjectBySlug(slug),
    getPublicPortfolioData(),
  ]);

  if (!project) {
    notFound();
  }

  const caseStudySections = buildCaseStudySections({
    description: project.fullDescription,
    problemSolved: project.problemSolved,
    technicalChallenges: project.technicalChallenges,
  });
  const [overviewSection, ...remainingSections] = caseStudySections;
  const stackPreview = getProjectStackPreview(project.techStack, 7);

  return (
    <ProjectPageShell
      contactEmail={settings.contactEmail}
      githubUrl={settings.githubUrl}
      linkedinUrl={settings.linkedinUrl}
      siteName={settings.siteName}
    >
      <section className="border-b border-ink/20 bg-paper">
        <div className="page-shell py-10 sm:py-14">
          <Link
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
            href="/projects"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            All projects
          </Link>

          <div className="mt-8 grid overflow-hidden border border-ink/18 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col bg-background p-6 sm:p-10 lg:p-14">
              <div className="flex flex-wrap items-center gap-3">
                <span className="technical-label text-signal">Case study</span>
                <span className="h-px w-7 bg-ink/25" />
                <span className="technical-label text-muted">
                  {project.status.replace("-", " ")}
                </span>
              </div>
              <h1 className="text-balance mt-8 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.065em] text-ink sm:text-7xl lg:text-[6.25rem]">
                {project.title}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {project.shortDescription}
              </p>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-ink/18 pt-6">
                {project.githubUrl ? (
                  <a
                    className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-signal"
                    href={project.githubUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <GitBranch aria-hidden="true" size={16} />
                    Source code
                    <ArrowUpRight
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      size={15}
                    />
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-signal"
                    href={project.liveUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Live product
                    <ArrowUpRight
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      size={16}
                    />
                  </a>
                ) : null}
              </div>
            </div>

            <div className="project-grid relative isolate flex min-h-[28rem] overflow-hidden bg-night p-6 text-night-text sm:p-9 lg:min-h-full">
              <div
                aria-hidden="true"
                className="absolute -right-20 top-10 size-72 rounded-full bg-signal/24 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute right-[12%] top-[16%] h-[46%] w-[56%] rotate-3 border border-white/16"
              />
              <div className="relative mt-auto w-full">
                <p className="display-serif text-8xl italic leading-none text-white/10 sm:text-[9rem]">
                  01
                </p>
                <div className="mt-5 grid gap-5 border-t border-white/16 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="technical-label text-[0.58rem] text-white/45">
                      Role
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {project.role || "Software engineer"}
                    </p>
                  </div>
                  <div>
                    <p className="technical-label text-[0.58rem] text-white/45">
                      Updated
                    </p>
                    <p className="mt-2 text-sm">{formatDate(project.updatedAt)}</p>
                  </div>
                </div>
                {stackPreview.length > 0 ? (
                  <ul
                    aria-label="Technology stack"
                    className="mt-6 flex flex-wrap gap-2"
                  >
                    {stackPreview.map((technology) => (
                      <li
                        className="border border-white/14 px-2.5 py-1.5 font-mono text-[0.64rem] text-night-muted"
                        key={technology}
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr] lg:gap-20">
          <div>
            <p className="technical-label text-signal">01 / Overview</p>
          </div>
          <article>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
              {overviewSection.title}
            </h2>
            <div className="mt-7 border-t border-ink/18 pt-7">
              <CaseStudyBody body={overviewSection.body} />
            </div>
          </article>
        </div>
      </section>

      <ProjectGallery images={project.screenshots} title={project.title} />

      <section className="border-t border-ink/20 bg-paper">
        <div className="page-shell grid gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-20">
          <div className="space-y-16 sm:space-y-24">
            {remainingSections.map((section, index) => (
              <article
                className="reveal-on-scroll grid gap-7 sm:grid-cols-[5rem_1fr]"
                key={`${section.title}-${index}`}
              >
                <p className="technical-label text-signal">
                  {String(index + 2).padStart(2, "0")}
                </p>
                <div>
                  <h2 className="text-balance text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                    {section.title}
                  </h2>
                  <div className="mt-7 border-t border-ink/18 pt-7">
                    <CaseStudyBody body={section.body} />
                  </div>
                </div>
              </article>
            ))}

            {project.screenshots.length === 0 ? (
              <article className="grid gap-7 sm:grid-cols-[5rem_1fr]">
                <p className="technical-label text-signal">
                  {String(remainingSections.length + 2).padStart(2, "0")}
                </p>
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                    Evidence and media
                  </h2>
                  <p className="mt-7 border-t border-ink/18 pt-7 text-base leading-8 text-muted sm:text-lg">
                    {getProjectEvidenceMessage(project.githubUrl)}
                  </p>
                </div>
              </article>
            ) : null}
          </div>

          <aside className="h-fit border-t border-ink/20 pt-6 lg:sticky lg:top-28">
            <p className="technical-label text-muted">Project snapshot</p>
            <dl className="mt-5 divide-y divide-ink/14 border-y border-ink/18 text-sm">
              <div className="py-4">
                <dt className="font-semibold text-ink">Role</dt>
                <dd className="mt-1.5 leading-6 text-muted">
                  {project.role || "Not listed"}
                </dd>
              </div>
              <div className="py-4">
                <dt className="font-semibold text-ink">Status</dt>
                <dd className="mt-1.5 leading-6 text-muted">
                  {statusDescriptions[project.status]}
                </dd>
              </div>
              <div className="py-4">
                <dt className="font-semibold text-ink">Last updated</dt>
                <dd className="mt-1.5 text-muted">
                  {formatDate(project.updatedAt)}
                </dd>
              </div>
            </dl>
            {project.highlights.length > 0 ? (
              <div className="mt-8">
                <p className="technical-label text-muted">Highlights</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-soft">
                  {project.highlights.map((highlight) => (
                    <li className="flex gap-3" key={highlight}>
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="bg-signal text-white">
        <div className="page-shell flex flex-col gap-7 py-14 sm:flex-row sm:items-end sm:justify-between sm:py-18">
          <div>
            <p className="technical-label text-white/70">Continue exploring</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              More engineering work.
            </h2>
          </div>
          <Link
            className="group inline-flex min-h-12 w-fit items-center gap-2 border border-white/35 px-5 text-sm font-semibold"
            href="/projects"
          >
            Browse all projects
            <ArrowUpRight
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              size={17}
            />
          </Link>
        </div>
      </section>
    </ProjectPageShell>
  );
}
