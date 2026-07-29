# Portfolio Studio Admin Redesign

**Status:** Proposed for owner review

**Date:** 2026-07-26

**Scope:** Admin experience, content architecture, editing workflow, and production readiness

## 1. Purpose

Transform the existing portfolio admin from a collection of database-oriented forms into a small personal content studio. The owner should be able to update projects, skills, courses, CV content, and profile details with equal ease, understand what is live, preview changes safely, and publish without touching code.

The redesign should preserve the existing Next.js, Prisma, PostgreSQL, and Supabase Storage architecture where it remains useful. It should not become a general-purpose page builder or an analytics product.

## 2. Current-state assessment

The existing admin already provides protected CRUD flows for projects and courses, a site settings form, media uploads, and optional AI-assisted drafting. Its main limitation is the interaction model:

- Navigation treats projects and courses as first-class areas but stores skills and CV-related content inside broader settings.
- The dashboard reports record counts rather than helping the owner continue work or resolve incomplete content.
- Long forms show essential and advanced fields together.
- Saves update published records directly; there is no private draft or explicit publish boundary.
- Previewing requires leaving the editing context.
- Skills are stored as one serialized list, which prevents categorization, reuse, ordering, or links to projects and courses.
- CV management primarily exposes a résumé URL instead of a structured editor.
- Database failure has no useful admin recovery state, even though the public site can continue with fallback content.

## 3. Design principles

1. **Task-first, not database-first.** Use language such as “Continue editing,” “Preview,” and “Publish,” not implementation terms.
2. **One workflow everywhere.** Projects, skills, courses, CV, and profile content use the same edit–preview–publish pattern.
3. **Safe by default.** Editing creates private drafts. Public content changes only after an explicit publish action.
4. **Progressive disclosure.** Essential fields appear first; advanced case-study, credential, ordering, and SEO controls remain available but secondary.
5. **Honest content guidance.** Completeness checks identify missing information without inventing claims or forcing arbitrary scores.
6. **Responsive and accessible.** Every critical action works with touch, keyboard, and screen readers; drag-and-drop always has button alternatives.
7. **Quietly premium.** The admin shares the public portfolio’s visual identity but prioritizes clarity and concentration over decorative effects.

## 4. Considered approaches

### A. Traditional CMS

A persistent sidebar, data tables, and separate create/edit forms. This is familiar and has the smallest implementation cost, but it preserves the current database-oriented mental model and does not solve preview or publishing confidence.

### B. Portfolio Studio — recommended

A calm command center with equal navigation for Projects, Skills, Courses, and CV; shared editing patterns; draft status; content health; and persistent preview. This balances structured data, ease of use, implementation feasibility, and mobile support.

### C. Inline website editor

An editable version of the public website. This makes simple copy changes intuitive but becomes fragile for project case studies, skills relationships, course credentials, responsive layouts, and keyboard accessibility.

The recommended design uses Portfolio Studio as the foundation and selectively borrows inline preview behavior without turning the public page into the editor.

## 5. Information architecture

### Desktop navigation

- Overview
- Projects
- Skills
- Courses
- CV
- Site settings
- View live site
- Account / sign out

The first five destinations are the primary workspace. Site settings and account actions are visually separated because they are less frequent.

### Mobile navigation

A five-item bottom navigation contains Overview, Projects, Skills, Courses, and CV. Site settings, the live-site link, and sign out live in the top account menu. The current section is indicated with icon, label, weight, and contrast rather than color alone.

All destinations remain deep-linkable. Returning from an editor restores the previous list filters and scroll position.

## 6. Overview dashboard

The overview answers three owner questions:

1. Is the portfolio healthy and up to date?
2. What was I working on?
3. What should I update next?

### Header

- Personalized greeting
- Live publishing state: up to date, unpublished drafts, or connection issue
- Last successful publish time
- Primary “Quick update” action

### Content summary

Four equal cards show Projects, Skills, Courses, and CV. Each displays a meaningful state rather than only a count, such as unpublished drafts, uncategorized skills, an in-progress course, or a stale CV PDF.

### Continue editing

Shows recent drafts and unfinished work with one-click continuation. The list prioritizes unsaved or unpublished content.

### Portfolio health

Provides a short, actionable checklist:

- missing project media or links;
- skills not assigned to a category;
- course progress that has not been updated recently;
- CV sections or contact fields missing required content;
- downloadable CV older than the structured CV content;
- broken external links found during publish validation.

This is a checklist, not an arbitrary vanity score. A compact completion percentage may summarize required-field coverage, but every deduction must have an understandable action.

### Live preview

Desktop shows a compact preview panel with a full-preview action and desktop/mobile viewport toggle. Mobile uses a dedicated Preview action instead of squeezing a split view into the viewport.

## 7. Shared editing workflow

Every content editor follows the same lifecycle:

