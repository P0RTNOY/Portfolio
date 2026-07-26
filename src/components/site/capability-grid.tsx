import { ArrowUpRight } from "lucide-react";

const capabilityDefinitions = [
  {
    title: "Product engineering",
    description:
      "Interfaces and application flows that turn complex systems into understandable products.",
    matches: ["TypeScript", "React", "Next.js", "Node.js"],
  },
  {
    title: "Backend & data",
    description:
      "Typed APIs, durable data models, protected workflows, and server-side integrations.",
    matches: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Prisma",
      "Supabase",
      "REST APIs",
      "Authentication",
    ],
  },
  {
    title: "Applied AI",
    description:
      "AI features designed as product systems, with model output treated as untrusted input.",
    matches: [
      "LLM Apps",
      "AI Integrations",
      "Hugging Face",
      "OpenAI",
    ],
  },
  {
    title: "Delivery & reliability",
    description:
      "Automation, deployment, security awareness, and feedback loops that support maintainable delivery.",
    matches: [
      "Automation",
      "Docker",
      "GCP",
      "CI/CD",
      "Security Fundamentals",
      "Data Structures",
    ],
  },
] as const;

export type CapabilityGroup = {
  title: string;
  description: string;
  skills: string[];
};

export function groupSkills(skills: string[]): CapabilityGroup[] {
  const availableSkills = new Set(skills);
  const grouped = new Set<string>();
  const groups: CapabilityGroup[] = capabilityDefinitions
    .map((definition) => {
      const matchedSkills = definition.matches.filter((skill) => {
        if (!availableSkills.has(skill) || grouped.has(skill)) return false;
        grouped.add(skill);
        return true;
      });

      return {
        title: definition.title,
        description: definition.description,
        skills: matchedSkills,
      };
    })
    .filter((group) => group.skills.length > 0);
  const remaining = skills.filter((skill) => !grouped.has(skill));

  if (remaining.length > 0) {
    groups.push({
      title: "Additional tools",
      description:
        "Supporting technologies and fundamentals used as the product context requires.",
      skills: remaining,
    });
  }

  return groups;
}

type CapabilityGridProps = {
  skills: string[];
};

export function CapabilityGrid({ skills }: CapabilityGridProps) {
  const groups = groupSkills(skills);

  return (
    <div className="divide-y divide-ink/15 border-y border-ink/20">
      {groups.map((group, index) => (
        <article
          className="group grid gap-5 py-7 sm:grid-cols-[4rem_0.75fr_1fr] sm:gap-8 sm:py-9 lg:grid-cols-[6rem_0.8fr_1.2fr]"
          key={group.title}
        >
          <div className="flex items-start justify-between sm:block">
            <span className="technical-label text-signal">
              0{index + 1}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="text-ink/25 transition-[color,transform] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal sm:mt-8"
              size={20}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink sm:text-2xl">
              {group.title}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              {group.description}
            </p>
          </div>
          <ul className="flex flex-wrap content-start gap-x-2 gap-y-2">
            {group.skills.map((skill) => (
              <li
                className="border border-ink/15 bg-paper/65 px-3 py-2 font-mono text-xs font-medium text-ink transition-[background-color,border-color] duration-200 group-hover:border-ink/25 group-hover:bg-paper"
                key={skill}
              >
                {skill}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
