export const CV_FOCUS_AREAS = [
  "Full-stack work",
  "AI tooling",
  "Databases and APIs",
  "Admin workflows",
  "Learning discipline",
] as const;

export const CV_METADATA_DESCRIPTION =
  "Omer Portnoy's professional background and technical focus areas inside the portfolio.";

export const DEFAULT_CONTACT_SUMMARY =
  "I'm open to software engineering opportunities and project conversations. Review the case studies, learning timeline, and CV page for the current overview.";

export function getHomepageCvCopy(hasResume: boolean) {
  return hasResume
    ? {
        availability: "Read the CV online or download the latest PDF.",
        description:
          "A focused view of my experience, education, and technical direction, with the latest PDF ready to review.",
      }
    : {
        availability: "The CV PDF is not available yet.",
        description:
          "A focused view of my experience, education, and technical direction will appear here once it is uploaded. The project case studies and learning timeline remain the current evidence.",
      };
}

export function getCvPageCopy(hasResume: boolean) {
  return hasResume
    ? {
        description:
          "This CV brings the work shown across the site into one hiring-focused record: what I build, how I work, and how I keep learning.",
      }
    : {
        description:
          "The latest CV will appear here once it is uploaded. Until then, the portfolio evidence below highlights what I build, how I work, and how I keep learning.",
      };
}
