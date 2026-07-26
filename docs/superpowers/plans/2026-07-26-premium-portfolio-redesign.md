# Premium Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a premium editorial portfolio that remains usable when the
content database is unavailable and elevates real project evidence across every
public route.

**Architecture:** Preserve the existing Next.js App Router, Prisma, Supabase, and
admin boundaries. Add safe public content readers backed by checked-in truthful
snapshots, then rebuild the public shell and route presentation around a shared
Warm Precision design system.

**Tech Stack:** Next.js 16.2, React 19, TypeScript, Tailwind CSS 4, Prisma,
Supabase Postgres/Storage, `next/font`, Lucide.

## Global Constraints

- Do not change admin authorization, write paths, Prisma schema, or migrations.
- Do not add fake achievements, employers, outcomes, or metrics.
- Do not add a production dependency.
- Preserve user-configurable site settings and database content when available.
- Keep all public routes keyboard-operable and usable at 375 px.
- Respect `prefers-reduced-motion`.

---

### Task 1: Resilient public content boundary

**Files:**
- Create: `src/lib/public-portfolio-content.ts`
- Create: `src/lib/public-portfolio-content.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `getPublicPortfolioData()`, `getPublicProjectBySlug(slug)`,
  `getPublicCourseBySlug(slug)`, and checked-in fallback records typed as the
  existing public models.
- Consumes: `listProjects`, `listCourses`, `getSiteSettings`,
  `getProjectBySlug`, and `getCourseBySlug`.

- [ ] Write tests that inject successful and failing readers and assert that
  live data wins, each failed source falls back independently, and fallback
  detail lookup resolves known slugs.
- [ ] Run the focused test and confirm it fails because the public reader does
  not exist.
- [ ] Implement the safe reader and truthful fallback snapshots without
  changing admin data functions.
- [ ] Add the focused test file to the repository's existing `test` script.
- [ ] Run the focused test and the full test script.

### Task 2: Premium public design system and metadata

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`

**Interfaces:**
- Produces: semantic color, typography, spacing, focus, motion, skeleton, and
  section tokens consumed by all public components.
- Consumes: Geist, Geist Mono, Instrument Serif, and Next.js metadata APIs.

- [ ] Add the warm editorial tokens, typography roles, global focus treatment,
  sticky-header scroll offsets, reduced-motion rules, and compositor-safe reveal
  animations.
- [ ] Add a metadata title template, richer description, keyword/category
  context, Open Graph/X defaults, robots, and sitemap entries.
- [ ] Keep the existing app-wide Tailwind setup and avoid raw style duplication
  in components.
- [ ] Run lint and type/build validation for metadata correctness.

### Task 3: Navigation, motion, and shell behavior

**Files:**
- Modify: `src/components/site/site-header.tsx`
- Modify: `src/components/site/mobile-nav.tsx`
- Modify: `src/components/site/site-footer.tsx`
- Create: `src/components/site/section-observer.tsx`
- Create: `src/components/site/reveal.tsx`
- Modify: `src/components/projects/project-page-shell.tsx`

**Interfaces:**
- `SectionObserver` consumes section IDs and exposes active-link styling through
  a client navigation component.
- `Reveal` consumes standard React children and adds intersection-based entry
  state without hiding content when scripting is unavailable.

- [ ] Add active-section observation, sticky-state styling, and route-aware nav
  links.
- [ ] Implement the mobile sheet with Escape close, focus containment, trigger
  focus restoration, and route-close behavior.
- [ ] Remove the public admin footer link and add purposeful social/contact links.
- [ ] Add restrained reveal behavior and reduced-motion handling.
- [ ] Validate tab order, keyboard dismissal, and touch target sizes.

### Task 4: Rebuild the homepage around evidence

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/site/capability-grid.tsx`
- Create: `src/components/projects/featured-projects.tsx`
- Create: `src/app/loading.tsx`
- Create: `src/app/error.tsx`

**Interfaces:**
- Homepage consumes `getPublicPortfolioData()`.
- `FeaturedProjects` consumes existing `Project[]`.
- `CapabilityGrid` consumes `SiteSettings["skills"]`.

- [ ] Replace the recruiter-instruction card and proof-card strip with an
  editorial hero, specialty rail, and evidence-led capability statement.
- [ ] Add large alternating featured case-study rows showing problem,
  contribution, stack, current evidence, and clear actions.
- [ ] Add practical skill groupings, honest experience/background copy, a
  condensed learning signal, and a high-intent contact section.
- [ ] Add route loading and unexpected-error states aligned to the visual system.
- [ ] Confirm every homepage requirement maps to visible content and a semantic
  section.

### Task 5: Upgrade public project and supporting routes

**Files:**
- Modify: `src/components/projects/project-card.tsx`
- Modify: `src/components/projects/projects-grid.tsx`
- Modify: `src/components/projects/project-visual.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/projects/[slug]/page.tsx`
- Modify: `src/app/projects/error.tsx`
- Create: `src/app/projects/loading.tsx`
- Modify: `src/app/courses/page.tsx`
- Modify: `src/app/courses/[slug]/page.tsx`
- Modify: `src/app/cv/page.tsx`

**Interfaces:**
- Project routes use safe public readers while admin routes retain raw readers.
- Existing case-study parsing and CV behavior remain the content source.

- [ ] Convert project cards into editorial evidence previews and remove generic
  placeholder-card treatment.
- [ ] Recompose detail pages into a clear narrative with stronger hierarchy,
  persistent details, evidence states, and next-step actions.
- [ ] Apply the shared shell and supporting-proof hierarchy to courses and CV.
- [ ] Add/loading align route transitions and error recovery with Next.js 16
  route conventions.
- [ ] Preserve all optional-link and missing-media behavior.

### Task 6: Social preview and final production validation

**Files:**
- Create: `public/og.png` only if the generated card passes visual/text review.
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Metadata references the approved social preview when available.

- [ ] Generate one Warm Precision social card with exact portfolio name,
  positioning, palette, and typographic motif.
- [ ] Inspect the image for incorrect or invented text; retry once only if unusable.
- [ ] Run `npm test`, `npm run lint`, and `npm run build`.
- [ ] Test desktop, tablet, 375 px mobile, keyboard navigation, mobile menu,
  reduced motion, route loading, and database-unavailable fallback behavior.
- [ ] Inspect the final diff and confirm no environment file, credential,
  migration, or unrelated change is included.
- [ ] Publish only after the validated build succeeds.
