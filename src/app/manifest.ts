import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Omer Portnoy | Software Engineer",
    short_name: "Omer Portnoy",
    description:
      "Practical full-stack products, AI prototypes, backend systems, and automation workflows.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3eee4",
    theme_color: "#f3eee4",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