1. Open an existing item or create a new draft.
2. Edit essential fields in clearly named sections.
3. Autosave the private draft.
4. Preview the draft against the real public component.
5. Run publish validation.
6. Publish explicitly.
7. Receive a clear success state and a direct link to the live result.

### Save state

The sticky editor header shows one of:

- Saving…
- Draft saved at `time`
- Unsaved changes
- Could not save — Retry
- Published at `time`

Autosave should be debounced and must not publish. If saving fails, the editor preserves the current input, warns before navigation, and offers retry. A small local recovery copy may be retained for long-form content, but it must never be presented as successfully stored server data.

### Editor layout

Desktop uses a focused editor with an optional preview panel. Mobile uses Edit and Preview tabs. Sections are grouped and collapsible:

- Essentials
- Details
- Media and links
- Presentation
- Publishing

The first invalid field receives focus after validation. Errors appear beside their field and in a linked summary when several errors exist.

### Publishing

Publishing is distinct from the project’s development status or a course’s learning status. A project may be “in progress” while still being published.

The publish check validates:

- required fields;
- unique slugs;
- valid external URLs;
- missing or failed media;
- basic image alternative text;
- content length limits where layout depends on them;
- unresolved database or storage failures.

Delete actions remain separated from primary actions and require confirmation. Recently deleted content should be recoverable through an Undo action where feasible.

## 8. Content areas

### Projects

The projects index supports search, development-status filtering, publish-state filtering, featured filtering, and explicit ordering. Each row or card shows its cover image, title, development status, publish status, last update, and primary actions.

The project editor contains:

- title, slug, short summary, and development status;
- problem, solution, owner role, engineering challenges, and highlights;
- technology selection from the shared skills library;
- GitHub and live-demo links;
- cover image and screenshot gallery with captions and alternative text;
- featured state and display order;
- optional GitHub-assisted import and writing suggestions.

Reordering supports accessible Move up / Move down controls in addition to any drag interaction. Duplicate creates a private copy with a new slug.

### Skills

Skills become first-class structured records rather than a serialized string list. The owner can:

- add several skills quickly;
- group them into editable categories;
- mark them active, featured, or hidden;
- reorder categories and skills;
- see which projects and courses reference each skill;
- merge duplicate spellings safely.

The public portfolio should not use unsupported proficiency percentages. Evidence comes from linked projects and courses.

Suggested initial categories are Languages, Frontend, Backend, Data, AI, Cloud and DevOps, and Engineering Practices, but categories remain owner-editable.

### Courses

The courses index supports learning-status, provider, featured, and publish-state filters. The editor contains:

- course identity, provider, instructor, and source URL;
- planned, in-progress, or completed state;
- progress, dates, and notes;
- related skills selected from the shared skills library;
- certificate and credential links;
- cover image and presentation settings;
- optional URL import and writing suggestions.

Progress and completion dates should remain logically synchronized, with an explicit override when needed.

### CV

The CV becomes a structured editor rather than only a file upload. Sections include:

- professional summary;
- experience entries;
- education;
- selected projects;
- skills drawn from the shared library;
- courses and certifications;
- contact and social links.

Entries can be reordered and hidden without deletion. The preview uses the same components as the public CV page.

The downloadable PDF remains an explicit uploaded asset in the first release. If structured CV content changes after the PDF upload, the dashboard warns that the file may be stale. Automatic PDF generation is intentionally deferred until the structured editor is stable.

### Site settings

Site settings remain focused on identity and global presentation:

- name and positioning;
- hero and about copy;
- availability and contact call to action;
- email and social links;
- public navigation labels;
- SEO defaults.

Skills and CV content move out of this large form into their dedicated areas.

## 9. Content and data architecture

The public site continues reading published records. Draft data remains private to authenticated admin routes.

### Existing records retained

- `Project`
- `Course`
- `SiteSettings`

### Proposed structured records

- `Skill`: name, slug, category, active, featured, display order, timestamps
- `ProjectSkill`: project-to-skill relationship
- `CourseSkill`: course-to-skill relationship
- `ResumeEntry`: type, title, organization, location, dates, summary, highlights, visible, display order
- `ContentDraft`: content type, target ID, JSON payload, updated timestamp
- `ContentRevision`: content type, target ID, published snapshot, published timestamp

Existing serialized project technology and course skill values are migrated into `Skill` records with case-insensitive deduplication. The migration preserves the old values until verification succeeds.

`ContentDraft` provides one shared draft mechanism. Publishing validates the draft and updates the target record in a database transaction, then stores the prior published snapshot in `ContentRevision`. Revision retention should initially be limited to the most recent ten versions per item.

The current single-owner authentication model remains acceptable for this personal admin, but login rate limiting and a stronger production secret policy are required. Multi-user roles and collaboration are out of scope.

## 10. Component architecture

The redesign should introduce reusable admin primitives rather than duplicating editor behavior:

