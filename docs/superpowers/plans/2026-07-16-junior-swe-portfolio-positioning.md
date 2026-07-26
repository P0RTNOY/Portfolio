# Junior SWE Portfolio Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the portfolio so it reads like a strong junior software engineer application package, with the homepage, projects, courses, and CV all working together as evidence.

**Architecture:** Keep the existing Next.js App Router + Prisma + Supabase structure. Use the current data-backed content surfaces instead of inventing new ones, but tighten the information hierarchy so the site leads with hiring signal: junior SWE readiness, concrete project evidence, learning proof, and an easy path to the CV. Only introduce new components where they reduce duplication or make the evidence blocks clearer.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Prisma ORM, Supabase Postgres, Zod

## Global Constraints

- Do not add new production dependencies; stay on the current npm / Next.js / Prisma stack.
- Keep the public routes working: `/`, `/projects`, `/projects/[slug]`, `/courses`, `/courses/[slug]`, `/cv`.
- Preserve the admin-editable content model wherever possible; use the existing site settings, projects, and courses tables before adding schema fields.
- Keep all public copy specific to a junior software engineer candidate: show proof, not vague marketing.
- Maintain the existing responsive, accessible Tailwind-based design language.

---

### Task 1: Recast the positioning copy and metadata

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/site-settings.ts`
- Modify: `prisma/seed.ts`

**Interfaces:**
- Consumes: current `SiteSettings` shape, homepage/CV metadata, seeded project/course content.
- Produces: a default site voice that says junior software engineer, stronger SEO snippets, and consistent fallback copy in the admin dashboard.

- [ ] **Step 1: Update the site-level metadata**

Change `src/app/layout.tsx` so the browser title and description clearly say this is a junior software engineer portfolio, not just a generic software portfolio.

Use a title and description in this range:

- Title: `Omer Portnoy | Junior Software Engineer`
- Description: `Omer Portnoy builds full-stack products, AI tools, automation workflows, and practical software systems.`

- [ ] **Step 2: Rewrite the default site settings copy**

Update the defaults in `src/lib/site-settings.ts` so the fallback content sounds like a junior SWE candidate with proof of shipping:

- Hero eyebrow: `Junior Software Engineer · Full-Stack / AI / Automation`
- Hero title: `I build practical full-stack software, AI tools, and automation workflows.`
- Hero intro: mention that the site is a portfolio of real products, not templates, and that the focus is junior SWE readiness through shipped work, learning, and clear communication.
- About summary: emphasize end-to-end product thinking, databases, APIs, authentication, deployment, and learning discipline.
- Skills summary: make the skills read as a hiring signal, not a raw keyword dump.
- Contact summary: ask for junior software engineering opportunities and note that the portfolio is set up to show project evidence quickly.

- [ ] **Step 3: Mirror the same copy into the seed data**

Update `prisma/seed.ts` so a fresh database starts with the same positioning and does not fall back to generic portfolio language.

Keep the project and course seed records intact, but make the site settings seed consistent with the new hiring narrative.

- [ ] **Step 4: Verify the admin fallback still behaves**

Check that the admin settings page still loads and edits the same fields, because this task should improve the wording without changing the editing workflow.

- [ ] **Step 5: Run the basic validation**

Run:

```bash
npm run lint
npm run build
```

Expected:

- `lint` passes with no new errors.
- `build` succeeds and still generates the Prisma client.

### Task 2: Make the homepage read like a hiring narrative

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/site/portfolio-proof-strip.tsx`

**Interfaces:**
- Consumes: `SiteSettings`, `Project[]`, `Course[]`, and the existing `ResumeViewer`.
- Produces: a reusable proof strip and a homepage order that pushes junior SWE evidence above generic self-description.

- [ ] **Step 1: Add a compact proof strip component**

Create `src/components/site/portfolio-proof-strip.tsx` with a simple interface:

```ts
type ProofItem = {
  label: string;
  value: string;
  href?: string;
};

type PortfolioProofStripProps = {
  items: ProofItem[];
};
```

Render the items as a responsive grid or horizontal strip with short labels and strong numeric or factual values.

Use it for proof points such as:

- `Junior SWE focus`
- `Featured case studies`
- `Active learning tracks`
- `CV available`

- [ ] **Step 2: Reorder the homepage sections**

Update `src/app/page.tsx` so the page opens with:

1. Hero with junior SWE positioning.
2. Proof strip.
3. About / builder summary.
4. Featured projects.
5. CV section.
6. Learning timeline.
7. Contact.

