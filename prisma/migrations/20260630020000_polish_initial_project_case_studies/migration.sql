UPDATE "projects"
SET
  "full_description" = $project$This portfolio is built as a real full-stack product rather than a static collection of hardcoded cards.

The goal was to create a system that can grow with my work: public project and course pages are backed by Supabase Postgres, content is managed from a protected admin dashboard, CV uploads are handled through Supabase Storage, and server-side AI helper infrastructure supports content workflows without exposing secrets to the frontend.

The project is ongoing. It gives me a place to present real case studies while also showing how I think about product structure, content modeling, validation, admin workflows, and clean public presentation.

## Architecture
Next.js App Router public pages and admin routes connect to server-side data access through Prisma. Supabase Postgres stores projects, courses, and site settings, while Supabase Storage handles uploaded project assets and CV files. Protected admin routes manage content changes, and server-side AI helper routes use Hugging Face-backed services without exposing tokens to the browser.

## What I learned
- Treating a portfolio as a real product instead of a static page
- Modeling content so projects and courses can grow over time
- Building protected admin workflows with validation and clear editing states
- Keeping secrets and AI provider calls server-side
- Integrating Supabase database and storage into a Next.js app
- Writing public-facing project pages that are easy to maintain

## Next steps
- Add real screenshots and thumbnails for each case study
- Add more project case studies over time
- Add architecture diagrams where they clarify the implementation
- Add public filtering and search for projects and learning records
- Add stronger tests around data access, forms, and protected routes
- Polish deployment and migration workflows$project$,
  "technical_challenges" = $project$- Designing reusable project and course content models without overcomplicating the schema
- Building protected admin flows for projects, courses, CV files, and site settings
- Integrating Supabase Postgres through Prisma while keeping public reads clean
- Handling Supabase Storage uploads for project images and CV files
- Keeping public pages polished while content remains database-driven
- Adding AI-assisted admin tooling without exposing secrets to the frontend
- Reworking the original generic platform into a personal portfolio identity$project$,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'personal-portfolio-platform'
  AND "full_description" = $project$This portfolio is built as a real full-stack product rather than a static collection of hardcoded cards.

The goal was to create a system that can grow with my work: public project and course pages are backed by Supabase Postgres, content is managed from a protected admin dashboard, CV uploads are handled through Supabase Storage, and server-side AI helper infrastructure supports content workflows without exposing secrets to the frontend.

The project is ongoing. It gives me a place to present real case studies while also showing how I think about product structure, content modeling, validation, admin workflows, and clean public presentation. As I add more projects, the platform is designed to support richer case studies with architecture notes, screenshots, links, technical challenges, and lessons learned.$project$;

UPDATE "projects"
SET
  "full_description" = $project$AI Pictionary Game is an early-stage prototype for a playful AI product: one player writes a funny or unusual situation, multiple AI artist tiers generate SVG clues, and the other player tries to guess the original prompt.

The project explores a game loop where model imperfections become part of the fun. Instead of treating messy AI output as a failure, the concept turns recognizable-but-imperfect SVG drawings into the core guessing mechanic.

The current implementation includes a FastAPI backend for creating rounds, polling generated sketches, and scoring guesses, plus an Expo React Native mobile app for the create/wait/guess/result loop. It is intentionally a prototype: the core flow, SVG generation pipeline, sanitizer, local scoring fallback, and mobile interface are present, while a production multiplayer account system and persistent database can be added later.

## Architecture
Expo / React Native mobile client calls a FastAPI backend. The backend exposes round creation, round polling, and guess submission endpoints. Round generation flows through OpenRouter when an API key is configured, or deterministic local mock artists during development. Generated SVG output is sanitized with defusedxml before it is returned to the mobile app, and guesses are scored through an OpenRouter judge model when configured or a local similarity fallback.

## What I learned
- Designing an AI product around model limitations instead of hiding them
- Prompting LLMs for structured SVG-only output
- Sanitizing AI-generated SVG before rendering it in a client
- Building a simple game loop around rounds, guesses, and results
- Separating prototype logic from future multiplayer and product concerns
- Testing AI-adjacent flows with local mocks and deterministic fallbacks

## Next steps
- Add persistent multiplayer state
- Improve scoring and guess comparison
- Add authentication or lightweight user sessions
- Add a generated SVG gallery per round
- Add a model comparison UI that makes the different artist tiers clearer
- Improve mobile UX around waiting, failures, and replaying rounds
- Deploy the backend and create a mobile preview/demo when ready$project$,
  "technical_challenges" = $project$- Generating clean SVG-only responses from LLMs
- Creating prompts that produce recognizable drawings without revealing the full answer as text
- Comparing low, mid, and high artist model outputs
- Designing an asynchronous create/wait/guess/result flow
- Preventing the original prompt from being revealed before the guess
- Making the game fun even when AI output is imperfect
- Sanitizing untrusted SVG before rendering it in the mobile app
- Structuring rounds, prompts, guesses, and generated drawings cleanly in the backend and mobile app$project$,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'ai-pictionary-game'
  AND "full_description" = $project$AI Pictionary Game is an early-stage prototype for a playful AI product: one player writes a funny or unusual situation, multiple AI artist tiers generate SVG clues, and the other player tries to guess the original prompt.

The project explores a game loop where model imperfections become part of the fun. Instead of treating messy AI output as a failure, the concept turns recognizable-but-imperfect SVG drawings into the core guessing mechanic. The backend can use OpenRouter for real model calls, while local development falls back to deterministic mock artists so the flow remains testable without API keys.

The current implementation includes a FastAPI backend for creating rounds, polling generated sketches, and scoring guesses, plus an Expo React Native mobile app for the create/wait/guess/result loop. It is intentionally a prototype: the core flow, SVG generation pipeline, sanitizer, local scoring fallback, and mobile interface are present, while a production multiplayer account system and persistent database can be added later.$project$;