- `AdminShell`
- `AdminSidebar`
- `AdminMobileNav`
- `AdminPageHeader`
- `ContentSummaryCard`
- `ContentHealthPanel`
- `PublishingStatus`
- `EditorShell`
- `EditorSection`
- `EditorActions`
- `DraftStatus`
- `PreviewPanel`
- `PublishReviewDialog`
- `FieldErrorSummary`
- `MediaPicker`
- `SortableList` with keyboard controls

Feature-specific forms remain separate:

- `ProjectEditor`
- `SkillManager`
- `CourseEditor`
- `CvEditor`
- `SiteSettingsEditor`

Server-side authentication and validation remain mandatory for every read, draft save, upload, publish, restore, and delete operation. Client controls are presentation only.

## 11. Visual and interaction direction

The admin uses the public portfolio’s midnight surfaces, restrained teal accent, warm warning tone, and typography, but with lower visual intensity and higher information clarity.

- Consistent 4/8-pixel spacing rhythm
- Minimum 44-pixel touch targets
- Visible labels and persistent helper text for complex fields
- Strong keyboard focus indicators
- Semantic success, warning, and error tokens with icon and text
- 150–250 ms transitions for navigation, panels, and state feedback
- Motion limited to opacity and transform and disabled or reduced under `prefers-reduced-motion`
- Skeletons only when loading is expected to exceed approximately 300 ms
- No decorative charts, glass effects over form content, or animation that delays input

## 12. Failure and recovery states

### Database unavailable

The admin displays a persistent service banner and disables actions that cannot be saved. It must not silently show fallback public data as editable database content. Retry is available after configuration or connectivity is restored.

### Storage unavailable

Text editing remains available. Upload controls show the specific failure and retry action; publishing is blocked only when the content references an upload that did not complete.

### Autosave failure

The current values remain visible, save state changes to an error, navigation triggers an unsaved-change warning, and retry does not duplicate records.

### Preview failure

The editor remains usable. The preview panel explains the failure and offers retry without discarding draft content.

### Publish failure

The draft remains intact. The interface distinguishes validation errors from service failures and provides a direct recovery action.

## 13. Security and accessibility

- Preserve signed, `HttpOnly`, secure production sessions.
- Add login throttling and short lockout behavior without revealing whether a username exists.
- Validate authorization independently in every server action and upload route.
- Keep Supabase service-role credentials server-only.
- Validate upload type, size, ownership, and generated storage path.
- Provide full keyboard navigation, logical heading order, field labels, error announcements, and focus management.
- Never rely on hover, drag, or color as the only interaction or status indicator.
- Test desktop, tablet, small mobile, 200% zoom, reduced motion, and keyboard-only operation.

## 14. Validation strategy

Implementation should include:

- unit tests for validation, draft conversion, migration deduplication, and publishing-state rules;
- server-action tests covering authentication, draft ownership, publish transactions, restore, and delete;
- integration tests for database and storage failure states;
- end-to-end owner journeys for Projects, Skills, Courses, CV, and Site settings;
- accessibility checks for navigation, editors, dialogs, errors, and mobile controls;
- production lint, type-check, test, and build commands discovered from the repository configuration.

## 15. Delivery phases

### Phase 0 — Production foundation

Repair and verify the PostgreSQL/Supabase connection, storage configuration, migration path, and authenticated admin access. No interface should claim edits are saved until this passes.

### Phase 1 — Studio shell

Build the responsive navigation, overview, publishing status, service failure banner, visual system, and live-preview container.

### Phase 2 — Shared editing foundation

Add structured skills, draft storage, revisions, common editor components, autosave states, preview from draft data, and publish validation.

### Phase 3 — Content editors

Migrate Projects and Courses to the shared editor, then add the Skills manager, structured CV editor, and reduced Site settings editor.

### Phase 4 — Quality pass

Add import helpers, link checks, content-health guidance, revision restore, responsive polish, accessibility verification, performance checks, and end-to-end tests.

Each phase must leave the public site working and preserve current published content.

## 16. Acceptance criteria

The redesign is successful when the owner can:

- reach Projects, Skills, Courses, and CV in one action from primary navigation;
- start or continue any update from the overview;
- edit without risking immediate public changes;
- see an accurate preview before publishing;
- understand whether work is saving, saved, unpublished, published, or failed;
- recover from validation, connection, upload, or navigation errors without losing content;
- complete all critical workflows on a small phone and with keyboard-only navigation;
- maintain shared skills once and reuse them across projects, courses, and CV;
- identify when the downloadable CV is older than structured CV content;
- publish an update and open the resulting public page directly.

## 17. Explicit non-goals

- Multi-user editorial roles
- Visitor analytics
- A free-form drag-and-drop page builder
- Arbitrary theme customization
- Automatic AI rewriting without owner review
- Automatic CV PDF generation in the initial release
- Replacing Prisma, PostgreSQL, or Supabase Storage without evidence that the existing architecture cannot meet the requirements
