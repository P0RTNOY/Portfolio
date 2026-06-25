import { GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";

type CourseVisualProps = {
  className?: string;
  imageUrl?: string | null;
  title: string;
};

function safeBackgroundImage(url: string) {
  return `url("${url.replaceAll('"', "%22")}")`;
}

export function CourseVisual({ className, imageUrl, title }: CourseVisualProps) {
  if (imageUrl) {
    return (
      <div
        aria-label={`${title} course image`}
        className={cn(
          "aspect-[16/10] rounded-md border border-zinc-200 bg-cover bg-center dark:border-zinc-800",
          className,
        )}
        role="img"
        style={{ backgroundImage: safeBackgroundImage(imageUrl) }}
      />
    );
  }

  return (
    <div
      aria-label={`${title} course placeholder image`}
      className={cn(
        "relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800",
        className,
      )}
      role="img"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.28),transparent_35%),linear-gradient(315deg,rgba(245,158,11,0.3),transparent_36%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="relative flex size-14 items-center justify-center rounded-lg border border-white/20 bg-white/10">
        <GraduationCap aria-hidden="true" size={24} />
      </div>
    </div>
  );
}

