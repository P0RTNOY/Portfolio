ALTER TABLE "site_settings"
  ALTER COLUMN "site_name" SET DEFAULT 'Omer Portnoy',
  ALTER COLUMN "hero_eyebrow" SET DEFAULT 'Software Engineer · AI / Full-Stack / Automation',
  ALTER COLUMN "hero_title" SET DEFAULT 'I build practical AI-powered software, full-stack products, and automation tools.',
  ALTER COLUMN "hero_intro" SET DEFAULT 'I''m Omer Portnoy, a software engineering graduate focused on building real working products - from backend systems and admin dashboards to LLM-powered apps, developer tools, and automation workflows.',
  ALTER COLUMN "primary_cta_label" SET DEFAULT 'Explore the platform',
  ALTER COLUMN "secondary_cta_label" SET DEFAULT 'Contact me',
  ALTER COLUMN "about_title" SET DEFAULT 'Software engineer with a builder mindset.',
  ALTER COLUMN "about_summary" SET DEFAULT 'I''m a software engineering graduate who likes building practical systems end-to-end: the frontend people use, the backend that powers it, the database that keeps it reliable, and the tooling that makes it easier to maintain. My current focus is AI-powered products, automation, backend/full-stack development, and learning how to ship software that feels useful, not just technically impressive.',
  ALTER COLUMN "skills_title" SET DEFAULT 'Technical focus areas.',
  ALTER COLUMN "skills_summary" SET DEFAULT 'The areas I''m actively building and improving across product engineering, backend systems, AI applications, cloud workflows, and software fundamentals.',
  ALTER COLUMN "skills" SET DEFAULT '["Python","TypeScript","React","Next.js","Node.js","FastAPI","Supabase","PostgreSQL","Prisma","Docker","GCP","REST APIs","AI Integrations","LLM Apps","Hugging Face","OpenAI","Automation","CI/CD","Data Structures","Security Fundamentals"]',
  ALTER COLUMN "contact_title" SET DEFAULT 'Let''s build something useful.',
  ALTER COLUMN "contact_summary" SET DEFAULT 'I''m looking for software engineering opportunities where I can contribute, learn fast, and build real products with strong technical foundations.',
  ALTER COLUMN "contact_email" SET DEFAULT 'omerportnoy@gmail.com';

UPDATE "site_settings"
SET "site_name" = 'Omer Portnoy'
WHERE "id" = 'default' AND "site_name" = 'Portfolio';

UPDATE "site_settings"
SET "hero_eyebrow" = 'Software Engineer · AI / Full-Stack / Automation'
WHERE "id" = 'default' AND "hero_eyebrow" = 'Generic portfolio';

UPDATE "site_settings"
SET "hero_title" = 'I build practical AI-powered software, full-stack products, and automation tools.'
WHERE "id" = 'default' AND "hero_title" = 'Your Name, professional title, and selected work.';

UPDATE "site_settings"
SET "hero_intro" = 'I''m Omer Portnoy, a software engineering graduate focused on building real working products - from backend systems and admin dashboards to LLM-powered apps, developer tools, and automation workflows.'
WHERE "id" = 'default' AND "hero_intro" = 'A concise introduction placeholder for the kind of work, outcomes, and collaborations this portfolio will represent.';

UPDATE "site_settings"
SET "primary_cta_label" = 'Explore the platform'
WHERE "id" = 'default' AND "primary_cta_label" = 'View Projects';

UPDATE "site_settings"
SET "secondary_cta_label" = 'Contact me'
WHERE "id" = 'default' AND "secondary_cta_label" = 'Contact Me';

UPDATE "site_settings"
SET "about_title" = 'Software engineer with a builder mindset.'
WHERE "id" = 'default' AND "about_title" = 'A concise professional summary will live here.';

UPDATE "site_settings"
SET "about_summary" = 'I''m a software engineering graduate who likes building practical systems end-to-end: the frontend people use, the backend that powers it, the database that keeps it reliable, and the tooling that makes it easier to maintain. My current focus is AI-powered products, automation, backend/full-stack development, and learning how to ship software that feels useful, not just technically impressive.'
WHERE "id" = 'default' AND "about_summary" = 'Use this space for a short editable introduction. Keep it focused on the type of work, values, and outcomes you want the portfolio to communicate.';

