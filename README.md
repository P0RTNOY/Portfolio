# Generic Portfolio Platform

A modern, reusable personal portfolio system built with Next.js. Public project and course pages are database-backed, and content can be managed from a protected admin dashboard instead of being hardcoded into the site.

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
- Dynamic course listing with progress, credential links, and source links
- Course detail pages by slug
- Editable CV/resume link
- Admin login and logout
- Protected admin dashboard
- Project CRUD: create, read, update, delete
- Course CRUD: create, read, update, delete
- Editable homepage/site content
- Featured project toggle
- Project status editing
- Admin success toasts and confirmation dialog for deletes
- Server-side validation and API error handling
- Server-side Hugging Face project and course suggestion features

## Public Routes

- `/` - Portfolio homepage with hero, about, projects, courses, CV, skills, and contact sections
- `/projects` - All database-backed projects
- `/projects/[slug]` - Project detail page
- `/courses` - All database-backed courses
- `/courses/[slug]` - Course detail page

## Admin Routes

- `/admin/login` - Admin login
- `/admin` - Protected dashboard overview
- `/admin/projects` - Protected project management table
- `/admin/projects/new` - Create project
- `/admin/projects/[id]/edit` - Edit project
- `/admin/courses` - Protected course management table
- `/admin/courses/new` - Create course
- `/admin/courses/[id]/edit` - Edit course
- `/admin/settings` - Edit public hero, about, skills, and contact content

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
- `POST /api/ai/project-description` - Admin-only project description generator
- `POST /api/ai/github-project` - Admin-only GitHub repository project-field suggester
- `POST /api/ai/course-url` - Admin-only course URL metadata importer and field suggester
- `POST /api/admin/uploads/project-images` - Admin-only Supabase Storage project image upload
- `POST /api/admin/uploads/resume` - Admin-only Supabase Storage resume PDF upload

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required for local development:

```bash
# Supabase Postgres runtime connection.
# Use transaction pooler URLs on port 6543 for serverless/runtime Prisma queries.
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Supabase Postgres direct/session connection for Prisma migrations.
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me"
AUTH_SECRET="replace-with-a-long-random-secret"
HF_TOKEN="your_huggingface_token_here"
HF_MODEL="openai/gpt-oss-20b:fastest"
GITHUB_TOKEN=""
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key_here"
SUPABASE_PROJECT_IMAGES_BUCKET="project-images"
SUPABASE_RESUME_BUCKET="portfolio-documents"
```

Change `ADMIN_PASSWORD` and `AUTH_SECRET` before any real deployment. `AUTH_SECRET` should be a long random string.
`SUPABASE_SERVICE_ROLE_KEY` is used only by protected server-side upload routes and must never be exposed as a `NEXT_PUBLIC_` variable.

## Supabase Database Setup

This app uses Supabase Postgres through Prisma. In the Supabase dashboard, open the project, click **Connect**, and copy a Postgres connection string.

Recommended options:

- `DATABASE_URL`: use the Supavisor transaction pooler string on port `6543` and add `?pgbouncer=true&connection_limit=1`.
- `DIRECT_URL`: use the Supavisor session pooler string on port `5432`, or the direct database string if your environment supports it.

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
5. Manage courses at `/admin/courses`.
6. Use logout from the admin shell when finished.

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
- `screenshots`
- `status`: `planned`, `in-progress`, `completed`, or `archived`
- `featured`
- `role`
- `highlights`
- `problemSolved`
- `technicalChallenges`
- `displayOrder`
- `createdAt`
- `updatedAt`

`techStack`, `highlights`, and `screenshots` are stored as JSON strings in Postgres text columns and converted to string arrays in the data access layer.

## Course Model

Courses include:

- `id`
- `title`
- `slug`
- `provider`
- `courseUrl`
- `imageUrl`
- `shortDescription`
- `fullDescription`
- `skills`
- `instructor`
- `status`: `planned`, `in-progress`, `completed`, or `archived`
- `progress`: `0` to `100`
- `certificateUrl`
- `credentialUrl`
- `startedAt`
- `completedAt`
- `featured`
- `displayOrder`
- `createdAt`
- `updatedAt`

