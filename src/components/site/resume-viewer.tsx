import { Download, ExternalLink, FileText } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ResumeViewerProps = {
  className?: string;
  compact?: boolean;
  resumeUrl: string | null;
};

export function ResumeViewer({
  className,
  compact = false,
  resumeUrl,
}: ResumeViewerProps) {
  if (!resumeUrl) {
    return (
      <div
        className={cn(
          "flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30",
          className,
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          <FileText aria-hidden="true" size={24} />
        </div>
        <h3 className="mt-4 text-base font-bold text-zinc-950 dark:text-white">
          CV preview is empty
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Upload a PDF resume from the admin settings page to show it directly
          inside the portfolio.
        </p>
        <ButtonLink className="mt-6" href="/admin/settings" variant="secondary">
          Add CV
        </ButtonLink>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 shadow-xl shadow-zinc-950/10 dark:border-zinc-800 dark:shadow-black/30",
        className,
      )}
    >
      <div className="flex min-h-14 flex-col gap-3 border-b border-white/10 bg-zinc-950 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold">CV Preview</p>
          <p className="mt-0.5 truncate text-xs text-zinc-400">
            Embedded PDF reader
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink
            className="border-white/15 bg-white/10 text-white hover:bg-white/15 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            href={resumeUrl}
            rel="noreferrer"
            size="sm"
            target="_blank"
            variant="secondary"
          >
            <ExternalLink aria-hidden="true" size={16} />
            Open
          </ButtonLink>
          <ButtonLink
            className="border-white/15 bg-white/10 text-white hover:bg-white/15 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            download
            href={resumeUrl}
            size="sm"
            variant="secondary"
          >
            <Download aria-hidden="true" size={16} />
            Download
          </ButtonLink>
        </div>
      </div>

      <div
        className={cn(
          "relative bg-zinc-800",
          compact ? "h-[460px] sm:h-[560px]" : "h-[calc(100dvh-230px)] min-h-[620px]",
        )}
      >
        <iframe
          className="h-full w-full bg-white"
          loading="lazy"
          src={`${resumeUrl}#view=FitH`}
          title="Embedded CV PDF"
        />
      </div>
    </div>
  );
}

