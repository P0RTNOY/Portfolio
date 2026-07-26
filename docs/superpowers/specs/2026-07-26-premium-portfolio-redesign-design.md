# Premium Portfolio Redesign

## Objective

Transform the public portfolio into a premium, production-ready experience that
communicates Omer Portnoy's engineering strengths through real project evidence,
clear technical positioning, and polished interaction design. Preserve the
existing admin, Prisma, Supabase, CV, project, and course capabilities.

## Audit Findings

- Public routes fail completely when the content database is unavailable.
- The visual language is a generic Tailwind starter: repeated white cards,
  standard zinc/teal colors, uniform section layouts, and placeholder project art.
- The homepage contains no dedicated skills or experience narrative even though
  the content model already stores skills.
- The "recruiter snapshot" describes how to read the site instead of proving
  engineering ability through hierarchy and content.
- Learning content competes with projects for prominence and over-emphasizes
  career stage.
- Navigation has no active-section feedback; mobile navigation lacks complete
  focus management.
- Project case studies contain strong material but present it as a long stack of
  similar cards without a clear story arc.
- Metadata is minimal and there is no complete social-sharing treatment.
- Public footer access to the admin route makes the product feel unfinished.

## Approved Direction: Warm Precision

The site uses a warm editorial system instead of the common neon-dark developer
portfolio aesthetic.

- Base surfaces: warm ivory (`#F3EEE4`) and soft paper (`#FBF8F1`)
- Primary text: ink (`#1D1E1B`)
- Muted text: stone (`#6E6A61`)
- Signal accent: burnt orange (`#C94F28`)
- Focus/secondary accent: cobalt (`#2859A8`)
- Contrast surface: deep ink (`#11120F`) with warm white text
- Typography: Geist Sans for precise product typography, Instrument Serif for
  selective editorial emphasis, and Geist Mono for technical labels
- Layout: a 12-column editorial grid, visible rules, generous whitespace,
  asymmetric compositions, and alternating light/dark case-study surfaces
- Radius and shadow: restrained; structure comes from spacing, rules, and
  contrast rather than floating card chrome

## Information Architecture

### Homepage

1. Sticky compact navigation with live section state and a single contact CTA.
2. Hero with positioning, availability, specialties, and direct project/CV actions.
3. Capability statement that explains how Omer works across product, backend,
   and AI concerns.
4. Featured work shown as large case-study rows with problem, contribution,
   stack, evidence, and links.
5. Technical capabilities grouped by practical engineering outcome rather than
   a flat logo cloud.
6. Experience/background section that honestly frames formal education,
   self-directed product work, and current learning without inventing employment.
7. Condensed learning signal linking to the full learning page.
8. High-intent contact section with email, GitHub, LinkedIn when available, and CV.

### Projects Index

Use an editorial list/grid hybrid. Every item exposes the problem, role, status,
stack, and evidence path before navigation.

### Project Detail

Present a case-study narrative:

1. Context and role
2. Problem
3. Architecture and decisions
4. Engineering challenges
5. Outcome/current state
6. Media/evidence
7. Links and next project

### Courses and CV

Keep these as supporting proof. Apply the same typography, spacing, navigation,
and loading/error language, but do not let them visually compete with project work.

## Reliability and Data Behavior

- Public pages use checked-in, truthful fallback content when database reads fail.
- Admin and write paths continue to surface database failures; fallbacks never
  mask admin errors.
- Fallback activation is logged without secrets or connection details.
- Project and course detail routes can resolve checked-in fallback records.
- External links remain optional and render only when present.
- No fake employers, testimonials, metrics, awards, or project outcomes are added.

## Interaction and Motion

- Smooth anchor navigation with sticky-header offsets.
- IntersectionObserver-driven section state and reveal transitions.
- Subtle 180–320 ms hover/press feedback using transform and opacity only.
- Project rows reveal secondary details on hover without hiding essential content.
- Mobile navigation opens as an accessible sheet, closes on Escape/navigation,
  traps focus, and returns focus to its trigger.
- All motion is disabled or simplified for `prefers-reduced-motion`.
- Navigation and route loading states provide immediate visual feedback.

## Accessibility

- Semantic landmarks and sequential headings.
- Skip link and visible cobalt focus indicators.
- Minimum 44 px touch targets.
- AA contrast for body text and controls.
- No information conveyed by color alone.
- Decorative graphics are hidden from assistive technology.
- Mobile menu exposes `aria-expanded`, `aria-controls`, and focus-safe behavior.
- External-link purpose remains clear from visible labels.

## SEO and Performance

- Metadata title template, canonical base, Open Graph, X/Twitter, robots, and
  descriptive route metadata.
- One bespoke social preview matching the final visual system.
- Font loading through `next/font`, which self-hosts font assets.
- No new animation or UI production dependencies.
- CSS motion uses compositor-friendly properties.
- Image spaces have explicit aspect ratios; real project media uses optimized
  image rendering when a valid source is available.
- Dynamic public routes include loading states and resilient fallbacks.

## Architecture Boundaries

- Existing Prisma models, admin routes, validations, and protected actions remain
  unchanged unless required for public read resilience.
- Shared public-shell behavior lives in site components.
- Checked-in fallback content and safe public readers live in a dedicated library.
- Public presentation components consume the existing `Project`, `Course`, and
  `SiteSettings` types.
- Admin UI primitives remain stable; the premium public visual system uses
  dedicated classes/components where necessary.

## Validation

- Unit tests cover public content fallback and fallback record lookup.
- Existing tests remain green.
- ESLint completes without errors.
- Production build completes.
- Manual browser checks cover desktop, tablet, 375 px mobile, keyboard navigation,
  mobile menu, reduced motion, route loading, and public behavior with the database
  unavailable.
