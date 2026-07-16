import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projectCaseStudies = [
  {
    title: "Personal Portfolio Platform",
    slug: "personal-portfolio-platform",
    shortDescription:
      "A full-stack portfolio with protected admin workflows, database-backed content, file uploads, and server-side integrations.",
    fullDescription:
      "This portfolio is a working full-stack application rather than a static gallery of hardcoded cards.\n\nProjects, courses, site settings, and uploaded files are managed as data, so the public pages can change without rewriting their components.\n\n## Architecture / implementation\nDecision: keep the public site and protected content tools in one Next.js App Router application, use Prisma for typed server-side data access, and use Supabase Postgres and Storage for records and files.\n\nWhy: one content model reduces duplicated page logic, while server-only provider calls keep credentials out of the browser.\n\nResult: project and course records, site copy, and uploaded assets can be changed through admin workflows instead of hardcoded UI edits. The tradeoff is greater reliance on database, storage, validation, and error-state behavior than a static portfolio would require.\n\n## Lessons learned and next steps\n- Separating content from presentation made the project and course pages easier to extend\n- Protected write paths need validation and explicit loading and error states\n- Server-side integrations are easier to reason about when provider credentials never enter client components\n- Next steps are richer project media and focused tests around forms, permissions, and data access",
    techStack: JSON.stringify([
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "Supabase",
      "PostgreSQL",
      "Zod",
      "Hugging Face",
    ]),
    githubUrl: "https://github.com/P0RTNOY/Portfolio",
    liveUrl: null,
    imageUrl: null,
    screenshots: JSON.stringify([]),
    status: "in-progress",
    featured: true,
    role: "Full-stack developer",
    highlights: JSON.stringify([
      "Database-backed public portfolio",
      "Protected admin dashboard",
      "Project and course CRUD",
      "Editable site settings",
      "CV/resume upload support",
      "Supabase Storage uploads",
      "Server-side AI helper routes",
      "Validated admin content workflows",
    ]),
    problemSolved:
      "Static project cards would make every content change a code change. I separated content from presentation so project records, learning records, site copy, and uploaded files can be maintained through protected workflows while the public UI reads the same structured data.",
    technicalChallenges:
      "- Designing reusable project and course models without overcomplicating the schema\n- Building protected admin flows for projects, courses, CV files, and site settings\n- Keeping Prisma reads clean while the data lives in Supabase Postgres\n- Handling Supabase Storage uploads for project images and resume files\n- Keeping the public pages polished while the content stays database-driven\n- Adding AI-assisted content tooling without exposing secrets to the frontend",
    displayOrder: 1,
  },
  {
    title: "AI Pictionary Game",
    slug: "ai-pictionary-game",
    shortDescription:
      "An AI product prototype where players write a prompt, the backend generates sanitized SVG clue rounds, and the game runs asynchronously while the guesser waits.",
    fullDescription:
      "AI Pictionary Game is an early-stage prototype for testing a playful AI interaction beyond a chat interface.\n\nOne player writes a prompt, the backend produces SVG clue rounds, and another player submits a guess after waiting for generation to finish.\n\n## Architecture / implementation\nDecision: split the prototype into an Expo React Native client and a FastAPI round API, then treat model output as untrusted input before rendering it.\n\nWhy: the client can focus on the create, wait, guess, and result states while the backend owns model calls, SVG sanitization, and scoring.\n\nResult: the same round flow can use OpenRouter-backed generation when configured or deterministic local artists and similarity scoring during development. That fallback improves repeatability, but it does not reproduce every failure mode of a live model.\n\n## Lessons learned and next steps\n- Product flow matters as much as model output in an AI prototype\n- Generated SVG needs sanitization before it reaches the mobile renderer\n- Deterministic fallbacks make the round flow testable without provider access\n- Next steps are persistent multiplayer state, clearer model comparison, and a smoother replay experience",
    techStack: JSON.stringify([
      "Python",
      "FastAPI",
      "Pydantic",
      "OpenRouter",
      "LLMs",
      "SVG generation",
      "defusedxml",
      "Expo",
      "React Native",
      "TypeScript",
      "react-native-svg",
      "pytest",
    ]),
    githubUrl: "https://github.com/P0RTNOY/AI-Pictionary-Game",
    liveUrl: null,
    imageUrl: null,
    screenshots: JSON.stringify([]),
    status: "in-progress",
    featured: true,
    role: "Product concept creator and prototype developer",
    highlights: JSON.stringify([
      "AI product prototype",
      "Multi-model SVG generation idea",
      "Turn-based guessing game mechanic",
      "Asynchronous two-player flow",
      "Prompt-to-SVG gameplay",
      "OpenRouter-backed model experiments",
      "SVG sanitization for untrusted AI output",
      "Local fallback scoring and mock artists",
    ]),
    problemSolved:
      "A chat-style demo would not test async generation, untrusted visual output, or a multi-step game loop. I used a guessing game to make those constraints visible: generation becomes a waiting state, sanitized SVG becomes the clue, and scoring closes the round.",
    technicalChallenges:
      "- Generating clean SVG-only responses from LLMs\n- Creating prompts that stay recognizable without leaking the answer text\n- Comparing low, mid, and high artist outputs in a way players can feel\n- Designing an async create/wait/guess/result flow that does not break the round state\n- Preventing the original prompt from being revealed before the guess\n- Sanitizing untrusted SVG before rendering it in the mobile app\n- Structuring rounds, prompts, guesses, and generated drawings cleanly in the backend and client",
    displayOrder: 2,
  },
];

