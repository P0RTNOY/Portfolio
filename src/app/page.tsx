import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Contact,
  Download,
  Eye,
  GitBranch,
  Mail,
} from "lucide-react";
import Link from "next/link";

import { FeaturedProjects } from "@/components/projects/featured-projects";
import { CapabilityGrid } from "@/components/site/capability-grid";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPublicPortfolioData } from "@/lib/public-portfolio-content";

export const dynamic = "force-dynamic";

const specialties = [
  {
    label: "Full-stack systems",
    detail: "Product UI, APIs, data, and protected workflows",
  },
  {
    label: "AI product prototypes",
    detail: "Model integrations with explicit safety boundaries",
  },
  {
    label: "Automation",
    detail: "Tools that remove repetitive operational work",
  },
];

export default async function Home() {
  const { projects, courses, settings } = await getPublicPortfolioData();
  const featuredProjects = projects.filter((project) => project.featured);
  const homepageProjects = (
    featuredProjects.length > 0 ? featuredProjects : projects
  ).slice(0, 2);
  const activeLearningTracks = courses.filter(
    (course) => course.status === "in-progress",
  );
  return (
    <div className="min-h-dvh">
      <SiteHeader siteName={settings.siteName} />
      <main id="main-content">
        <section
          aria-labelledby="hero-title"
          className="relative overflow-hidden border-b border-ink/20"
        >
          <div
            aria-hidden="true"
            className="absolute -right-24 top-10 size-[32rem] rounded-full bg-white/42 blur-3xl"
          />
          <div className="page-shell relative grid min-h-[calc(100dvh-var(--header-height))] grid-rows-[1fr_auto]">
            <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-16 lg:py-24">
              <div>
                <p className="technical-label flex items-center gap-3 text-signal">
                  <span className="size-2 rounded-full bg-signal shadow-[0_0_0_5px_rgba(201,79,40,0.1)]" />
                  {settings.heroEyebrow}
                </p>
                <h1
                  className="text-balance mt-7 max-w-5xl text-[clamp(3rem,7vw,7.25rem)] font-medium leading-[0.92] tracking-[-0.075em] text-ink"
                  id="hero-title"
                >
                  {settings.heroTitle}
                </h1>
                <div className="mt-9 grid max-w-4xl gap-7 border-t border-ink/20 pt-7 md:grid-cols-[1fr_auto] md:items-start">
                  <p className="text-pretty max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                    {settings.heroIntro}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      className="group inline-flex min-h-12 items-center gap-2 bg-ink px-5 text-sm font-semibold text-night-text transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-signal active:translate-y-0"
                      href="/#work"
                    >
                      {settings.primaryCtaLabel}
                      <ArrowRight
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                        size={17}
                      />
                    </Link>
                    <Link
                      className="inline-flex min-h-12 items-center gap-2 border border-ink/25 bg-paper/55 px-5 text-sm font-semibold text-ink transition-[background-color,border-color] duration-200 hover:border-ink hover:bg-paper"
                      href="/cv"
                    >
                      View CV
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              <aside className="border-y border-ink/20 lg:border-y-0 lg:border-l lg:pl-9">
                <p className="technical-label py-5 text-muted lg:pt-0">
                  Engineering focus
                </p>
                <ol className="divide-y divide-ink/15 border-t border-ink/20">
                  {specialties.map((specialty, index) => (
                    <li className="group py-5" key={specialty.label}>
                      <div className="flex items-start gap-4">
                        <span className="technical-label mt-1 text-signal">
                          0{index + 1}
                        </span>
                        <div>
                          <p className="font-semibold tracking-[-0.02em] text-ink">
                            {specialty.label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted">
                            {specialty.detail}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>

            <div className="grid gap-5 border-t border-ink/20 py-5 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <span className="size-2 rounded-full bg-emerald-600" />
                  Open to software engineering opportunities
                </span>
                <span className="text-muted">Based in Israel · Available globally</span>
              </div>
              <Link
                className="group flex min-h-11 w-fit items-center gap-2 font-semibold text-ink"
                href="/#work"
              >
                Scroll to selected work
                <ArrowDown
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-y-1"
                  size={16}
                />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-ink/20 bg-paper" id="about">
          <div className="page-shell grid gap-10 py-18 sm:py-24 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16 lg:py-30">
            <div>
              <p className="technical-label text-signal">01 / Approach</p>
              <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
                Product thinking and engineering discipline belong in the same
                conversation.
              </p>
            </div>
            <div>
              <h2 className="text-balance max-w-4xl text-3xl font-semibold leading-[1.05] tracking-[-0.055em] text-ink sm:text-5xl lg:text-6xl">
                {settings.aboutTitle}
              </h2>
              <div className="mt-8 grid gap-7 border-t border-ink/20 pt-7 md:grid-cols-2">
                <p className="text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
                  {settings.aboutSummary}
                </p>
                <p className="text-pretty text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
                  The goal is not novelty for its own sake. It is software that
                  explains itself, handles real constraints, and leaves the next
                  engineer with clear decisions instead of hidden assumptions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-night py-18 text-night-text sm:py-24 lg:py-30" id="work">
          <div className="page-shell">
            <div className="grid gap-8 border-b border-white/14 pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="technical-label text-[#ef8b67]">02 / Selected work</p>
                <p className="mt-5 text-sm leading-6 text-night-muted">
                  Real systems, current evidence, honest tradeoffs.
                </p>
              </div>
              <div>
                <h2 className="text-balance text-4xl font-semibold leading-[1] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
                  Case studies, not{" "}
                  <span className="display-serif italic text-[#ef8b67]">
                    gallery cards.
                  </span>
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-night-muted sm:text-lg">
                  Each project is framed around the problem, the engineering
                  decisions, the evidence available today, and what still needs
                  to improve.
                </p>
              </div>
            </div>
            <div className="mt-10 sm:mt-14">
              <FeaturedProjects projects={homepageProjects} />
            </div>
            <div className="mt-9 flex justify-end">
              <Link
                className="group inline-flex min-h-12 items-center gap-3 border border-white/20 px-5 text-sm font-semibold transition-colors hover:border-[#ef8b67] hover:text-[#ef8b67]"
                href="/projects"
              >
                Explore every project
                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  size={17}
                />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-ink/20 bg-background" id="capabilities">
          <div className="page-shell py-18 sm:py-24 lg:py-30">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="technical-label text-signal">03 / Capabilities</p>
              </div>
              <div>
                <h2 className="text-balance max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-ink sm:text-5xl lg:text-6xl">
                  {settings.skillsTitle}
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                  {settings.skillsSummary}
                </p>
              </div>
            </div>
            <div className="mt-10 sm:mt-14">
              <CapabilityGrid skills={settings.skills} />
            </div>
          </div>
        </section>

        <section className="border-b border-ink/20 bg-paper" id="experience">
          <div className="page-shell py-18 sm:py-24 lg:py-30">
            <div className="grid gap-10 lg:grid-cols-[0.66fr_1.34fr] lg:gap-16">
              <div>
                <p className="technical-label text-signal">04 / Background</p>
                <p className="mt-5 max-w-sm text-sm leading-6 text-muted">
                  A software engineering foundation shaped through formal study,
                  self-directed product work, and active technical learning.
                </p>
              </div>
              <div>
                <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-ink sm:text-5xl lg:text-6xl">
                  Growing through{" "}
                  <span className="display-serif italic text-signal">
                    deliberate practice.
                  </span>
                </h2>
                <div className="mt-10 divide-y divide-ink/15 border-y border-ink/20">
                  <article className="grid gap-4 py-7 sm:grid-cols-[9rem_1fr]">
                    <p className="technical-label text-muted">Foundation</p>
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em]">
                        Software engineering graduate
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                        Core computer science and software engineering concepts
                        applied through full-stack product work, backend systems,
                        and structured problem solving.
                      </p>
                    </div>
                  </article>
                  <article className="grid gap-4 py-7 sm:grid-cols-[9rem_1fr]">
                    <p className="technical-label text-muted">Now building</p>
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em]">
                        Product systems with real operational boundaries
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                        Current work covers protected admin flows, database-backed
                        content, safe file handling, applied AI prototypes, and
                        the reliability decisions that make those systems usable.
                      </p>
                    </div>
                  </article>
                  <article className="grid gap-4 py-7 sm:grid-cols-[9rem_1fr]">
                    <p className="technical-label text-muted">Current focus</p>
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em]">
                        {activeLearningTracks.length} active learning{" "}
                        {activeLearningTracks.length === 1 ? "track" : "tracks"}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                        Applied LLM engineering, security fundamentals, and
                        data-structures practice—recorded as learning activity,
                        not presented as substitute experience.
                      </p>
                    </div>
                  </article>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex min-h-12 items-center gap-2 bg-ink px-5 text-sm font-semibold text-night-text transition-colors hover:bg-signal"
                    href="/courses"
                  >
                    <BookOpen aria-hidden="true" size={17} />
                    Learning timeline
                  </Link>
                  <Link
                    className="inline-flex min-h-12 items-center gap-2 border border-ink/25 px-5 text-sm font-semibold text-ink transition-colors hover:border-ink"
                    href="/cv"
                  >
                    <Eye aria-hidden="true" size={17} />
                    {settings.resumeUrl ? "Read CV" : "CV overview"}
                  </Link>
                  {settings.resumeUrl ? (
                    <a
                      className="inline-flex min-h-12 items-center gap-2 px-4 text-sm font-semibold text-muted transition-colors hover:text-ink"
                      href="/api/cv/download"
                    >
                      <Download aria-hidden="true" size={17} />
                      Download
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-signal text-white" id="contact">
          <div
            aria-hidden="true"
            className="absolute -right-40 -top-52 size-[38rem] rounded-full border border-white/20"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-36 size-[30rem] rounded-full border border-white/15"
          />
          <div className="page-shell relative py-18 sm:py-24 lg:py-30">
            <p className="technical-label text-white/72">05 / Contact</p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
              <div>
                <h2 className="text-balance max-w-5xl text-5xl font-medium leading-[0.94] tracking-[-0.07em] sm:text-7xl lg:text-[7rem]">
                  {settings.contactTitle}
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
                  {settings.contactSummary}
                </p>
              </div>
              <div className="border-t border-white/30 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <a
                  className="group flex min-h-14 items-center justify-between border-b border-white/28 py-3 text-base font-semibold"
                  href={`mailto:${settings.contactEmail}`}
                >
                  <span className="flex items-center gap-3">
                    <Mail aria-hidden="true" size={18} />
                    Email me
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    size={20}
                  />
                </a>
                {settings.githubUrl ? (
                  <a
                    className="group flex min-h-14 items-center justify-between border-b border-white/28 py-3 text-base font-semibold"
                    href={settings.githubUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="flex items-center gap-3">
                      <GitBranch aria-hidden="true" size={18} />
                      GitHub
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      size={20}
                    />
                  </a>
                ) : null}
                {settings.linkedinUrl ? (
                  <a
                    className="group flex min-h-14 items-center justify-between border-b border-white/28 py-3 text-base font-semibold"
                    href={settings.linkedinUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="flex items-center gap-3">
                      <Contact aria-hidden="true" size={18} />
                      LinkedIn
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      size={20}
                    />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        contactEmail={settings.contactEmail}
        githubUrl={settings.githubUrl}
        linkedinUrl={settings.linkedinUrl}
        siteName={settings.siteName}
      />
    </div>
  );
}
