import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { FeaturedProjects } from "@/components/projects/featured-projects";
import {
  CapabilityGrid,
  groupSkills,
} from "@/components/site/capability-grid";
import {
  FALLBACK_PROJECTS,
  FALLBACK_SITE_SETTINGS,
} from "@/lib/public-portfolio-content";

test("groups technical skills by engineering outcome without duplicates", () => {
  const groups = groupSkills(FALLBACK_SITE_SETTINGS.skills);
  const groupedSkills = groups.flatMap((group) => group.skills);

  assert.equal(new Set(groupedSkills).size, groupedSkills.length);
  assert.ok(groups.some((group) => group.title === "Product engineering"));
  assert.ok(groups.some((group) => group.title === "Backend & data"));
  assert.ok(groups.some((group) => group.title === "Applied AI"));
});

test("capability grid retains authored skills that do not match a known group", () => {
  const markup = renderToStaticMarkup(
    <CapabilityGrid skills={["TypeScript", "Uncommon Tool"]} />,
  );

  assert.match(markup, /TypeScript/);
  assert.match(markup, /Uncommon Tool/);
  assert.match(markup, /Additional tools/);
});

test("featured work exposes the problem, role, stack, and evidence links", () => {
  const markup = renderToStaticMarkup(
    <FeaturedProjects projects={FALLBACK_PROJECTS} />,
  );

  assert.match(markup, /Personal Portfolio Platform/);
  assert.match(markup, /Full-stack developer/);
  assert.match(markup, /The problem/);
  assert.match(markup, /Read case study/);
  assert.match(markup, /GitHub/);
});
