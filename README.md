# Generic Portfolio Platform

A modern, reusable personal portfolio system built with Next.js. Public project pages are database-backed, and projects can be managed from a protected admin dashboard instead of being hardcoded into the site.

The project is intentionally generic. Seed data uses placeholder examples only, so real projects, work history, and personal background can be added later from the admin area.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- Supabase Postgres
- Zod validation
- Signed cookie admin sessions
- Hugging Face server-side AI foundation

## Features

- Responsive public portfolio homepage
- Dynamic project listing from Supabase Postgres
- Project detail pages by slug
- Admin login and logout
- Protected admin dashboard
- Project CRUD: create, read, update, delete
- Featured project toggle
- Project status editing
- Admin success toasts and confirmation dialog for deletes
- Server-side validation and API error handling
- Server-only Hugging Face foundation for future AI features

## Public Routes

- `/` - Portfolio homepage with hero, about, projects, skills, and contact sections
- `/projects` - All database-backed projects
- `/projects/[slug]` - Project detail page

## Admin Routes

- `/admin/login` - Admin login
- `/admin` - Protected dashboard overview
- `/admin/projects` - Protected project management table
- `/admin/projects/new` - Create project
- `/admin/projects/[id]/edit` - Edit project

## API Routes

- `GET /api/projects` - List projects
- `GET /api/projects?featured=true` - List featured projects
- `GET /api/projects?status=completed` - Filter by status
- `GET /api/projects?slug=example-web-app` - Get by slug
- `POST /api/projects` - Create project, admin only
- `GET /api/projects/[id]` - Get project by id
- `PUT /api/projects/[id]` - Update project, admin only
- `DELETE /api/projects/[id]` - Delete project, admin only
- `GET /api/ai/status` - Admin-only AI configuration status

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required for local development:

```bash
# Supabase Postgres.
# Use direct/session pooler URLs for persistent servers.
# For transaction pooler URLs on port 6543, add ?pgbouncer=true&connection_limit=1.
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me"
AUTH_SECRET="replace-with-a-long-random-secret"
HF_TOKEN="your_huggingface_token_here"
HF_MODEL=""
```

Change `ADMIN_PASSWORD` and `AUTH_SECRET` before any real deployment. `AUTH_SECRET` should be a long random string.

## Supabase Database Setup

This app uses Supabase Postgres through Prisma. In the Supabase dashboard, open the project, click **Connect**, and copy a Postgres connection string.

Recommended options:

- Persistent server or local development: use the direct connection string, or the Supavisor session pooler string on port `5432`.
- Serverless deployment: use the Supavisor transaction pooler string on port `6543` and add `?pgbouncer=true&connection_limit=1`.

Supabase also recommends creating a dedicated Prisma database user instead of using the default `postgres` user for application access. The current `.env.example` keeps the simpler default-user shape so setup is obvious, but a dedicated role is better before production.

Generate the Prisma client and apply migrations:

```bash
npm run prisma:generate
npm run db:migrate
```

Seed minimal placeholder projects:

```bash
npm run db:seed
```

For quick local iteration against a disposable database, `npm run db:push` is also available. Prefer `npm run db:migrate` for shared Supabase environments.

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The dev script uses webpack intentionally:

```bash
next dev --webpack
```

This avoids the local Turbopack refresh loop that appeared during development.

## Build And Start

Run validation:

```bash
npm run lint
npm audit --omit=dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Admin Usage

1. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `AUTH_SECRET` in `.env`.
2. Visit `/admin/login`.
3. Sign in with the configured admin credentials.
4. Manage projects at `/admin/projects`.
5. Use logout from the admin shell when finished.

Production guardrails reject placeholder credentials, so update `ADMIN_PASSWORD` and `AUTH_SECRET` before deployment.

## Project Model

Projects include:

- `id`
- `title`
- `slug`
- `shortDescription`
- `fullDescription`
- `techStack`
- `githubUrl`
- `liveUrl`
- `imageUrl`
- `status`: `planned`, `in-progress`, `completed`, or `archived`
- `featured`
- `role`
- `highlights`
- `problemSolved`
- `technicalChallenges`
- `displayOrder`
- `createdAt`
- `updatedAt`

`techStack` and `highlights` are stored as JSON strings in Postgres text columns and converted to string arrays in the data access layer.

## Hugging Face AI Foundation

The app includes a server-side-only Hugging Face foundation for future admin AI features.

- `HF_TOKEN` is read only on the server.
- The public frontend never receives `HF_TOKEN`.
- If `HF_TOKEN` or `HF_MODEL` is missing, AI helpers return a disabled state instead of breaking the app.
- `src/lib/huggingface.ts` contains the server-only API wrapper.
- `src/services/ai-project-assistant.ts` exposes future project-assistant entry points.
- `src/services/project-description-generator.ts` contains a draft project-description generator service.
- `GET /api/ai/status` reports AI availability for authenticated admins only.

To disable AI features, leave `HF_TOKEN` or `HF_MODEL` empty. Never commit a real Hugging Face token.

## Deployment Notes

- Set all environment variables in the deployment provider.
- Use a production-safe `AUTH_SECRET`.
- Replace the placeholder admin password.
- Supabase Postgres is now the expected production database.
- Run `npm run build` before deployment.
- Run `npm run db:migrate` against the deployment database before starting the production app.
- If using the transaction pooler, keep `pgbouncer=true` in `DATABASE_URL` to avoid prepared-statement errors.

## Design Notes

UI/UX Pro Max Skill was used to guide spacing, hierarchy, responsiveness, accessibility, admin workflow polish, touch targets, and reduced-motion-safe interactions.

21st.dev Magic MCP was configured in the environment, but a callable Magic tool was not exposed in this Codex session. The implementation still follows the intended component-quality direction: reusable cards, forms, tables, empty states, protected admin shell, and polished public project views.

## Future Improvements

- Add editable profile/about/skills/contact content models
- Add admin project image upload instead of image URL only
- Add filters/search for public projects
- Add AI-assisted project description generation in the admin form
- Add AI tech-stack extraction from descriptions
- Add stronger auth with a dedicated auth provider if multiple admins are needed
- Add automated tests for data access, API auth, and form actions
- Add deployment database migration workflow
