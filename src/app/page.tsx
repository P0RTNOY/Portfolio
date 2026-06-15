import { ArrowRight, Database, Layers, ShieldCheck } from "lucide-react";

import { ProjectsGrid } from "@/components/projects/projects-grid";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listProjects } from "@/lib/projects";

const skillGroups = [
  "Frontend",
  "Backend",
  "Design Systems",
  "Automation",
  "AI Integrations",
  "Deployment",
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await listProjects();
  const featuredProjects = projects.filter((project) => project.featured);
  const homepageProjects =
    featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="top">
        <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="flex flex-col justify-center">
              <Badge className="mb-6 w-fit border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
                Generic portfolio
              </Badge>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl">
                Your Name, professional title, and selected work.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                A concise introduction placeholder for the kind of work,
                outcomes, and collaborations this portfolio will represent.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/projects" size="lg">
                  View Projects
                  <ArrowRight aria-hidden="true" size={18} />
                </ButtonLink>
                <ButtonLink href="/#contact" size="lg" variant="secondary">
                  Contact Me
                </ButtonLink>
              </div>
            </div>
            <Card className="overflow-hidden">
              <CardHeader>
                <p className="text-sm font-semibold uppercase text-zinc-500">
                  Profile snapshot
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: Database,
                    title: "Selected work",
                    text: `${projects.length} editable project entries are currently stored in the database.`,
                  },
                  {
                    icon: ShieldCheck,
                    title: "Clear presentation",
                    text: "Each project can highlight context, role, links, and technologies.",
                  },
                  {
                    icon: Layers,
                    title: "Reusable structure",
                    text: "The layout stays consistent as new content is added over time.",
                  },
                ].map((item) => (
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
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="about" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="About"
            title="A concise professional summary will live here."
            description="Use this space for a short editable introduction. Keep it focused on the type of work, values, and outcomes you want the portfolio to communicate."
          />
        </section>

        <section
          id="projects"
          className="border-y border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-950/60"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Projects"
              title="Selected projects."
              description="Published work will appear here with descriptions, links, status, and technologies."
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

        <section id="skills" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Skills"
            title="Editable skill categories."
            description="These categories are generic for now and can become database-backed content later."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {skillGroups.map((skill) => (
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
              title="Generic contact details."
              description="Add preferred email, social links, or a contact form once the editable content model is in place."
            />
            <ButtonLink href="mailto:hello@example.com" size="lg" variant="secondary">
              hello@example.com
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
