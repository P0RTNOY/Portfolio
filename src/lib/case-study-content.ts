export type CaseStudySection = {
  body: string;
  title: string;
};

type CaseStudyContentInput = {
  description: string;
  problemSolved?: string | null;
  technicalChallenges?: string | null;
};

type SectionKind =
  | "implementation"
  | "lessons"
  | "other"
  | "overview"
  | "problem"
  | "technical-challenges";

const fallbackOverview =
  "A detailed project description can be added from the admin dashboard.";

function sectionKind(title: string): SectionKind {
  const normalizedTitle = title.trim().toLowerCase();

  if (normalizedTitle === "overview") {
    return "overview";
  }

  if (/^problem(?: solved)?$/.test(normalizedTitle)) {
    return "problem";
  }

  if (/(architecture|implementation)/.test(normalizedTitle)) {
    return "implementation";
  }

  if (/^(?:technical )?challenges?$/.test(normalizedTitle)) {
    return "technical-challenges";
  }

  if (/(lessons?|what i learned|next steps?|follow[- ]?up)/.test(normalizedTitle)) {
    return "lessons";
  }

  return "other";
}

function parseDescription(description: string): CaseStudySection[] {
  const sections: CaseStudySection[] = [];
  let current: CaseStudySection = { title: "Overview", body: "" };

  for (const line of description.split("\n")) {
    const heading = line.match(/^\s*##\s+(.+?)\s*$/);

    if (heading) {
      if (current.body.trim()) {
        sections.push({ ...current, body: current.body.trim() });
      }

      current = { title: heading[1].trim(), body: "" };
      continue;
    }

    current.body = `${current.body}${current.body ? "\n" : ""}${line}`;
  }

  if (current.body.trim()) {
    sections.push({ ...current, body: current.body.trim() });
  }

  return sections;
}

function uniqueBodies(bodies: Array<string | null | undefined>) {
  const seen = new Set<string>();

  return bodies.flatMap((body) => {
    const trimmedBody = body?.trim();
    const identity = trimmedBody?.replace(/\s+/g, " ").toLowerCase();

    if (!trimmedBody || !identity || seen.has(identity)) {
      return [];
    }

    seen.add(identity);
    return [trimmedBody];
  });
}

function mergedSection(
  title: string,
  bodies: Array<string | null | undefined>,
): CaseStudySection | null {
  const unique = uniqueBodies(bodies);

  return unique.length > 0 ? { title, body: unique.join("\n\n") } : null;
}

export function buildCaseStudySections({
  description,
  problemSolved,
  technicalChallenges,
}: CaseStudyContentInput): CaseStudySection[] {
  const parsedSections = parseDescription(description);
  const grouped = (kind: SectionKind) =>
    parsedSections.filter((section) => sectionKind(section.title) === kind);
  const overview =
    mergedSection(
      "Overview",
      grouped("overview").map((section) => section.body),
    ) ?? { title: "Overview", body: fallbackOverview };
  const problem = mergedSection("Problem solved", [
    problemSolved,
    ...grouped("problem").map((section) => section.body),
  ]);
  const challenges = mergedSection("Technical challenges", [
    technicalChallenges,
    ...grouped("technical-challenges").map((section) => section.body),
  ]);

  return [
    overview,
    ...(problem ? [problem] : []),
    ...grouped("implementation"),
    ...(challenges ? [challenges] : []),
    ...grouped("other"),
    ...grouped("lessons"),
  ];
}
