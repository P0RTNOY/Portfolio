import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projectCaseStudies = [
  {
    title: "Personal Portfolio Platform",
    slug: "personal-portfolio-platform",
    shortDescription:
      "A full-stack, database-backed personal portfolio platform with project/course CRUD, admin content management, CV support, Supabase storage, and AI-assisted content tooling.",
    fullDescription:
      "This portfolio is built as a real full-stack product rather than a static collection of hardcoded cards.\n\nThe goal was to create a system that can grow with my work: public project and course pages are backed by Supabase Postgres, content is managed from a protected admin dashboard, CV uploads are handled through Supabase Storage, and server-side AI helper infrastructure supports content workflows without exposing secrets to the frontend.\n\nThe project is ongoing. It gives me a place to present real case studies while also showing how I think about product structure, content modeling, validation, admin workflows, and clean public presentation.\n\n## Architecture\nNext.js App Router public pages and admin routes connect to server-side data access through Prisma. Supabase Postgres stores projects, courses, and site settings, while Supabase Storage handles uploaded project assets and CV files. Protected admin routes manage content changes, and server-side AI helper routes use Hugging Face-backed services without exposing tokens to the browser.\n\n## What I learned\n- Treating a portfolio as a real product instead of a static page\n- Modeling content so projects and courses can grow over time\n- Building protected admin workflows with validation and clear editing states\n- Keeping secrets and AI provider calls server-side\n- Integrating Supabase database and storage into a Next.js app\n- Writing public-facing project pages that are easy to maintain\n\n## Next steps\n- Add real screenshots and thumbnails for each case study\n- Add more project case studies over time\n- Add architecture diagrams where they clarify the implementation\n- Add public filtering and search for projects and learning records\n- Add stronger tests around data access, forms, and protected routes\n- Polish deployment and migration workflows",
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
      "Project CRUD",
      "Course CRUD",
      "Editable site settings",
      "CV/resume support",
      "Supabase Storage uploads",
      "Server-side AI assistant foundation",
      "Responsive and accessible UI",
    ]),
    problemSolved:
      "I did not want a static hardcoded portfolio. I wanted a portfolio that behaves like a real product: database-backed, editable from an admin dashboard, structured around projects, courses, CV, and flexible enough to grow with my work.",
    technicalChallenges:
      "- Designing reusable project and course content models without overcomplicating the schema\n- Building protected admin flows for projects, courses, CV files, and site settings\n- Integrating Supabase Postgres through Prisma while keeping public reads clean\n- Handling Supabase Storage uploads for project images and CV files\n- Keeping public pages polished while content remains database-driven\n- Adding AI-assisted admin tooling without exposing secrets to the frontend\n- Reworking the original generic platform into a personal portfolio identity",
    displayOrder: 1,
  },
  {
    title: "AI Pictionary Game",
    slug: "ai-pictionary-game",
    shortDescription:
      "A turn-based AI guessing game where one player writes a prompt, AI models generate SVG drawings, and the other player tries to guess the original prompt.",
    fullDescription:
      "AI Pictionary Game is an early-stage prototype for a playful AI product: one player writes a funny or unusual situation, multiple AI artist tiers generate SVG clues, and the other player tries to guess the original prompt.\n\nThe project explores a game loop where model imperfections become part of the fun. Instead of treating messy AI output as a failure, the concept turns recognizable-but-imperfect SVG drawings into the core guessing mechanic.\n\nThe current implementation includes a FastAPI backend for creating rounds, polling generated sketches, and scoring guesses, plus an Expo React Native mobile app for the create/wait/guess/result loop. It is intentionally a prototype: the core flow, SVG generation pipeline, sanitizer, local scoring fallback, and mobile interface are present, while a production multiplayer account system and persistent database can be added later.\n\n## Architecture\nExpo / React Native mobile client calls a FastAPI backend. The backend exposes round creation, round polling, and guess submission endpoints. Round generation flows through OpenRouter when an API key is configured, or deterministic local mock artists during development. Generated SVG output is sanitized with defusedxml before it is returned to the mobile app, and guesses are scored through an OpenRouter judge model when configured or a local similarity fallback.\n\n## What I learned\n- Designing an AI product around model limitations instead of hiding them\n- Prompting LLMs for structured SVG-only output\n- Sanitizing AI-generated SVG before rendering it in a client\n- Building a simple game loop around rounds, guesses, and results\n- Separating prototype logic from future multiplayer and product concerns\n- Testing AI-adjacent flows with local mocks and deterministic fallbacks\n\n## Next steps\n- Add persistent multiplayer state\n- Improve scoring and guess comparison\n- Add authentication or lightweight user sessions\n- Add a generated SVG gallery per round\n- Add a model comparison UI that makes the different artist tiers clearer\n- Improve mobile UX around waiting, failures, and replaying rounds\n- Deploy the backend and create a mobile preview/demo when ready",
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
      "Creative AI product concept",
      "Multi-model SVG generation idea",
      "Turn-based guessing game mechanic",
      "Asynchronous two-player flow",
      "Prompt-to-SVG gameplay",
      "OpenRouter-backed model experiments",
      "SVG sanitization for untrusted AI output",
      "Practical exploration of LLM limitations",
      "Strong product and game-design angle",
    ]),
    problemSolved:
      "Most AI demos are simple chat interfaces. This project explores a more playful product idea: using LLMs as visual generators inside a multiplayer guessing game. The goal is to turn model limitations and imperfect SVG generation into part of the gameplay.",
    technicalChallenges:
      "- Generating clean SVG-only responses from LLMs\n- Creating prompts that produce recognizable drawings without revealing the full answer as text\n- Comparing low, mid, and high artist model outputs\n- Designing an asynchronous create/wait/guess/result flow\n- Preventing the original prompt from being revealed before the guess\n- Making the game fun even when AI output is imperfect\n- Sanitizing untrusted SVG before rendering it in the mobile app\n- Structuring rounds, prompts, guesses, and generated drawings cleanly in the backend and mobile app",
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
  heroEyebrow: "Software Engineer · AI / Full-Stack / Automation",
  heroTitle:
    "I build practical AI-powered software, full-stack products, and automation tools.",
  heroIntro:
    "I'm Omer Portnoy, a software engineering graduate focused on building real working products - from backend systems and admin dashboards to LLM-powered apps, developer tools, and automation workflows.",
  primaryCtaLabel: "Explore the platform",
  secondaryCtaLabel: "Contact me",
  aboutTitle: "Software engineer with a builder mindset.",
  aboutSummary:
    "I'm a software engineering graduate who likes building practical systems end-to-end: the frontend people use, the backend that powers it, the database that keeps it reliable, and the tooling that makes it easier to maintain. My current focus is AI-powered products, automation, backend/full-stack development, and learning how to ship software that feels useful, not just technically impressive.",
  skillsTitle: "Technical focus areas.",
  skillsSummary:
    "The areas I'm actively building and improving across product engineering, backend systems, AI applications, cloud workflows, and software fundamentals.",
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
  contactTitle: "Let's build something useful.",
  contactSummary:
    "I'm looking for software engineering opportunities where I can contribute, learn fast, and build real products with strong technical foundations.",
  contactEmail: "omerportnoy@gmail.com",
  githubUrl: "https://github.com/P0RTNOY",
  linkedinUrl: null,
  resumeUrl: null,
};

