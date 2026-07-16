import {
  ArrowRight,
  Download,
  Eye,
} from "lucide-react";

import { CoursesGrid } from "@/components/courses/courses-grid";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import {
  PortfolioProofStrip,
  type ProofItem,
} from "@/components/site/portfolio-proof-strip";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ResumeViewer } from "@/components/site/resume-viewer";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listCourses } from "@/lib/courses";
import { listProjects } from "@/lib/projects";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, courses, settings] = await Promise.all([
    listProjects(),
    listCourses(),
    getSiteSettings(),
  ]);
  const featuredProjects = projects.filter((project) => project.featured);
  const homepageProjects =
    featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);
  const featuredCourses = courses.filter((course) => course.featured);
  const homepageCourses =
    featuredCourses.length > 0 ? featuredCourses : courses.slice(0, 3);
  const activeLearningTracks = courses.filter(
    (course) => course.status === "in-progress",
  );
  const proofItems: ProofItem[] = [
    {
      label: "Junior SWE focus",
      value: "Full-stack / AI / automation",
      href: "/#about",
    },
    {
      label: "Featured case studies",
      value: `${homepageProjects.length} shipped projects`,
      href: "/#projects",
    },
    {
      label: "Active learning tracks",
      value: `${activeLearningTracks.length} in progress`,
      href: "/#courses",
    },
    {
      label: "CV available",
      value: "Read online or download",
      href: "/cv",
    },
  ];

  return (
    <div className="min-h-dvh">
      <SiteHeader siteName={settings.siteName} />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.12),transparent_50%)]" />
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="flex flex-col justify-center">
              <Badge className="mb-6 w-fit border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
                {settings.heroEyebrow}
              </Badge>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl">
                {settings.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                {settings.heroIntro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/#projects" size="lg">
                  {settings.primaryCtaLabel}
                  <ArrowRight aria-hidden="true" size={18} />
                </ButtonLink>
                <ButtonLink href="/#contact" size="lg" variant="secondary">
                  {settings.secondaryCtaLabel}
                </ButtonLink>
              </div>
            </div>
            <Card className="overflow-hidden">
              <CardHeader>
                <p className="text-sm font-semibold uppercase text-zinc-500">
                  Recruiter snapshot
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Recruiters can scan this page like a candidate profile: the
                  target role is clear, the work is shipped, and the learning
                  momentum is visible.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                      Targeting
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">
                      Junior SWE roles
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                      Building
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">
                      Full-stack, AI, and automation systems
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                      Signal
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">
                      Shipped work plus a ready CV
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
          <PortfolioProofStrip items={proofItems} />
        </section>

        <section
          id="about"
          className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <SectionHeading
            eyebrow="About"
            title={settings.aboutTitle}
            description={settings.aboutSummary}
          />
        </section>

        <section
          id="projects"
          className="border-y border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-950/60"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Projects"
              title="Projects read as case studies, not gallery cards."
              description="Each project is framed as evidence: the problem I tackled, the role I played, the architecture and tradeoffs, and the outcome that matters to a hiring team."
            />
            <div className="mt-8">
              <ProjectsGrid projects={homepageProjects} />
            </div>
            <div className="mt-8">
              <ButtonLink href="/projects" variant="secondary">
                Browse all projects
                <ArrowRight aria-hidden="true" size={16} />
              </ButtonLink>
            </div>
          </div>
        </section>

        <section
          id="cv"
          className="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:px-8">
            <div>
              <SectionHeading
                eyebrow="CV"
                title="CV and professional background."
                description="A focused view of my experience, education, and technical direction. Visitors can read it in the site or open the latest PDF version."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                {settings.resumeUrl ? (
                  <>
                    <ButtonLink href="/cv">
                      <Eye aria-hidden="true" size={18} />
                      Read CV
                    </ButtonLink>
                    <ButtonLink
                      href={settings.resumeUrl}
                      rel="noreferrer"
                      target="_blank"
                      variant="secondary"
                    >
                      <Download aria-hidden="true" size={18} />
                      Download CV
                    </ButtonLink>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    The latest CV will be available here soon.
                  </p>
                )}
              </div>
            </div>
            <ResumeViewer compact resumeUrl={settings.resumeUrl} />
          </div>
        </section>

        <section
          id="courses"
          className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <SectionHeading
            eyebrow="Learning timeline"
            title="Learning momentum stays visible."
            description="This timeline shows the courses and self-study tracks I’m using to build junior-engineer momentum across AI, backend systems, security, cloud workflows, and core computer science fundamentals."
          />
          <div className="mt-8">
            <CoursesGrid courses={homepageCourses} />
          </div>
          <div className="mt-8">
            <ButtonLink href="/courses" variant="secondary">
              Browse all courses
              <ArrowRight aria-hidden="true" size={16} />
            </ButtonLink>
          </div>
        </section>

        <section
          id="contact"
          className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <SectionHeading
              eyebrow="Contact"
              title={settings.contactTitle}
              description={settings.contactSummary}
            />
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href={`mailto:${settings.contactEmail}`}
                size="lg"
                variant="secondary"
              >
                {settings.contactEmail}
              </ButtonLink>
              {settings.githubUrl ? (
                <ButtonLink
                  href={settings.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                  variant="ghost"
                >
                  GitHub
                </ButtonLink>
              ) : null}
              {settings.linkedinUrl ? (
                <ButtonLink
                  href={settings.linkedinUrl}
                  rel="noreferrer"
                  target="_blank"
                  variant="ghost"
                >
                  LinkedIn
                </ButtonLink>
              ) : null}
              {settings.resumeUrl ? (
                <ButtonLink
                  href={settings.resumeUrl}
                  rel="noreferrer"
                  target="_blank"
                  variant="ghost"
                >
                  Resume
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter siteName={settings.siteName} />
    </div>
  );
}
