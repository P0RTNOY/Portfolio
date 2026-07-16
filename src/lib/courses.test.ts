import assert from "node:assert/strict";
import test from "node:test";

import {
  getCourseLearningImpact,
  getCourseStageLabel,
} from "./courses";

type LearningImpactInput = Parameters<typeof getCourseLearningImpact>[0];

function course(
  overrides: Partial<LearningImpactInput> = {},
): LearningImpactInput {
  return {
    title: "Authored learning record",
    shortDescription: "An authored description of the learning focus.",
    skills: ["TypeScript", "Testing"],
    status: "planned",
    progress: 0,
    ...overrides,
  };
}

test("describes planned topics as an intended focus", () => {
  assert.equal(
    getCourseLearningImpact(course({ status: "planned" })),
    "Intended focus: TypeScript and Testing.",
  );
});

test("describes in-progress topics as currently developing", () => {
  assert.equal(
    getCourseLearningImpact(
      course({ status: "in-progress", progress: 45 }),
    ),
    "Currently developing familiarity with TypeScript and Testing.",
  );
});

test("uses completed language only for completed records", () => {
  assert.equal(
    getCourseLearningImpact(
      course({ status: "completed", progress: 100 }),
    ),
    "Completed learning focused on TypeScript and Testing.",
  );
});

test("describes archived records as historical", () => {
  assert.equal(
    getCourseLearningImpact(course({ status: "archived", progress: 80 })),
    "Historical learning record focused on TypeScript and Testing.",
  );
});

test("does not infer broad capabilities from a mixed-topic title", () => {
  const impact = getCourseLearningImpact(
    course({
      title: "Security and Algorithms Survey",
      skills: ["CSS Grid", "Color Contrast"],
      status: "in-progress",
    }),
  );

  assert.equal(
    impact,
    "Currently developing familiarity with CSS Grid and Color Contrast.",
  );
  assert.doesNotMatch(impact, /security|algorithm|backend|cloud/i);
});

test("keeps a narrow authored topic narrow", () => {
  const impact = getCourseLearningImpact(
    course({ skills: ["OAuth"], status: "planned" }),
  );

  assert.equal(impact, "Intended focus: OAuth.");
  assert.doesNotMatch(impact, /network|vulnerabilit|secure engineering/i);
});

test("uses status-aware copy without repeating a description when skills are empty", () => {
  const expectations: Array<
    [LearningImpactInput["status"], string]
  > = [
    ["planned", "Specific topics have not been recorded for this planned track."],
    [
      "in-progress",
      "Specific topics have not yet been recorded for this in-progress track.",
    ],
    [
      "completed",
      "Specific topics were not recorded for this completed track.",
    ],
    [
      "archived",
      "Specific topics were not recorded for this archived track.",
    ],
  ];

  for (const [status, expected] of expectations) {
    const impact = getCourseLearningImpact(
      course({
        shortDescription: "A focused introduction to command-line navigation.",
        skills: [],
        status,
      }),
    );

    assert.equal(impact, expected);
    assert.doesNotMatch(impact, /command-line navigation/i);
  }
});

test("uses a status-aware fallback when skills and description are empty", () => {
  assert.equal(
    getCourseLearningImpact(
      course({ shortDescription: "", skills: [], status: "in-progress" }),
    ),
    "Specific topics have not yet been recorded for this in-progress track.",
  );
});

test("composed learning copy renders an authored description only once", () => {
  const shortDescription = "A focused introduction to command-line navigation.";
  const learningImpact = getCourseLearningImpact(
    course({ shortDescription, skills: [], status: "completed" }),
  );
  const composedCopy = `${shortDescription} ${learningImpact}`;

  assert.equal(
    composedCopy.match(/focused introduction to command-line navigation/gi)
      ?.length,
    1,
  );
});

test("stage labels distinguish every course status", () => {
  assert.equal(
    getCourseStageLabel({ status: "planned", progress: 0 }),
    "Planned next step",
  );
  assert.equal(
    getCourseStageLabel({ status: "in-progress", progress: 40 }),
    "Building momentum",
  );
  assert.equal(
    getCourseStageLabel({ status: "completed", progress: 100 }),
    "Completed learning track",
  );
  assert.equal(
    getCourseStageLabel({ status: "archived", progress: 100 }),
    "Archived learning track",
  );
});
