import { ImageIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type ProjectGalleryProps = {
  images: string[];
  title: string;
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="project-gallery-title"
      className="border-y border-white/12 bg-night text-night-text"
    >
      <div className="page-shell py-16 sm:py-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="technical-label text-[#ef8b67]">
              Evidence / screenshots
            </p>
            <h2
              className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl"
              id="project-gallery-title"
            >
              Project images
            </h2>
          </div>
          <p className="text-sm text-night-muted">
            {images.length} {images.length === 1 ? "image" : "images"}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <a
              aria-label={`Open ${title} screenshot ${index + 1}`}
              className={cn(
                "group relative block overflow-hidden border border-white/14 bg-night-soft outline-none transition-colors hover:border-[#ef8b67]/70",
                index === 0 ? "sm:col-span-2" : "",
              )}
              href={image}
              key={`${image}-${index}`}
              rel="noreferrer"
              target="_blank"
            >
              <div
                className={cn(
                  "relative transition-transform duration-300 group-hover:scale-[1.02]",
                  index === 0 ? "aspect-[16/9]" : "aspect-[4/3]",
                )}
              >
                <Image
                  alt={`${title} screenshot ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes={index === 0 ? "100vw" : "(min-width: 640px) 50vw, 100vw"}
                  src={image}
                  unoptimized
                />
              </div>
              <div className="pointer-events-none absolute left-3 top-3 flex min-h-11 items-center gap-2 border border-white/20 bg-night/75 px-3 text-sm font-semibold text-white backdrop-blur">
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
