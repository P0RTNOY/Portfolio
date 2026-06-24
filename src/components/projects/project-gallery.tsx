import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ProjectGalleryProps = {
  images: string[];
  title: string;
};

function safeBackgroundImage(url: string) {
  return `url("${url.replaceAll('"', "%22")}")`;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="project-gallery-title"
      className="border-y border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-950/60"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700 dark:text-teal-300">
              Screenshots
            </p>
            <h2
              className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white"
              id="project-gallery-title"
            >
              Project images
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {images.length} {images.length === 1 ? "image" : "images"}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <a
              aria-label={`Open ${title} screenshot ${index + 1}`}
              className={cn(
                "group relative block overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 outline-none transition-colors hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700",
                index === 0 ? "sm:col-span-2" : "",
              )}
              href={image}
              key={`${image}-${index}`}
              rel="noreferrer"
              target="_blank"
            >
              <div
                aria-label={`${title} screenshot ${index + 1}`}
                className={cn(
                  "bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]",
                  index === 0 ? "aspect-[16/9]" : "aspect-[4/3]",
                )}
                role="img"
                style={{ backgroundImage: safeBackgroundImage(image) }}
              />
              <div className="pointer-events-none absolute left-3 top-3 flex min-h-11 items-center gap-2 rounded-md border border-white/20 bg-zinc-950/70 px-3 text-sm font-semibold text-white backdrop-blur">
                <ImageIcon aria-hidden="true" size={16} />
                {index === 0 ? "Main screenshot" : `Screenshot ${index + 1}`}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
