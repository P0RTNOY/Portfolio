import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

type ProjectPageShellProps = {
  children: React.ReactNode;
  siteName?: string;
};

export function ProjectPageShell({ children, siteName }: ProjectPageShellProps) {
  return (
    <div className="min-h-dvh">
      <SiteHeader siteName={siteName} />
      <main id="main-content">{children}</main>
      <SiteFooter siteName={siteName} />
    </div>
  );
}
