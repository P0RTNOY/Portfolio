import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoProjects = [
  {
    title: "Example Web App",
    slug: "example-web-app",
    shortDescription: "A placeholder web application project for layout testing.",
    fullDescription:
      "This is minimal demo content. Replace it from the admin dashboard with a real project when you are ready.",
    techStack: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS"]),
    githubUrl: "https://github.com/example/example-web-app",
    liveUrl: "https://example.com",
    status: "completed",
    featured: true,
    role: "Project role placeholder",
    highlights: JSON.stringify([
      "Reusable interface structure",
      "Responsive project presentation",
    ]),
    problemSolved: "Placeholder problem statement for a future project.",
    technicalChallenges: "Placeholder notes about technical constraints.",
    displayOrder: 1,
  },
  {
    title: "Example API Project",
    slug: "example-api-project",
    shortDescription: "A placeholder backend or API project entry.",
    fullDescription:
      "Use this demo item to verify list, detail, and admin editing flows before adding real portfolio work.",
    techStack: JSON.stringify(["Node.js", "Prisma", "PostgreSQL"]),
    githubUrl: "https://github.com/example/example-api-project",
    liveUrl: null,
    status: "in-progress",
    featured: false,
    role: "Backend role placeholder",
    highlights: JSON.stringify(["Typed data model", "Validation-ready fields"]),
    problemSolved: "Placeholder API problem statement.",
    technicalChallenges: null,
    displayOrder: 2,
  },
  {
    title: "Example Automation Tool",
    slug: "example-automation-tool",
    shortDescription: "A placeholder automation project for future replacement.",
    fullDescription:
      "This project is intentionally generic and can be deleted or edited from the admin dashboard later.",
    techStack: JSON.stringify(["TypeScript", "Scripts", "Integrations"]),
    githubUrl: "https://github.com/example/example-automation-tool",
    liveUrl: null,
    status: "planned",
    featured: false,
    role: "Automation role placeholder",
    highlights: JSON.stringify(["Workflow concept", "Integration placeholder"]),
    problemSolved: null,
    technicalChallenges: null,
    displayOrder: 3,
  },
];

const demoSiteSettings = {
  id: "default",
  siteName: "Portfolio",
  heroEyebrow: "Generic portfolio",
  heroTitle: "Your Name, professional title, and selected work.",
  heroIntro:
    "A concise introduction placeholder for the kind of work, outcomes, and collaborations this portfolio will represent.",
  primaryCtaLabel: "View Projects",
  secondaryCtaLabel: "Contact Me",
  aboutTitle: "A concise professional summary will live here.",
  aboutSummary:
    "Use this space for a short editable introduction. Keep it focused on the type of work, values, and outcomes you want the portfolio to communicate.",
  skillsTitle: "Editable skill categories.",
  skillsSummary:
    "These categories are generic for now and can be edited from the admin dashboard.",
  skills: JSON.stringify([
    "Frontend",
    "Backend",
    "Design Systems",
    "Automation",
    "AI Integrations",
    "Deployment",
  ]),
  contactTitle: "Generic contact details.",
  contactSummary:
    "Add preferred email, social links, or a contact form once you are ready to personalize the portfolio.",
  contactEmail: "hello@example.com",
  githubUrl: null,
  linkedinUrl: null,
  resumeUrl: null,
};

async function main() {
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
