import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

type ProjectPageShellProps = {
  children: React.ReactNode;
  siteName?: string;
  contactEmail?: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
};

export function ProjectPageShell({
  children,
  siteName,
  contactEmail,
  githubUrl,
  linkedinUrl,
}: ProjectPageShellProps) {
  return (
    <div className="min-h-dvh">
      <SiteHeader siteName={siteName} />
      <main id="main-content">{children}</main>
      <SiteFooter
        contactEmail={contactEmail}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        siteName={siteName}
      />
    </div>
  );
}
