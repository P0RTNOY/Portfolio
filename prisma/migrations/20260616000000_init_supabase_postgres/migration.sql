-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "full_description" TEXT NOT NULL DEFAULT '',
    "tech_stack" TEXT NOT NULL DEFAULT '[]',
    "github_url" TEXT,
    "live_url" TEXT,
    "image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT,
    "highlights" TEXT NOT NULL DEFAULT '[]',
    "problem_solved" TEXT,
    "technical_challenges" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "projects_status_check" CHECK ("status" IN ('planned', 'in-progress', 'completed', 'archived'))
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_featured_display_order_idx" ON "projects"("featured", "display_order");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_created_at_idx" ON "projects"("created_at");