`skills` are stored as a JSON string in a Postgres text column and converted to a string array in the data access layer.

## Site Settings Model

The homepage content is stored in a singleton `site_settings` row and can be edited at `/admin/settings`.

Editable fields include:

- Site name
- Hero eyebrow, headline, intro, and CTA labels
- About title and summary
- Skills title, summary, and comma-separated skill list
- Contact title, summary, email, GitHub URL, LinkedIn URL, and resume URL

Seed data remains generic placeholder content.

## Hugging Face AI Foundation

The app includes a server-side-only Hugging Face foundation for future admin AI features.

- `HF_TOKEN` is read only on the server.
- The public frontend never receives `HF_TOKEN`.
- If `HF_TOKEN` or `HF_MODEL` is missing, AI helpers return a disabled state instead of breaking the app.
- `src/lib/huggingface.ts` contains the server-only API wrapper.
- `src/services/ai-project-assistant.ts` exposes future project-assistant entry points.
- `src/services/project-description-generator.ts` contains the project-description generator service.
- `src/services/github-project-suggester.ts` turns GitHub repository context into suggested project fields.
- `src/services/course-url-suggester.ts` turns public course page metadata into suggested course fields.
- `GET /api/ai/status` reports AI availability for authenticated admins only.
- The project create/edit form can generate an editable full description and highlights from the current project context.
- The project create/edit form can also analyze a GitHub repository URL and suggest title, slug, descriptions, tech stack, links, status, role, highlights, problem solved, and technical challenges.
- The course create/edit form can import public metadata from a course URL and suggest title, slug, provider, image URL, descriptions, skills, and instructor.

Course importing intentionally reads public page metadata only. Some providers, including Udemy in local testing, may block server-side metadata fetches with bot protection. Course progress is private account data on platforms like Udemy, so progress, completion status, and certificate links remain admin-managed fields unless a future authenticated provider integration is added.

To disable AI features, leave `HF_TOKEN` or `HF_MODEL` empty. Never commit a real Hugging Face token. `HF_MODEL` should point to a chat-completion-capable model available through Hugging Face Inference Providers, such as `openai/gpt-oss-20b:fastest`. `GITHUB_TOKEN` is optional for public repositories, but can be set server-side to increase GitHub API limits.

## Supabase Storage Uploads

The admin project form supports uploading screenshot images to Supabase Storage. Uploaded images are stored in the bucket configured by `SUPABASE_PROJECT_IMAGES_BUCKET`, defaulting to `project-images`.

The admin site settings form supports uploading a resume/CV PDF. Uploaded PDFs are stored in the bucket configured by `SUPABASE_RESUME_BUCKET`, defaulting to `portfolio-documents`.

- The upload API route is admin-protected.
- The Supabase service role key is read server-side only.
- The bucket is created or updated as public on first upload.
- Uploaded public URLs are inserted into the project screenshots field.
- If the thumbnail field is empty, the first uploaded image is used as the thumbnail.
- Resume uploads fill the existing Resume URL field. Save site content afterward to publish the new CV link.
- Project image uploads are limited to 3.5 MB each and 4 MB total per request. Resume PDF uploads are limited to 4 MB. These limits keep uploads below Vercel function payload limits.

## CV / Resume

The public homepage includes a CV section. Upload a PDF from `/admin/settings`, then save site content to publish the generated resume URL. You can also paste an external resume/CV URL manually into the existing `resumeUrl` field.

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

- Add delete/reorder controls for uploaded project screenshots
- Add filters/search for public projects
- Add filters/search for public courses
- Add delete/replace management for old uploaded CV files
- Add AI tech-stack extraction from descriptions
- Add an authenticated learning-provider integration if private course progress should sync automatically
- Add stronger auth with a dedicated auth provider if multiple admins are needed
- Add automated tests for data access, API auth, and form actions
- Add deployment database migration workflow
