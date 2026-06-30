DELETE FROM "projects"
WHERE ("slug" = 'example-web-app' AND "title" = 'Example Web App')
   OR ("slug" = 'example-api-project' AND "title" = 'Example API Project')
   OR ("slug" = 'example-automation-tool' AND "title" = 'Example Automation Tool')
   OR (
     "slug" = 'draft-full-stack-product-case-study'
     AND "title" = 'Draft Full-Stack Product Case Study'
   )
   OR (
     "slug" = 'draft-backend-api-case-study'
     AND "title" = 'Draft Backend API Case Study'
   )
   OR (
     "slug" = 'draft-automation-workflow-case-study'
     AND "title" = 'Draft Automation Workflow Case Study'
   );

INSERT INTO "projects" (
  "id",
  "title",
  "slug",
  "short_description",
  "full_description",
  "tech_stack",
  "github_url",
  "live_url",
  "image_url",
  "screenshots",
  "status",
  "featured",
  "role",
  "highlights",
  "problem_solved",
  "technical_challenges",
  "display_order",
  "created_at",
  "updated_at"
)
VALUES
(
  'phase2-personal-portfolio-platform',
  'Personal Portfolio Platform',
  'personal-portfolio-platform',
  'A full-stack, database-backed personal portfolio platform with project/course CRUD, admin content management, CV support, Supabase storage, and AI-assisted content tooling.',
  $project$This portfolio is built as a real full-stack product rather than a static collection of hardcoded cards.

The goal was to create a system that can grow with my work: public project and course pages are backed by Supabase Postgres, content is managed from a protected admin dashboard, CV uploads are handled through Supabase Storage, and server-side AI helper infrastructure supports content workflows without exposing secrets to the frontend.

The project is ongoing. It gives me a place to present real case studies while also showing how I think about product structure, content modeling, validation, admin workflows, and clean public presentation. As I add more projects, the platform is designed to support richer case studies with architecture notes, screenshots, links, technical challenges, and lessons learned.$project$,
  '["Next.js","React","TypeScript","Tailwind CSS","Prisma","Supabase","PostgreSQL","Zod","Hugging Face","Vercel-ready architecture"]',
  'https://github.com/P0RTNOY/Portfolio',
  NULL,
  NULL,
  '[]',
  'in-progress',
  true,
  'Full-stack developer',
  '["Database-backed public portfolio","Protected admin dashboard","Project CRUD","Course CRUD","Editable site settings","CV/resume support","Supabase Storage uploads","Server-side AI assistant foundation","Responsive and accessible UI"]',
  'I did not want a static hardcoded portfolio. I wanted a portfolio that behaves like a real product: database-backed, editable from an admin dashboard, structured around projects, courses, CV, and flexible enough to grow with my work.',
  'Key challenges included designing reusable project and course content models, building protected admin flows, integrating Supabase Postgres through Prisma, handling Supabase Storage uploads for project images and CV files, keeping public pages clean while content remains database-driven, adding AI-assisted admin tooling without exposing secrets to the frontend, and replacing the original generic platform tone with a personal portfolio identity.',
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'phase2-ai-pictionary-game',
  'AI Pictionary Game',
  'ai-pictionary-game',
  'A turn-based AI guessing game where one player writes a prompt, AI models generate SVG drawings, and the other player tries to guess the original prompt.',
  $project$AI Pictionary Game is an early-stage prototype for a playful AI product: one player writes a funny or unusual situation, multiple AI artist tiers generate SVG clues, and the other player tries to guess the original prompt.

The project explores a game loop where model imperfections become part of the fun. Instead of treating messy AI output as a failure, the concept turns recognizable-but-imperfect SVG drawings into the core guessing mechanic. The backend can use OpenRouter for real model calls, while local development falls back to deterministic mock artists so the flow remains testable without API keys.

The current implementation includes a FastAPI backend for creating rounds, polling generated sketches, and scoring guesses, plus an Expo React Native mobile app for the create/wait/guess/result loop. It is intentionally a prototype: the core flow, SVG generation pipeline, sanitizer, local scoring fallback, and mobile interface are present, while a production multiplayer account system and persistent database can be added later.$project$,
  '["Python","FastAPI","Pydantic","OpenRouter","LLMs","SVG generation","defusedxml","Expo","React Native","TypeScript","react-native-svg","pytest"]',
  'https://github.com/P0RTNOY/AI-Pictionary-Game',
  NULL,
  NULL,
  '[]',
  'in-progress',
  true,
  'Product concept creator and prototype developer',
  '["Creative AI product concept","Multi-model SVG generation idea","Turn-based guessing game mechanic","Asynchronous two-player flow","Prompt-to-SVG gameplay","OpenRouter-backed model experiments","SVG sanitization for untrusted AI output","Practical exploration of LLM limitations","Strong product and game-design angle"]',
  'Most AI demos are simple chat interfaces. This project explores a more playful product idea: using LLMs as visual generators inside a multiplayer guessing game. The goal is to turn model limitations and imperfect SVG generation into part of the gameplay.',
  'The visible implementation focuses on generating clean SVG-only responses from LLMs, creating prompts that produce recognizable drawings, comparing low/mid/high artist model outputs, designing an asynchronous turn-based create/wait/guess/result flow, preventing the original prompt from being revealed during guessing, making the game fun even when AI output is imperfect, sanitizing untrusted SVG before rendering, and structuring rounds, prompts, guesses, and generated drawings cleanly in the backend and mobile app.',
  2,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "short_description" = EXCLUDED."short_description",
  "full_description" = EXCLUDED."full_description",
  "tech_stack" = EXCLUDED."tech_stack",
  "github_url" = EXCLUDED."github_url",
  "live_url" = EXCLUDED."live_url",
  "image_url" = EXCLUDED."image_url",
  "screenshots" = EXCLUDED."screenshots",
  "status" = EXCLUDED."status",
  "featured" = EXCLUDED."featured",
  "role" = EXCLUDED."role",
  "highlights" = EXCLUDED."highlights",
  "problem_solved" = EXCLUDED."problem_solved",
  "technical_challenges" = EXCLUDED."technical_challenges",
  "display_order" = EXCLUDED."display_order",
  "updated_at" = CURRENT_TIMESTAMP;
