import {
  getCourseBySlug,
  listCourses,
  type Course,
} from "@/lib/courses";
import {
  getProjectBySlug,
  listProjects,
  type Project,
} from "@/lib/projects";
import {
  getSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

const fallbackTimestamp = new Date("2026-07-01T00:00:00.000Z");

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  id: "default",
  siteName: "Omer Portnoy",
  heroEyebrow: "Software Engineer · Full-Stack / AI / Automation",
  heroTitle:
    "I engineer practical products where AI, backend systems, and thoughtful interfaces meet.",
  heroIntro:
    "I’m Omer Portnoy, a software engineer who turns product ideas into working systems—from database-backed web platforms and protected tools to AI product prototypes with clear safety and reliability boundaries.",
  primaryCtaLabel: "Explore selected work",
  secondaryCtaLabel: "Start a conversation",
  aboutTitle: "End-to-end thinking, grounded in working software.",
  aboutSummary:
    "I care about the whole path from product intent to production behavior: shaping the interface, designing the data model, building the API, protecting privileged paths, and documenting the decisions that make the system maintainable.",
  skillsTitle: "Capabilities built around real product outcomes.",
  skillsSummary:
    "My current toolkit spans product engineering, backend systems, applied AI, and the delivery practices that turn experiments into dependable software.",
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Python",
    "FastAPI",
    "Node.js",
    "PostgreSQL",
    "Prisma",
    "Supabase",
    "REST APIs",
    "Authentication",
    "LLM Apps",
    "Hugging Face",
    "OpenAI",
    "Automation",
    "Docker",
    "GCP",
    "CI/CD",
    "Security Fundamentals",
    "Data Structures",
  ],
  contactTitle: "Let’s build something useful.",
  contactSummary:
    "I’m open to software engineering opportunities where I can contribute across product, backend, and AI-focused work while continuing to grow with a strong team.",
  contactEmail: "omerportnoy@gmail.com",
  githubUrl: "https://github.com/P0RTNOY",
  linkedinUrl: null,
  resumeUrl: null,
  createdAt: fallbackTimestamp,
  updatedAt: fallbackTimestamp,
};

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "fallback-portfolio-platform",
    title: "Personal Portfolio Platform",
    slug: "personal-portfolio-platform",
    shortDescription:
      "A full-stack portfolio platform with protected content workflows, database-backed case studies, file uploads, and server-side AI integrations.",
    fullDescription:
      "This portfolio is a working full-stack application rather than a static gallery of hardcoded cards.\n\nProjects, learning records, site settings, and uploaded files are managed as structured data, allowing the public experience to evolve without duplicating presentation logic.\n\n## Architecture / implementation\nDecision: keep the public site and protected content tools in one Next.js App Router application, use Prisma for typed server-side data access, and use Supabase Postgres and Storage for records and files.\n\nWhy: one content model keeps public and admin workflows aligned, while server-only integrations prevent provider credentials from reaching the browser.\n\nResult: project records, learning content, site copy, and uploaded assets can be maintained through protected workflows. The tradeoff is that public availability needs an explicit fallback when the content service is unavailable.\n\n## Lessons learned and next steps\n- Separating content from presentation makes the portfolio easier to extend\n- Protected write paths need validation, authorization, and explicit feedback\n- External content services need graceful public degradation\n- Next steps focus on richer project media and broader integration coverage",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "Supabase",
      "PostgreSQL",
      "Zod",
    ],
    githubUrl: "https://github.com/P0RTNOY/Portfolio",
    liveUrl: null,
    imageUrl: null,
    screenshots: [],
    status: "in-progress",
    featured: true,
    role: "Full-stack developer",
    highlights: [
      "Database-backed public portfolio",
      "Protected admin and upload workflows",
      "Typed server-side data access",
      "Graceful public content fallbacks",
    ],
    problemSolved:
      "A static portfolio makes every content change a deployment. I separated content from presentation so projects, learning records, site copy, and uploaded assets can be maintained through protected workflows while the public UI consumes one structured model.",
    technicalChallenges:
      "- Designing reusable content models without overcomplicating the schema\n- Protecting project, course, CV, and settings workflows\n- Keeping secrets and provider calls on the server\n- Preserving public availability when the content database is unavailable",
    displayOrder: 1,
    createdAt: fallbackTimestamp,
    updatedAt: fallbackTimestamp,
  },
  {
    id: "fallback-ai-pictionary",
    title: "AI Pictionary Game",
    slug: "ai-pictionary-game",
    shortDescription:
      "An AI product prototype where a backend generates sanitized SVG clue rounds and coordinates an asynchronous create, wait, guess, and result flow.",
    fullDescription:
      "AI Pictionary explores a playful AI interaction beyond a chat interface.\n\nOne player writes a prompt, the backend produces SVG clue rounds, and another player submits a guess after generation completes.\n\n## Architecture / implementation\nDecision: split the prototype into an Expo React Native client and a FastAPI round API, then treat model output as untrusted input before rendering it.\n\nWhy: the client owns the create, wait, guess, and result states while the backend owns model calls, SVG sanitization, and scoring.\n\nResult: the same round flow can use provider-backed generation when configured or deterministic local artists and similarity scoring during development. The fallback improves repeatability without pretending to reproduce every live-model failure mode.\n\n## Lessons learned and next steps\n- Product flow matters as much as model output in an AI prototype\n- Generated SVG must be sanitized before reaching the renderer\n- Deterministic fallbacks keep the round flow testable\n- Next steps are persistent multiplayer state and clearer model comparison",
    techStack: [
      "Python",
      "FastAPI",
      "Pydantic",
      "OpenRouter",
      "LLMs",
      "Expo",
      "React Native",
      "TypeScript",
    ],
    githubUrl: "https://github.com/P0RTNOY/AI-Pictionary-Game",
    liveUrl: null,
    imageUrl: null,
    screenshots: [],
    status: "in-progress",
    featured: true,
    role: "Product concept creator and prototype developer",
    highlights: [
      "Prompt-to-SVG gameplay",
      "Asynchronous round state",
      "Untrusted SVG sanitization",
      "Deterministic local fallbacks",
    ],
    problemSolved:
      "A chat demo would not expose async generation, untrusted visual output, or a multi-step game loop. The guessing mechanic makes each of those constraints part of the product experience.",
    technicalChallenges:
      "- Generating recognizable SVG-only responses\n- Preventing the answer from leaking into visual output\n- Coordinating create, wait, guess, and result states\n- Sanitizing model-authored SVG before rendering",
    displayOrder: 2,
    createdAt: fallbackTimestamp,
    updatedAt: fallbackTimestamp,
  },
];