const demoProjectFilters = [
  { slug: "example-web-app", title: "Example Web App" },
  { slug: "example-api-project", title: "Example API Project" },
  { slug: "example-automation-tool", title: "Example Automation Tool" },
  {
    slug: "draft-full-stack-product-case-study",
    title: "Draft Full-Stack Product Case Study",
  },
  { slug: "draft-backend-api-case-study", title: "Draft Backend API Case Study" },
  {
    slug: "draft-automation-workflow-case-study",
    title: "Draft Automation Workflow Case Study",
  },
];

const demoSiteSettings = {
  id: "default",
  siteName: "Omer Portnoy",
  heroEyebrow: "Junior Software Engineer · Full-Stack / AI / Automation",
  heroTitle:
    "I build practical full-stack software, AI tools, and automation workflows.",
  heroIntro:
    "I'm Omer Portnoy, and this portfolio documents working software and prototypes, not templates. I focus on junior SWE readiness through implementation evidence, steady learning, and clear communication while building backend systems, admin dashboards, LLM-powered apps, developer tools, and automation workflows.",
  primaryCtaLabel: "Explore the platform",
  secondaryCtaLabel: "Contact me",
  aboutTitle: "Software engineer focused on building end-to-end products.",
  aboutSummary:
    "I like taking products from idea to working software: planning the UI, wiring APIs, working with databases, adding authentication, and documenting what remains. I'm building the habits junior software engineering teams look for—clear communication, steady learning, and the discipline to keep improving with every project.",
  skillsTitle: "Technical focus areas that support hiring decisions.",
  skillsSummary:
    "A hiring-focused snapshot of the tools and fundamentals I use to turn ideas into working products: frontend and backend work, databases, APIs, authentication, deployment practices, and the learning habits that help me keep improving.",
  skills: JSON.stringify([
    "Python",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "FastAPI",
    "Supabase",
    "PostgreSQL",
    "Prisma",
    "Docker",
    "GCP",
    "REST APIs",
    "AI Integrations",
    "LLM Apps",
    "Hugging Face",
    "OpenAI",
    "Automation",
    "CI/CD",
    "Data Structures",
    "Security Fundamentals",
  ]),
  contactTitle: "Open to junior software engineering opportunities.",
  contactSummary:
    "I'm open to junior software engineering opportunities and project conversations. This portfolio is set up so recruiters can quickly see project scope, responsibilities, implementation decisions, and the available evidence.",
  contactEmail: "omerportnoy@gmail.com",
  githubUrl: "https://github.com/P0RTNOY",
  linkedinUrl: null,
  resumeUrl: null,
};

