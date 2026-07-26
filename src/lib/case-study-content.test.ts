import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCaseStudySections,
  getProjectEvidenceMessage,
} from "./case-study-content";

test("orders seeded content with an implicit overview", () => {
  const sections = buildCaseStudySections({
    description:
      "Opening context.\n\n## Architecture\nArchitecture detail.\n\n## Lessons learned and next steps\nA lesson.",
    problemSolved: "Problem detail.",
    technicalChallenges: "Challenge detail.",
  });

  assert.deepEqual(
    sections.map((section) => section.title),
    [
      "Overview",
      "Problem solved",
      "Architecture",
      "Technical challenges",
      "Lessons learned and next steps",
    ],
  );
  assert.equal(sections[0]?.body, "Opening context.");
});

test("merges an explicit overview and reorders free-form headings", () => {
  const sections = buildCaseStudySections({
    description:
      "Opening context.\n\n## Next steps\nNext action.\n\n## Overview\nOverview detail.\n\n## Implementation notes\nImplementation detail.",
    problemSolved: "Problem detail.",
    technicalChallenges: "Challenge detail.",
  });

  assert.deepEqual(
    sections.map((section) => section.title),
    [
      "Overview",
      "Problem solved",
      "Implementation notes",
      "Technical challenges",
      "Next steps",
    ],
  );
  assert.equal(
    sections.filter((section) => section.title === "Overview").length,
    1,
  );
  assert.equal(sections[0]?.body, "Opening context.\n\nOverview detail.");
});

test("evidence message references source code when a GitHub link exists", () => {
  assert.equal(
    getProjectEvidenceMessage("https://github.com/example/project"),
    "Screenshots and demo media will be added as the case study evolves. For now, use the project snapshot, case-study details, and source-code link as the available evidence.",
  );
});

test("evidence message stays honest when no GitHub link exists", () => {
  const message = getProjectEvidenceMessage(null);

  assert.equal(
    message,
    "Screenshots and demo media will be added as the case study evolves. For now, the project snapshot and case-study details are the available evidence.",
  );
  assert.doesNotMatch(message, /source[- ]code link/i);
});
