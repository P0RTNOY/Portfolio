-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "site_name" TEXT NOT NULL DEFAULT 'Portfolio',
    "hero_eyebrow" TEXT NOT NULL DEFAULT 'Generic portfolio',
    "hero_title" TEXT NOT NULL DEFAULT 'Your Name, professional title, and selected work.',
    "hero_intro" TEXT NOT NULL DEFAULT 'A concise introduction placeholder for the kind of work, outcomes, and collaborations this portfolio will represent.',
    "primary_cta_label" TEXT NOT NULL DEFAULT 'View Projects',
    "secondary_cta_label" TEXT NOT NULL DEFAULT 'Contact Me',
    "about_title" TEXT NOT NULL DEFAULT 'A concise professional summary will live here.',
    "about_summary" TEXT NOT NULL DEFAULT 'Use this space for a short editable introduction. Keep it focused on the type of work, values, and outcomes you want the portfolio to communicate.',
    "skills_title" TEXT NOT NULL DEFAULT 'Editable skill categories.',
    "skills_summary" TEXT NOT NULL DEFAULT 'These categories are generic for now and can be edited from the admin dashboard.',
    "skills" TEXT NOT NULL DEFAULT '["Frontend","Backend","Design Systems","Automation","AI Integrations","Deployment"]',
    "contact_title" TEXT NOT NULL DEFAULT 'Generic contact details.',
    "contact_summary" TEXT NOT NULL DEFAULT 'Add preferred email, social links, or a contact form once you are ready to personalize the portfolio.',
    "contact_email" TEXT NOT NULL DEFAULT 'hello@example.com',
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "resume_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

