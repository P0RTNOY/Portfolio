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
    techStack: JSON.stringify(["Node.js", "Prisma", "SQLite"]),
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

async function main() {
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
