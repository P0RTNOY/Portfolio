import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projectCaseStudies = [
  {
    title: "Personal Portfolio Platform",
    slug: "personal-portfolio-platform",
    shortDescription:
      "A full-stack portfolio product with protected admin workflows, database-backed content, CV uploads, and deployment discipline built in from the start.",
    fullDescription:
      "This portfolio is built as a real product, not a static gallery of hardcoded cards.\n\n## Overview\nI designed it so the public site can grow with my work: projects and courses are stored in Supabase Postgres, content is edited through protected admin routes, CV files are uploaded through Supabase Storage, and the site can be updated without editing the public UI by hand.\n\n## Architecture\nThe public pages and admin dashboard run on the Next.js App Router. Prisma handles server-side data access, Supabase stores the project and course records, and the upload flow keeps project media and resume files in storage instead of baking them into the frontend. I also kept AI-assisted admin helpers server-side so secrets never reach the browser.\n\n## Lessons learned and next steps\n- Treating a portfolio like a product made the content model clearer and easier to extend\n- Reusable project and course records are better evidence for a junior SWE portfolio than one-off hardcoded cards\n- Protected admin workflows force better validation and make content edits safer\n- The next improvements are richer screenshots, stronger search and filtering, and more testing around forms and data access",
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
      "Vercel-ready architecture",
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
      "Deployment-ready content workflow",
    ]),
    problemSolved:
      "I needed a portfolio that could prove real engineering habits, not just show screenshots. The solution was a database-backed site with content editing, upload workflows, and a public presentation layer that can grow as I ship more work.",
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
      "AI Pictionary Game is an early-stage prototype for a playful AI product.\n\n## Overview\nOne player writes a funny or unusual prompt, the backend turns that prompt into SVG clue rounds, and the other player tries to guess the original idea before the round closes. The game is intentionally built around async waiting, because that makes the AI step feel like part of the experience instead of an implementation detail.\n\n## Architecture\nAn Expo React Native app calls a FastAPI backend for round creation, polling, and guess submission. When an OpenRouter key is available, the backend generates drawings and scores guesses through model calls; when it is not, the app falls back to deterministic local artists and similarity-based scoring so the prototype still works in development.\n\n## Lessons learned and next steps\n- AI output becomes more useful when the product is designed around its limitations\n- Sanitizing generated SVG before rendering it in the client is non-negotiable\n- Async round flow, polling, and fallback scoring make the prototype feel like a real game loop\n- The next step is persistent multiplayer state, clearer model comparison, and a smoother replay experience",
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
      "Most AI demos stop at chat. This prototype explores a more useful product shape: letting an LLM generate visual clues inside a multiplayer guessing game, so model imperfections become part of the fun rather than a failure state.",
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
    "I'm Omer Portnoy, and this portfolio showcases real products, not templates. I focus on junior SWE readiness through shipped work, steady learning, and clear communication while building backend systems, admin dashboards, LLM-powered apps, developer tools, and automation workflows.",
  primaryCtaLabel: "Explore the platform",
  secondaryCtaLabel: "Contact me",
  aboutTitle: "Software engineer focused on shipping end-to-end products.",
  aboutSummary:
    "I like taking products from idea to deployed software: planning the UI, wiring APIs, working with databases, adding authentication, and shipping something maintainable. I'm building the habits junior software engineering teams look for—clear communication, steady learning, and the discipline to keep improving with every project.",
  skillsTitle: "Technical focus areas that support hiring decisions.",
  skillsSummary:
    "A hiring-focused snapshot of the tools and fundamentals I use to turn ideas into shipped products: frontend and backend work, databases, APIs, authentication, deployment, and the learning habits that help me keep improving.",
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
    "I'm open to junior software engineering opportunities and project conversations. This portfolio is set up so recruiters can quickly see shipped work, responsibilities, and the evidence behind each project.",
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
