import {
  ArrowRight,
  Bot,
  Code2,
  Download,
  Eye,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { CoursesGrid } from "@/components/courses/courses-grid";
import { ProjectsGrid } from "@/components/projects/projects-grid";
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
  const snapshotCards = [
    {
      icon: ShieldCheck,
      title: "Product-minded engineer",
      text: "I care about turning ideas into usable products with clear flows, maintainable code, and practical UX.",
    },
    {
      icon: Code2,
      title: "Full-stack foundation",
      text: "I work across frontend, backend, databases, APIs, authentication, and deployment workflows.",
    },
    {
      icon: Bot,
      title: "AI application focus",
      text: "I'm learning and building with LLMs, AI agents, RAG concepts, OpenAI, Hugging Face, and automation pipelines.",
    },
    {
      icon: Rocket,
      title: "Always shipping",
      text: "This portfolio itself is built as a database-backed product with an admin dashboard, content management, CV support, and AI-assisted tooling.",
    },
  ];
  const currentFocus = [
    "AI-powered products",
    "Backend/full-stack systems",
    "Automation tools",
    "Cloud/deployment workflows",
    "Interview-level CS fundamentals",
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
                  Builder snapshot
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {snapshotCards.map((item) => (
                  <div
                    className="grid grid-cols-[44px_1fr] gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    key={item.title}
                  >
                    <div className="flex size-11 items-center justify-center rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                      <item.icon aria-hidden="true" size={20} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-zinc-950 dark:text-white">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <h2 className="font-semibold text-zinc-950 dark:text-white">
                    Currently focused on
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentFocus.map((focus) => (
                      <Badge key={focus}>{focus}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
              title="Projects are coming in as case studies."
              description="This portfolio is designed to present each project as a real case study: the problem, my role, the architecture, technical challenges, screenshots, links, and what I learned."
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
          id="courses"
          className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <SectionHeading
            eyebrow="Courses"
            title="Learning timeline."
            description="A focused record of the courses, certifications, and technical learning paths I'm using to sharpen my skills in AI, backend systems, security, cloud, and software engineering fundamentals."
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
          id="cv"
          className="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:px-8">
            <div>
              <SectionHeading
                eyebrow="CV"
                title="CV and professional background."
                description="A focused view of my experience, education, skills, and technical direction. Visitors can read it in the site or open the latest PDF version."
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
                      Download
                    </ButtonLink>
                  </>
                ) : (
                  <ButtonLink href="/admin/settings" variant="secondary">
                    Add CV PDF
                  </ButtonLink>
                )}
              </div>
            </div>
            <ResumeViewer compact resumeUrl={settings.resumeUrl} />
          </div>
        </section>

        <section
          id="skills"
          className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <SectionHeading
            eyebrow="Skills"
            title={settings.skillsTitle}
            description={settings.skillsSummary}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {settings.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
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