UPDATE "site_settings"
SET "skills_title" = 'Technical focus areas.'
WHERE "id" = 'default' AND "skills_title" = 'Editable skill categories.';

UPDATE "site_settings"
SET "skills_summary" = 'The areas I''m actively building and improving across product engineering, backend systems, AI applications, cloud workflows, and software fundamentals.'
WHERE "id" = 'default' AND "skills_summary" = 'These categories are generic for now and can be edited from the admin dashboard.';

UPDATE "site_settings"
SET "skills" = '["Python","TypeScript","React","Next.js","Node.js","FastAPI","Supabase","PostgreSQL","Prisma","Docker","GCP","REST APIs","AI Integrations","LLM Apps","Hugging Face","OpenAI","Automation","CI/CD","Data Structures","Security Fundamentals"]'
WHERE "id" = 'default' AND "skills" = '["Frontend","Backend","Design Systems","Automation","AI Integrations","Deployment"]';

UPDATE "site_settings"
SET "contact_title" = 'Let''s build something useful.'
WHERE "id" = 'default' AND "contact_title" = 'Generic contact details.';

UPDATE "site_settings"
SET "contact_summary" = 'I''m looking for software engineering opportunities where I can contribute, learn fast, and build real products with strong technical foundations.'
WHERE "id" = 'default' AND "contact_summary" = 'Add preferred email, social links, or a contact form once you are ready to personalize the portfolio.';

UPDATE "site_settings"
SET "contact_email" = 'omerportnoy@gmail.com'
WHERE "id" = 'default' AND "contact_email" = 'hello@example.com';

UPDATE "site_settings"
SET "github_url" = 'https://github.com/P0RTNOY'
WHERE "id" = 'default' AND "github_url" IS NULL;

UPDATE "projects"
SET
  "title" = 'Draft Full-Stack Product Case Study',
  "slug" = 'draft-full-stack-product-case-study',
  "short_description" = 'Demo project content for testing the case study layout.',
  "full_description" = 'This is demo content for local layout testing. Replace it from the admin dashboard with a real project when you are ready.',
  "github_url" = NULL,
  "live_url" = NULL,
  "status" = 'planned',
  "featured" = false,
  "role" = 'Role to be added',
  "problem_solved" = 'Problem statement to be added with the real case study.',
  "technical_challenges" = 'Technical notes to be added with the real case study.',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'example-web-app' AND "title" = 'Example Web App';

UPDATE "projects"
SET
  "title" = 'Draft Backend API Case Study',
  "slug" = 'draft-backend-api-case-study',
  "short_description" = 'Demo backend/API entry for checking portfolio layout states.',
  "github_url" = NULL,
  "status" = 'in-progress',
  "role" = 'Role to be added',
  "problem_solved" = 'Problem statement to be added with the real case study.',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'example-api-project' AND "title" = 'Example API Project';

UPDATE "projects"
SET
  "title" = 'Draft Automation Workflow Case Study',
  "slug" = 'draft-automation-workflow-case-study',
  "short_description" = 'Demo automation entry for testing planned project states.',
  "full_description" = 'This draft entry can be deleted or edited from the admin dashboard later.',
  "github_url" = NULL,
  "role" = 'Role to be added',
  "highlights" = '["Workflow concept","Integration notes to add"]',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'example-automation-tool' AND "title" = 'Example Automation Tool';

UPDATE "courses"
SET
  "title" = 'Draft Certification Learning Record',
  "slug" = 'draft-certification-learning-record',
  "provider" = 'Learning Platform',
  "course_url" = 'https://github.com/P0RTNOY',
  "short_description" = 'Demo learning record for testing the course layout and admin editing flow.',
  "full_description" = 'This is demo course content. Replace it from the admin dashboard with a real course or certification when you are ready.',
  "instructor" = NULL,
  "status" = 'planned',
  "progress" = 0,
  "featured" = false,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'example-certification-course'
  AND "title" = 'Example Certification Course';

UPDATE "courses"
SET
  "title" = 'Draft In-Progress Learning Record',
  "slug" = 'draft-in-progress-learning-record',
  "course_url" = 'https://github.com/P0RTNOY',
  "short_description" = 'Demo learning record for showing in-progress learning with a progress bar.',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'example-in-progress-course'
  AND "title" = 'Example In-Progress Course';
