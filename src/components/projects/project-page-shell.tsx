import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

type ProjectPageShellProps = {
  children: React.ReactNode;
};

export function ProjectPageShell({ children }: ProjectPageShellProps) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
