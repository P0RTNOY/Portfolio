import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { ProjectPageShell } from "@/components/projects/project-page-shell";
import { ResumeViewer } from "@/components/site/resume-viewer";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CV | Generic Portfolio",
  description: "Read the embedded CV without leaving the portfolio.",
};

export default async function CvPage() {
  const settings = await getSiteSettings();

  return (
    <ProjectPageShell siteName={settings.siteName}>
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <ButtonLink className="mb-6 w-fit" href="/#cv" variant="ghost">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to portfolio
          </ButtonLink>
          <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
            CV
          </Badge>
          <SectionHeading
            eyebrow="Resume"
            title="Read the CV inside the portfolio."
            description="The latest uploaded PDF is embedded below, with options to open or download it."
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ResumeViewer resumeUrl={settings.resumeUrl} />
      </section>
    </ProjectPageShell>
  );
}