That order should make the page feel like a candidate profile first and a portfolio second.

- [ ] **Step 3: Tighten the hero copy and CTA logic**

Keep the two-call-to-action pattern, but make the primary CTA point at the strongest evidence section and the secondary CTA point at the CV or contact path.

Make the hero text answer three questions fast:

- What role am I targeting?
- What kinds of systems do I build?
- Why should a recruiter keep scrolling?

- [ ] **Step 4: Make the “About” and “Projects” sections more explicit**

Rewrite the section descriptions so they describe the portfolio as proof of ability:

- About should explain working style and technical breadth.
- Projects should explain that the cards are case studies with architecture, role, and tradeoffs.
- Courses should explain that the timeline exists to show junior-engineer learning momentum.

- [ ] **Step 5: Validate the page in browser and build output**

Run:

```bash
npm run lint
npm run build
```

Then check `/` in the browser on desktop and mobile width and confirm the narrative order feels natural.

### Task 3: Upgrade projects into case studies that answer hiring questions

**Files:**
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/projects/[slug]/page.tsx`
- Modify: `src/components/projects/project-card.tsx`
- Modify: `src/components/projects/project-visual.tsx`
- Modify: `src/lib/projects.ts`
- Modify: `prisma/seed.ts`

**Interfaces:**
- Consumes: `Project` model fields (`title`, `role`, `problemSolved`, `technicalChallenges`, `techStack`, `screenshots`, `status`, `featured`) and the current project page sections.
- Produces: cards and detail pages that expose role, problem, architecture, outcomes, and technical tradeoffs before the reader has to hunt for them.

- [ ] **Step 1: Rewrite the project card hierarchy**

Make `src/components/projects/project-card.tsx` answer the recruiter’s first pass questions:

- What was this project?
- What problem did it solve?
- What stack did it use?
- Is there enough substance to click through?

Keep the card concise, but promote role/problem/stack ahead of secondary metadata.

- [ ] **Step 2: Add a short intro to the projects index**

Update `src/app/projects/page.tsx` so the page explains how to read the case studies and what counts as strong evidence on this portfolio.

Keep the count badges if they still help, but make the lead copy more specific to the target role.

- [ ] **Step 3: Turn the project detail page into a real case study**

Update `src/app/projects/[slug]/page.tsx` so the hero includes:

- title
- role
- status
- stack
- project links
- a summary sentence that sounds like a junior engineer describing shipped work

If the current `ProjectVisual` is too generic, improve `src/components/projects/project-visual.tsx` so it supports a stronger first impression without changing the data model.

- [ ] **Step 4: Make the content sections easier to scan**

Keep the existing overview / case-study sections, but order the content so the most important proof appears first:

1. Overview
2. Problem solved
3. Architecture or implementation notes
4. Technical challenges
5. Lessons learned or next steps

The goal is to let a hiring manager understand the project in under a minute.

- [ ] **Step 5: Rewrite the seeded project narratives**

Update the seed content in `prisma/seed.ts` so the two featured projects read like strong portfolio evidence:

- `Personal Portfolio Platform` should frame the work as a real full-stack product with admin workflows, database-backed content, and deployment discipline.
- `AI Pictionary Game` should frame the work as an AI product prototype with clear product thinking, sanitization, and async round flow.

- [ ] **Step 6: Run the project-level validation**

Run:

```bash
npm run lint
```

Then visit `/projects` and `/projects/personal-portfolio-platform` and confirm they read like case studies instead of a project gallery.

### Task 4: Turn courses into proof of learning

**Files:**
- Modify: `src/app/courses/page.tsx`
- Modify: `src/app/courses/[slug]/page.tsx`
- Modify: `src/components/courses/course-card.tsx`
- Modify: `src/components/courses/course-visual.tsx`
- Modify: `src/lib/courses.ts`
- Modify: `prisma/seed.ts`

**Interfaces:**
- Consumes: `Course` model fields (`provider`, `instructor`, `status`, `progress`, `skills`, `certificateUrl`, `credentialUrl`).
- Produces: a timeline that shows active learning, interview readiness, and skill coverage in a way recruiters can quickly trust.

- [ ] **Step 1: Reframe the course cards**

Update `src/components/courses/course-card.tsx` so each card shows why the course matters for a junior software engineer candidate.

Make the progress bar, status badge, and skill tags answer the question: “What capability does this learning track improve?”

- [ ] **Step 2: Improve the courses index intro**

Update `src/app/courses/page.tsx` so the page explains that the learning timeline is proof of ongoing growth, not filler content.

The header should make it clear that these tracks support AI, backend, cloud, security, and interview fundamentals.

- [ ] **Step 3: Strengthen the course detail pages**

Update `src/app/courses/[slug]/page.tsx` so each detail page has a short “why this matters” summary above the longer description.

If needed, make `src/components/courses/course-visual.tsx` support a clearer visual hierarchy for featured or in-progress tracks.

- [ ] **Step 4: Rewrite the seeded course descriptions**

Update the course seeds in `prisma/seed.ts` so the three tracks form a coherent roadmap:

- LLM engineering for applied AI
- Security fundamentals for safe engineering habits
- Data structures and algorithms for interview readiness

Keep the learning language concrete and job-relevant.

- [ ] **Step 5: Validate the learning timeline**

Run:

```bash
npm run lint
```

Then check `/courses` and one course detail page in the browser to confirm the learning story is easy to understand in one pass.

### Task 5: Make the CV page a conversion point

**Files:**
- Modify: `src/app/cv/page.tsx`
- Modify: `src/components/site/resume-viewer.tsx`
- Modify: `src/lib/site-settings.ts`
- Modify: `prisma/seed.ts`

**Interfaces:**
- Consumes: `resumeUrl`, contact links, and the embedded PDF viewer.
- Produces: a CV page that tells the viewer what to look for, why it matters, and how to download or open the PDF without friction.

- [ ] **Step 1: Add a short CV framing block**

Update `src/app/cv/page.tsx` so the page opens with a short summary of what the viewer should expect to see:

- full-stack work
- AI tooling
- databases and APIs
- admin workflows
- learning discipline

The page should make the PDF feel like the evidence behind the portfolio, not an isolated attachment.

- [ ] **Step 2: Make the viewer header more specific**

Adjust `src/components/site/resume-viewer.tsx` so the loaded state and empty state feel tailored to a job search:

- If the PDF exists, make the open/download controls obvious.
- If the PDF does not exist, explain that the latest CV will appear once uploaded.

Keep the embedded PDF as the centerpiece.

- [ ] **Step 3: Align the CV copy with the homepage copy**

Update any `resumeUrl`-adjacent or contact-facing wording in `src/lib/site-settings.ts` and `prisma/seed.ts` so the CV page and homepage sound like one candidate package.

- [ ] **Step 4: Validate both CV states**

Run:

```bash
npm run lint
```

Then visit `/cv` with and without a resume URL to make sure both states read clearly.

### Task 6: Final content audit and release check

**Files:**
- Modify: `README.md` only if the repository docs still describe the portfolio too generically after the content pass.

**Interfaces:**
- Consumes: the updated homepage, projects, courses, CV, and admin-editable copy.
- Produces: a portfolio that presents one coherent story across public pages and documentation.

- [ ] **Step 1: Run the production build**

Run:

```bash
npm run build
```

Expected:

- Prisma client generation succeeds.
- The Next.js build succeeds.

- [ ] **Step 2: Smoke the public routes**

Verify these pages load cleanly after the content changes:

- `/`
- `/projects`
- `/courses`
- `/cv`

- [ ] **Step 3: Update repository docs only if they are stale**

Review `README.md` and update it only if it still describes the site as a generic portfolio instead of a junior SWE application asset.

Do not touch it if the current wording already matches the new positioning.

- [ ] **Step 4: Confirm the scope stayed clean**

Check `git status` and confirm no unrelated files changed.

The only acceptable changes at the end of this plan are the files required by the tasks above.

## Self-Review

- Coverage check:
  - Positioning and metadata are covered by Task 1.
  - Homepage hierarchy and proof blocks are covered by Task 2.
  - Project case-study structure is covered by Task 3.
  - Learning timeline framing is covered by Task 4.
  - CV conversion framing is covered by Task 5.
  - Build and docs validation are covered by Task 6.
- Placeholder scan:
  - No `TBD`, `TODO`, or “write tests for the above” placeholders are present.
  - Every task names exact files and concrete copy directions.
- Type and scope consistency:
  - The plan only uses existing `Project`, `Course`, and `SiteSettings` shapes.
  - No new data model is assumed unless the implementer decides a later split plan is needed.

## Scope Note

This plan keeps content strategy, homepage hierarchy, project storytelling, course storytelling, and CV framing together because they need to stay aligned. If you want a deeper visual redesign later, split that into a separate design-first plan so the positioning work stays focused and shippable.
