import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoProjects = [
  {
    title: "Draft Full-Stack Product Case Study",
    slug: "draft-full-stack-product-case-study",
    shortDescription: "Demo project content for testing the case study layout.",
    fullDescription:
      "This is demo content for local layout testing. Replace it from the admin dashboard with a real project when you are ready.",
    techStack: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS"]),
    githubUrl: null,
    liveUrl: null,
    status: "planned",
    featured: false,
    role: "Role to be added",
    highlights: JSON.stringify([
      "Reusable interface structure",
      "Responsive project presentation",
    ]),
    problemSolved: "Problem statement to be added with the real case study.",
    technicalChallenges: "Technical notes to be added with the real case study.",
    displayOrder: 1,
  },
  {
    title: "Draft Backend API Case Study",
    slug: "draft-backend-api-case-study",
    shortDescription: "Demo backend/API entry for checking portfolio layout states.",
    fullDescription:
      "Use this demo item to verify list, detail, and admin editing flows before adding real portfolio work.",
    techStack: JSON.stringify(["Node.js", "Prisma", "PostgreSQL"]),
    githubUrl: null,
    liveUrl: null,
    status: "in-progress",
    featured: false,
    role: "Role to be added",
    highlights: JSON.stringify(["Typed data model", "Validation-ready fields"]),
    problemSolved: "Problem statement to be added with the real case study.",
    technicalChallenges: null,
    displayOrder: 2,
  },
  {
    title: "Draft Automation Workflow Case Study",
    slug: "draft-automation-workflow-case-study",
    shortDescription: "Demo automation entry for testing planned project states.",
    fullDescription:
      "This draft entry can be deleted or edited from the admin dashboard later.",
    techStack: JSON.stringify(["TypeScript", "Scripts", "Integrations"]),
    githubUrl: null,
    liveUrl: null,
    status: "planned",
    featured: false,
    role: "Role to be added",
    highlights: JSON.stringify(["Workflow concept", "Integration notes to add"]),
    problemSolved: null,
    technicalChallenges: null,
    displayOrder: 3,
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
      OR: [
        { slug: "example-web-app", title: "Example Web App" },
        { slug: "example-api-project", title: "Example API Project" },
        { slug: "example-automation-tool", title: "Example Automation Tool" },
      ],
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

  for (const project of demoProjects) {
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