const learningRecords = [
  {
    title: "Become an LLM Engineer in 8 Weeks",
    slug: "become-an-llm-engineer-in-8-weeks",
    provider: "Udemy",
    courseUrl: "https://lnkd.in/dY83N4wi",
    imageUrl: null,
    shortDescription:
      "A practical LLM engineering course focused on building and deploying LLM apps while learning Generative AI, RAG, LoRA, agents, and modern AI product patterns.",
    fullDescription:
      "I am taking this course to move beyond simply using ChatGPT and better understand how LLM-powered applications are built, deployed, evaluated, and improved. The course is structured as an 8-week practical journey through LLM apps, RAG, LoRA, AI agents, and product-oriented AI development.",
    skills: JSON.stringify([
      "LLMs",
      "Generative AI",
      "RAG",
      "AI Agents",
      "LoRA",
      "OpenAI",
      "Hugging Face",
      "Python",
      "Deployment",
      "AI Products",
    ]),
    instructor: "Ed Donner",
    status: "in-progress",
    progress: 20,
    certificateUrl: null,
    credentialUrl: null,
    startedAt: null,
    completedAt: null,
    featured: true,
    displayOrder: 1,
  },
  {
    title: "CompTIA Security+ Preparation",
    slug: "comptia-security-plus-preparation",
    provider: "Udemy / Self-study",
    courseUrl: "https://www.comptia.org/certifications/security",
    imageUrl: null,
    shortDescription:
      "A security fundamentals learning track focused on networking, risk, identity, threats, vulnerabilities, and practical security awareness for software engineering.",
    fullDescription:
      "This learning track supports my software engineering foundation by strengthening security awareness around authentication, infrastructure, networking, access control, vulnerabilities, and secure development practices.",
    skills: JSON.stringify([
      "Security Fundamentals",
      "Networking",
      "Risk Management",
      "Identity and Access",
      "Threats",
      "Vulnerabilities",
      "Secure Development",
      "Cloud Security Basics",
    ]),
    instructor: null,
    status: "in-progress",
    progress: 15,
    certificateUrl: null,
    credentialUrl: null,
    startedAt: null,
    completedAt: null,
    featured: false,
    displayOrder: 2,
  },
  {
    title: "Data Structures & Algorithms Practice",
    slug: "data-structures-and-algorithms-practice",
    provider: "Self-study",
    courseUrl: "https://leetcode.com/problemset/",
    imageUrl: null,
    shortDescription:
      "A continuous practice track for coding interviews and software engineering fundamentals, focused on Python problem solving, common patterns, and algorithmic thinking.",
    fullDescription:
      "This track helps me sharpen core computer science fundamentals and interview readiness through repeated practice with common problem-solving patterns such as hash maps, stacks, queues, two pointers, arrays, strings, and running-state algorithms.",
    skills: JSON.stringify([
      "Data Structures",
      "Algorithms",
      "Python",
      "LeetCode",
      "Hash Maps",
      "Two Pointers",
      "Stacks",
      "Queues",
      "Arrays",
      "Strings",
      "Problem Solving",
    ]),
    instructor: null,
    status: "in-progress",
    progress: 25,
    certificateUrl: null,
    credentialUrl: null,
    startedAt: null,
    completedAt: null,
    featured: false,
    displayOrder: 3,
  },
];

async function main() {
  await prisma.project.deleteMany({
    where: {
      OR: demoProjectFilters,
    },
  });

  await prisma.course.deleteMany({
    where: {
      OR: [
        { slug: "example-certification-course" },
        { slug: "example-in-progress-course" },
        { slug: "draft-certification-learning-record" },
        { slug: "draft-in-progress-learning-record" },
      ],
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: demoSiteSettings.id },
    update: demoSiteSettings,
    create: demoSiteSettings,
  });

  for (const project of projectCaseStudies) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  for (const course of learningRecords) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