const demoCourses = [
  {
    title: "Draft Certification Learning Record",
    slug: "draft-certification-learning-record",
    provider: "Learning Platform",
    courseUrl: "https://github.com/P0RTNOY",
    imageUrl: null,
    shortDescription:
      "Demo learning record for testing the course layout and admin editing flow.",
    fullDescription:
      "This is demo course content. Replace it from the admin dashboard with a real course or certification when you are ready.",
    skills: JSON.stringify(["Security", "Foundations", "Certification Prep"]),
    instructor: null,
    status: "planned",
    progress: 0,
    certificateUrl: null,
    credentialUrl: null,
    startedAt: null,
    completedAt: null,
    featured: false,
    displayOrder: 1,
  },
  {
    title: "Draft In-Progress Learning Record",
    slug: "draft-in-progress-learning-record",
    provider: "Learning Platform",
    courseUrl: "https://github.com/P0RTNOY",
    imageUrl: null,
    shortDescription:
      "Demo learning record for showing in-progress learning with a progress bar.",
    fullDescription:
      "Use this demo item to verify progress display and editing before adding real learning records.",
    skills: JSON.stringify(["Practice", "Labs", "Professional Growth"]),
    instructor: null,
    status: "in-progress",
    progress: 45,
    certificateUrl: null,
    credentialUrl: null,
    startedAt: null,
    completedAt: null,
    featured: false,
    displayOrder: 2,
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
        {
          slug: "example-certification-course",
          title: "Example Certification Course",
        },
        {
          slug: "example-in-progress-course",
          title: "Example In-Progress Course",
        },
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

  for (const course of demoCourses) {
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
