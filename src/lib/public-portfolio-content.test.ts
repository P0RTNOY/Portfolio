import assert from "node:assert/strict";
import test from "node:test";

import {
  FALLBACK_COURSES,
  FALLBACK_PROJECTS,
  FALLBACK_SITE_SETTINGS,
  getPublicCourseBySlug,
  getPublicPortfolioData,
  getPublicProjectBySlug,
  readWithDeadline,
  type PublicPortfolioReaders,
} from "./public-portfolio-content";
import { getDefaultSiteSettingsInput } from "./site-settings";

function createReaders(
  overrides: Partial<PublicPortfolioReaders> = {},
): PublicPortfolioReaders {
  return {
    getCourseBySlug: async () => null,
    getProjectBySlug: async () => null,
    getSiteSettings: async () => FALLBACK_SITE_SETTINGS,
    listCourses: async () => [],
    listProjects: async () => [],
    ...overrides,
  };
}

test("uses every live public content source when reads succeed", async () => {
  const liveSettings = {
    ...FALLBACK_SITE_SETTINGS,
    siteName: "Live portfolio",
  };
  const liveProjects = [{ ...FALLBACK_PROJECTS[0], title: "Live project" }];
  const liveCourses = [{ ...FALLBACK_COURSES[0], title: "Live course" }];

  const result = await getPublicPortfolioData(
    createReaders({
      getSiteSettings: async () => liveSettings,
      listProjects: async () => liveProjects,
      listCourses: async () => liveCourses,
    }),
  );

  assert.equal(result.settings.siteName, "Live portfolio");
  assert.equal(result.projects[0]?.title, "Live project");
  assert.equal(result.courses[0]?.title, "Live course");
  assert.deepEqual(result.fallbackSources, []);
});

test("stops waiting when a public content source exceeds its deadline", async () => {
  await assert.rejects(
    readWithDeadline(() => new Promise<never>(() => undefined), 5),
    /timed out/,
  );
});

test("falls back independently when one public content source fails", async () => {
  const result = await getPublicPortfolioData(
    createReaders({
      getSiteSettings: async () => {
        throw new Error("database unavailable");
      },
      listProjects: async () => [],
      listCourses: async () => [],
    }),
  );

  assert.equal(result.settings.siteName, FALLBACK_SITE_SETTINGS.siteName);
  assert.deepEqual(result.projects, []);
  assert.deepEqual(result.courses, []);
  assert.deepEqual(result.fallbackSources, ["settings"]);
});

test("uses checked-in records when live public collections cannot load", async () => {
  const result = await getPublicPortfolioData(
    createReaders({
      listProjects: async () => {
        throw new Error("projects unavailable");
      },
      listCourses: async () => {
        throw new Error("courses unavailable");
      },
    }),
  );

  assert.equal(result.projects[0]?.slug, "personal-portfolio-platform");
  assert.equal(result.courses[0]?.slug, "become-an-llm-engineer-in-8-weeks");
  assert.deepEqual(result.fallbackSources, ["projects", "courses"]);
});

test("resolves checked-in project and course detail records after read failures", async () => {
  const readers = createReaders({
    getProjectBySlug: async () => {
      throw new Error("project unavailable");
    },
    getCourseBySlug: async () => {
      throw new Error("course unavailable");
    },
  });

  const project = await getPublicProjectBySlug(
    "ai-pictionary-game",
    readers,
  );
  const course = await getPublicCourseBySlug(
    "become-an-llm-engineer-in-8-weeks",
    readers,
  );

  assert.equal(project?.title, "AI Pictionary Game");
  assert.equal(course?.title, "Become an LLM Engineer in 8 Weeks");
});

test("default public positioning leads with engineering work instead of career stage", () => {
  const defaults = getDefaultSiteSettingsInput();

  assert.doesNotMatch(defaults.heroEyebrow, /junior/i);
  assert.doesNotMatch(defaults.heroIntro, /junior/i);
  assert.match(defaults.heroTitle, /products/i);
  assert.equal(defaults.primaryCtaLabel, "Explore selected work");
});
