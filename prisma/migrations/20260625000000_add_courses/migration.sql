CREATE TABLE "courses" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'Udemy',
  "course_url" TEXT NOT NULL,
  "image_url" TEXT,
  "short_description" TEXT NOT NULL,
  "full_description" TEXT NOT NULL DEFAULT '',
  "skills" TEXT NOT NULL DEFAULT '[]',
  "instructor" TEXT,
  "status" TEXT NOT NULL DEFAULT 'planned',
  "progress" INTEGER NOT NULL DEFAULT 0,
  "certificate_url" TEXT,
  "credential_url" TEXT,
  "started_at" DATE,
  "completed_at" DATE,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");
CREATE INDEX "courses_featured_display_order_idx" ON "courses"("featured", "display_order");
CREATE INDEX "courses_status_idx" ON "courses"("status");
CREATE INDEX "courses_created_at_idx" ON "courses"("created_at");

