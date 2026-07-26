import assert from "node:assert/strict";
import test from "node:test";

import { buildSeedSiteSettingsUpdate } from "./seed-site-settings";

test("default null resume URL is omitted from seed updates", () => {
  assert.deepEqual(
    buildSeedSiteSettingsUpdate({
      contactTitle: "Open to opportunities",
      resumeUrl: null,
    }),
    { contactTitle: "Open to opportunities" },
  );
});

test("an explicit seed resume URL remains part of the update", () => {
  assert.deepEqual(
    buildSeedSiteSettingsUpdate({
      contactTitle: "Open to opportunities",
      resumeUrl: "https://cdn.example.com/cv.pdf",
    }),
    {
      contactTitle: "Open to opportunities",
      resumeUrl: "https://cdn.example.com/cv.pdf",
    },
  );
});
