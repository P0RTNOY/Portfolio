# Graph Report - .  (2026-07-15)

## Corpus Check
- Corpus is ~45,075 words - fits in a single context window. You may not need a graph.

## Summary
- 734 nodes · 1527 edges · 48 communities (33 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Course Admin Actions
- Project Admin Actions
- API Upload Routes
- GitHub Metadata Integration
- Development Tooling Config
- Project Form Workflow
- Admin Authentication
- Course URL AI Suggestions
- Supabase Security Guidance
- TypeScript Configuration
- Course Metadata Parsing
- Runtime Dependencies
- Project Listing Pages
- Detail and Error Pages
- Site Settings Workflow
- Resume and Buttons
- CV Content AI Import
- Project Case Studies
- Postgres Monitoring Guidance
- Site Section Pages
- Course Presentation Components
- Site Navigation Layout
- Course Admin Table
- Database Connection Management
- Database Seed Data
- Root Layout Typography
- Database Batch Querying
- Advisory Queue Locking
- Transaction Deadlock Prevention
- Database Type Key Design
- Best Practices Changelog
- Reference Authoring Guidelines
- Global Reach Iconography
- Cursor Pagination
- Atomic Upsert Operations
- Composite Database Indexes
- Covering Database Indexes
- Database Index Types
- Partial Database Indexes
- Safe Schema Constraints
- Identifier Naming Compatibility
- Table Partitioning Strategy
- ESLint Configuration
- Next.js Configuration
- PostCSS Configuration
- File Document Iconography
- Next.js Branding
- Vercel Branding

## God Nodes (most connected - your core abstractions)
1. `cn()` - 38 edges
2. `apiError()` - 23 edges
3. `apiJson()` - 22 edges
4. `getAdminSessionFromRequest()` - 21 edges
5. `getPrisma()` - 19 edges
6. `getSiteSettings()` - 19 edges
7. `Badge()` - 18 edges
8. `Card()` - 17 edges
9. `requireAdminSession()` - 17 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Supabase Storage Uploads` --conceptually_related_to--> `Supabase Security Checklist`  [INFERRED]
  README.md → .agents/skills/supabase/SKILL.md
- `extractPdfTextFromUrl()` --references--> `pdf-parse`  [EXTRACTED]
  src/services/cv-site-content-suggester.ts → package.json
- `CourseForm()` --references--> `react`  [EXTRACTED]
  src/components/admin/course-form.tsx → package.json
- `ProjectForm()` --references--> `react`  [EXTRACTED]
  src/components/admin/project-form.tsx → package.json
- `Toast()` --references--> `react`  [EXTRACTED]
  src/components/ui/toast.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Connection Management Rules** — _agents_skills_supabase_postgres_best_practices_references_conn_idle_timeout_idle_connection_timeouts, _agents_skills_supabase_postgres_best_practices_references_conn_limits_connection_limits, _agents_skills_supabase_postgres_best_practices_references_conn_pooling_connection_pooling, _agents_skills_supabase_postgres_best_practices_references_conn_prepared_statements_prepared_statements_with_pooling [EXTRACTED 1.00]
- **Data Access Pattern Rules** — _agents_skills_supabase_postgres_best_practices_references_data_batch_inserts_batch_insert_statements, _agents_skills_supabase_postgres_best_practices_references_data_n_plus_one_n_plus_one_batch_loading, _agents_skills_supabase_postgres_best_practices_references_data_pagination_cursor_based_pagination, _agents_skills_supabase_postgres_best_practices_references_data_upsert_atomic_upsert [EXTRACTED 1.00]
- **Concurrency and Locking Rules** — _agents_skills_supabase_postgres_best_practices_references_lock_advisory_advisory_locks, _agents_skills_supabase_postgres_best_practices_references_lock_deadlock_prevention_consistent_lock_ordering, _agents_skills_supabase_postgres_best_practices_references_lock_short_transactions_short_transactions, _agents_skills_supabase_postgres_best_practices_references_lock_skip_locked_skip_locked_queue_processing [EXTRACTED 1.00]
- **PostgreSQL Query Index Optimization Family** — _agents_skills_supabase_postgres_best_practices_references_query_composite_indexes_create_composite_indexes_for_multi_column_queries, _agents_skills_supabase_postgres_best_practices_references_query_covering_indexes_use_covering_indexes_to_avoid_table_lookups, _agents_skills_supabase_postgres_best_practices_references_query_index_types_choose_the_right_index_type_for_your_data, _agents_skills_supabase_postgres_best_practices_references_query_missing_indexes_add_indexes_on_where_and_join_columns, _agents_skills_supabase_postgres_best_practices_references_query_partial_indexes_use_partial_indexes_for_filtered_queries [INFERRED 0.85]
- **PostgreSQL Schema Design Practices** — _agents_skills_supabase_postgres_best_practices_references_schema_constraints_add_constraints_safely_in_migrations, _agents_skills_supabase_postgres_best_practices_references_schema_data_types_choose_appropriate_data_types, _agents_skills_supabase_postgres_best_practices_references_schema_foreign_key_indexes_index_foreign_key_columns, _agents_skills_supabase_postgres_best_practices_references_schema_lowercase_identifiers_use_lowercase_identifiers_for_compatibility, _agents_skills_supabase_postgres_best_practices_references_schema_partitioning_partition_large_tables_for_better_performance, _agents_skills_supabase_postgres_best_practices_references_schema_primary_keys_select_optimal_primary_key_strategy [INFERRED 0.85]
- **Supabase Database Security Practices** — _agents_skills_supabase_postgres_best_practices_references_security_privileges_apply_principle_of_least_privilege, _agents_skills_supabase_postgres_best_practices_references_security_rls_basics_enable_row_level_security_for_multi_tenant_data, _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_optimize_rls_policies_for_performance, _agents_skills_supabase_skill_secure_exposed_schemas_with_rls, _agents_skills_supabase_skill_supabase_security_checklist [INFERRED 0.95]

## Communities (48 total, 15 thin omitted)

### Community 0 - "Course Admin Actions"
Cohesion: 0.06
Nodes (56): CourseFormState, createCourseAction(), deleteCourseAction(), emptyState, fieldErrorsFromIssues(), formDataToCourseInput(), optionalNumberValue(), parseStringList() (+48 more)

### Community 1 - "Project Admin Actions"
Cohesion: 0.06
Nodes (54): react, react, createProjectAction(), deleteProjectAction(), emptyState, formDataToProjectInput(), parseStringList(), toggleFeaturedAction() (+46 more)

### Community 2 - "API Upload Routes"
Cohesion: 0.11
Nodes (39): ALLOWED_IMAGE_TYPES, getFiles(), POST(), validateFiles(), getFile(), POST(), validateFile(), githubProjectRequestSchema (+31 more)

### Community 3 - "GitHub Metadata Integration"
Cohesion: 0.08
Nodes (41): CourseUrlMetadata, cleanHomepage(), ensureRepoData(), fetchGithubJson(), fetchGithubRaw(), getGithubHeaders(), getGithubRepoContext(), GithubRepoApiResponse (+33 more)

### Community 4 - "Development Tooling Config"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss (+30 more)

### Community 5 - "Project Form Workflow"
Cohesion: 0.07
Nodes (26): FormState, AiSuggestionResponse, compactSuggestionPreview(), GithubProjectResponse, GithubProjectSuggestion, ImageUploadResponse, ProjectForm(), ProjectFormProps (+18 more)

### Community 6 - "Admin Authentication"
Cohesion: 0.10
Nodes (26): logoutAction(), loginAction(), LoginState, LoginForm(), AdminLoginPage(), metadata, AdminLayout(), adminNavItems (+18 more)

### Community 7 - "Course URL AI Suggestions"
Cohesion: 0.14
Nodes (35): buildCoursePrompt(), chooseBestCourseTitle(), cleanInstructorName(), cleanString(), cleanStringArray(), compactSentence(), CourseUrlSuggestion, CourseUrlSuggestionResult (+27 more)

### Community 8 - "Supabase Security Guidance"
Cohesion: 0.07
Nodes (32): Skill Feedback Issue Template, Data API and Security Guidance Updates, Supabase Agent Skills Changelog, Add Indexes on WHERE and JOIN Columns, Supabase Query Optimization Documentation, Index Foreign Key Columns, PostgreSQL Foreign Keys Documentation, Apply Principle of Least Privilege (+24 more)

### Community 9 - "TypeScript Configuration"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "Course Metadata Parsing"
Cohesion: 0.17
Nodes (21): canUseFallback(), courseUrlRequestSchema, getCourseSuggestionWarning(), getPastedDetailsQualityError(), POST(), cleanText(), CourseMetadataError, decodeHtmlEntities() (+13 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (23): class-variance-authority, clsx, lucide-react, next, dependencies, class-variance-authority, clsx, lucide-react (+15 more)

### Community 12 - "Project Listing Pages"
Cohesion: 0.15
Nodes (16): AdminPage(), metadata, AdminProjectsPage(), Home(), metadata, ProjectsPage(), ProjectCard(), ProjectCardProps (+8 more)

### Community 13 - "Detail and Error Pages"
Cohesion: 0.16
Nodes (11): metadata, CourseDetailPage(), CourseDetailProps, formatDate(), generateMetadata(), statusLabels, ProjectsErrorProps, ProjectPageShell() (+3 more)

### Community 14 - "Site Settings Workflow"
Cohesion: 0.17
Nodes (17): formDataToSiteSettingsInput(), parseStringList(), SiteSettingsFormState, updateSiteSettingsAction(), cleanOptionalString(), defaultSiteSettingsInput, parseStringArray(), replaceLegacyDefaultSettings() (+9 more)

### Community 15 - "Resume and Buttons"
Cohesion: 0.22
Nodes (12): metadata, metadata, ResumeViewer(), ResumeViewerProps, Button(), ButtonLink(), ButtonLinkProps, ButtonProps (+4 more)

### Community 16 - "CV Content AI Import"
Cohesion: 0.20
Nodes (16): buildPrompt(), cleanString(), cleanStringArray(), cleanText(), CvImportError, CvSiteContentResult, CvSiteContentSuggestion, extractEmail() (+8 more)

### Community 17 - "Project Case Studies"
Cohesion: 0.18
Nodes (12): CaseStudySection, formatDate(), parseCaseStudyContent(), ProjectDetailPage(), ProjectDetailProps, statusDescription(), ProjectGallery(), ProjectGalleryProps (+4 more)

### Community 18 - "Postgres Monitoring Guidance"
Cohesion: 0.16
Nodes (15): Postgres Best Practice Section Definitions, Supabase Full-Text Search Documentation, Use tsvector for Full-Text Search, Index JSONB Columns for Efficient Querying, PostgreSQL JSONB Indexing Documentation, Use EXPLAIN ANALYZE to Diagnose Slow Queries, Supabase Database Inspect Documentation, Enable pg_stat_statements for Query Analysis (+7 more)

### Community 19 - "Site Section Pages"
Cohesion: 0.21
Nodes (10): AdminSettingsPage(), metadata, CoursesPage(), metadata, CvPage(), metadata, CoursesGrid(), SectionHeading() (+2 more)

### Community 20 - "Course Presentation Components"
Cohesion: 0.23
Nodes (8): CourseCard(), CourseCardProps, statusLabels, CourseVisual(), CourseVisualProps, safeBackgroundImage(), CoursesGridProps, Course

### Community 21 - "Site Navigation Layout"
Cohesion: 0.31
Nodes (6): ProjectPageShellProps, SiteFooter(), SiteFooterProps, navItems, SiteHeader(), SiteHeaderProps

### Community 22 - "Course Admin Table"
Cohesion: 0.28
Nodes (6): CoursesTable(), CoursesTableProps, formatDate(), statusLabels, DeleteCourseDialog(), DeleteCourseDialogProps

### Community 23 - "Database Connection Management"
Cohesion: 0.25
Nodes (8): Configure Idle Connection Timeouts, PostgreSQL Connection Timeout Documentation, Set Appropriate Connection Limits, Supabase Connection Management Documentation, Use Connection Pooling for All Applications, Supabase Connection Pooler Documentation, Use Prepared Statements Correctly with Pooling, Supabase Connection Pool Modes Documentation

### Community 24 - "Database Seed Data"
Cohesion: 0.29
Nodes (5): demoProjectFilters, demoSiteSettings, learningRecords, prisma, projectCaseStudies

### Community 25 - "Root Layout Typography"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 26 - "Database Batch Querying"
Cohesion: 0.50
Nodes (4): Batch INSERT Statements for Bulk Data, PostgreSQL COPY Documentation, Eliminate N+1 Queries with Batch Loading, Supabase Query Optimization Documentation

### Community 27 - "Advisory Queue Locking"
Cohesion: 0.50
Nodes (4): Use Advisory Locks for Application-Level Locking, PostgreSQL Advisory Locks Documentation, PostgreSQL SELECT FOR UPDATE Documentation, Use SKIP LOCKED for Non-Blocking Queue Processing

### Community 28 - "Transaction Deadlock Prevention"
Cohesion: 0.50
Nodes (4): Prevent Deadlocks with Consistent Lock Ordering, PostgreSQL Deadlocks Documentation, PostgreSQL Transaction Management Documentation, Keep Transactions Short to Reduce Lock Contention

### Community 29 - "Database Type Key Design"
Cohesion: 0.50
Nodes (4): Choose Appropriate Data Types, PostgreSQL Data Types Documentation, PostgreSQL Identity Columns Documentation, Select Optimal Primary Key Strategy

### Community 30 - "Best Practices Changelog"
Cohesion: 0.67
Nodes (3): Supabase Postgres Best Practices Changelog, Safe Migration Schema Constraints, Security Checklist Hardening

### Community 31 - "Reference Authoring Guidelines"
Cohesion: 0.67
Nodes (3): Agent Reference Design Principles, Writing Guidelines for Postgres References, Postgres Best Practice Reference Template

### Community 32 - "Global Reach Iconography"
Cohesion: 0.67
Nodes (3): Geographic Grid, Global Reach, Globe Icon

## Knowledge Gaps
- **243 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Project Admin Actions`, `Development Tooling Config`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `react` connect `Project Admin Actions` to `Course Admin Actions`, `Runtime Dependencies`, `Project Form Workflow`, `Admin Authentication`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Course Admin Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.06153846153846154 - nodes in this community are weakly interconnected._
- **Should `Project Admin Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.056051587301587304 - nodes in this community are weakly interconnected._
- **Should `API Upload Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.11020408163265306 - nodes in this community are weakly interconnected._
- **Should `GitHub Metadata Integration` be split into smaller, more focused modules?**
  _Cohesion score 0.07678075855689177 - nodes in this community are weakly interconnected._