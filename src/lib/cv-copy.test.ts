import assert from "node:assert/strict";
import test from "node:test";

import {
  CV_FOCUS_AREAS,
  CV_METADATA_DESCRIPTION,
  DEFAULT_CONTACT_SUMMARY,
  getCvPageCopy,
  getHomepageCvCopy,
} from "./cv-copy";

test("homepage CV copy describes available download only when configured", () => {
  const present = getHomepageCvCopy(true);
  const absent = getHomepageCvCopy(false);

  assert.match(present.description, /latest PDF/i);
  assert.match(present.availability, /read|download/i);
  assert.match(absent.description, /once it is uploaded/i);
  assert.match(absent.availability, /not available yet/i);
  assert.doesNotMatch(absent.description, /read the latest PDF/i);
});

test("CV page framing is truthful in present and absent states", () => {
  assert.match(getCvPageCopy(true).description, /This CV brings/i);
  assert.match(getCvPageCopy(false).description, /once it is uploaded/i);
  assert.deepEqual(CV_FOCUS_AREAS, [
    "Full-stack work",
    "AI tooling",
    "Databases and APIs",
    "Admin workflows",
    "Learning discipline",
  ]);
});

test("metadata and default contact copy stay neutral about availability", () => {
  assert.doesNotMatch(CV_METADATA_DESCRIPTION, /read|download|available/i);
  assert.doesNotMatch(DEFAULT_CONTACT_SUMMARY, /once|uploaded|available/i);
});