export const FALLBACK_COURSES: Course[] = [
  {
    id: "fallback-llm-engineer",
    title: "Become an LLM Engineer in 8 Weeks",
    slug: "become-an-llm-engineer-in-8-weeks",
    provider: "Udemy",
    courseUrl: "https://lnkd.in/dY83N4wi",
    imageUrl: null,
    shortDescription:
      "An applied AI track covering LLM application patterns, RAG, LoRA, agents, evaluation, and product-focused delivery.",
    fullDescription:
      "This applied AI track moves from basic model usage toward the design, evaluation, deployment, and iteration of LLM-powered product features.",
    skills: [
      "LLMs",
      "Generative AI",
      "RAG",
      "AI Agents",
      "LoRA",
      "Python",
      "Deployment",
    ],
    instructor: "Ed Donner",
    status: "in-progress",
    progress: 20,
    certificateUrl: null,
    credentialUrl: null,
    startedAt: null,
    completedAt: null,
    featured: true,
    displayOrder: 1,
    createdAt: fallbackTimestamp,
    updatedAt: fallbackTimestamp,
  },
  {
    id: "fallback-security",
    title: "CompTIA Security+ Preparation",
    slug: "comptia-security-plus-preparation",
    provider: "Udemy / Self-study",
    courseUrl: "https://www.comptia.org/certifications/security",
    imageUrl: null,
    shortDescription:
      "A security fundamentals track covering authentication, networking, identity, risk, and common software vulnerabilities.",
    fullDescription:
      "This track reinforces practical security awareness around access control, networking, infrastructure risk, and secure development decisions.",
    skills: [
      "Security Fundamentals",
      "Networking",
      "Identity and Access",
      "Risk Management",
      "Secure Development",
    ],
    instructor: null,
    status: "in-progress",
    progress: 15,
    certificateUrl: null,
    credentialUrl: null,
    startedAt: null,
    completedAt: null,
    featured: false,
    displayOrder: 2,
    createdAt: fallbackTimestamp,
    updatedAt: fallbackTimestamp,
  },
  {
    id: "fallback-dsa",
    title: "Data Structures & Algorithms Practice",
    slug: "data-structures-and-algorithms-practice",
    provider: "Self-study",
    courseUrl: "https://leetcode.com/problemset/",
    imageUrl: null,
    shortDescription:
      "A consistent practice track for problem solving, pattern recognition, and core computer science fluency.",
    fullDescription:
      "This track focuses on repeated practice with arrays, strings, hash maps, stacks, queues, two pointers, and common interview problem patterns.",
    skills: [
      "Data Structures",
      "Algorithms",
      "Python",
      "Hash Maps",
      "Two Pointers",
      "Stacks",
      "Queues",
    ],
    instructor: null,
    status: "in-progress",
    progress: 25,
    certificateUrl: null,
    credentialUrl: null,
    startedAt: null,
    completedAt: null,
    featured: false,
    displayOrder: 3,
    createdAt: fallbackTimestamp,
    updatedAt: fallbackTimestamp,
  },
];

export type PublicPortfolioReaders = {
  getCourseBySlug: typeof getCourseBySlug;
  getProjectBySlug: typeof getProjectBySlug;
  getSiteSettings: typeof getSiteSettings;
  listCourses: typeof listCourses;
  listProjects: typeof listProjects;
};

const defaultReaders: PublicPortfolioReaders = {
  getCourseBySlug,
  getProjectBySlug,
  getSiteSettings,
  listCourses,
  listProjects,
};

type FallbackSource = "settings" | "projects" | "courses";
const PUBLIC_CONTENT_READ_TIMEOUT_MS = 1_500;

function reportFallback(source: FallbackSource) {
  console.warn(`Public portfolio ${source} fallback activated.`);
}

export async function readWithDeadline<T>(
  read: () => Promise<T>,
  timeoutMs = PUBLIC_CONTENT_READ_TIMEOUT_MS,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Public content read timed out.")),
      timeoutMs,
    );

    void read().then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

async function readOrFallback<T>(
  read: () => Promise<T>,
  fallback: T,
  source: FallbackSource,
  shouldReport: boolean,
): Promise<{ data: T; usedFallback: boolean }> {
  try {
    return { data: await readWithDeadline(read), usedFallback: false };
  } catch {
    if (shouldReport) {
      reportFallback(source);
    }
    return { data: fallback, usedFallback: true };
  }
}

export async function getPublicPortfolioData(
  readers: PublicPortfolioReaders = defaultReaders,
) {
  const shouldReport = readers === defaultReaders;
  const [settings, projects, courses] = await Promise.all([
    readOrFallback(
      readers.getSiteSettings,
      FALLBACK_SITE_SETTINGS,
      "settings",
      shouldReport,
    ),
    readOrFallback(
      readers.listProjects,
      FALLBACK_PROJECTS,
      "projects",
      shouldReport,
    ),
    readOrFallback(
      readers.listCourses,
      FALLBACK_COURSES,
      "courses",
      shouldReport,
    ),
  ]);

  const fallbackSources: FallbackSource[] = [];
  if (settings.usedFallback) fallbackSources.push("settings");
  if (projects.usedFallback) fallbackSources.push("projects");
  if (courses.usedFallback) fallbackSources.push("courses");

  return {
    settings: settings.data,
    projects: projects.data,
    courses: courses.data,
    fallbackSources,
  };
}

export async function getPublicProjectBySlug(
  slug: string,
  readers: PublicPortfolioReaders = defaultReaders,
) {
  try {
    return await readWithDeadline(() => readers.getProjectBySlug(slug));
  } catch {
    if (readers === defaultReaders) {
      reportFallback("projects");
    }
    return FALLBACK_PROJECTS.find((project) => project.slug === slug) ?? null;
  }
}

export async function getPublicCourseBySlug(
  slug: string,
  readers: PublicPortfolioReaders = defaultReaders,
) {
  try {
    return await readWithDeadline(() => readers.getCourseBySlug(slug));
  } catch {
    if (readers === defaultReaders) {
      reportFallback("courses");
    }
    return FALLBACK_COURSES.find((course) => course.slug === slug) ?? null;
  }
}
