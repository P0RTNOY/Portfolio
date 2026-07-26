import assert from "node:assert/strict";
import test from "node:test";

import { siteSettingsSchema } from "./site-settings";

const resumeUrlSchema = siteSettingsSchema.shape.resumeUrl;

test("resume URLs accept credential-free HTTPS", () => {
  assert.equal(
    resumeUrlSchema.safeParse("https://cdn.example.com/cv.pdf").success,
    true,
  );
});

test("resume URLs reject unsafe schemes", () => {
  for (const url of [
    "http://cdn.example.com/cv.pdf",
    "file:///etc/passwd",
    "ftp://cdn.example.com/cv.pdf",
  ]) {
    assert.equal(resumeUrlSchema.safeParse(url).success, false, url);
  }
});

test("resume URLs reject embedded credentials", () => {
  assert.equal(
    resumeUrlSchema.safeParse("https://user:secret@cdn.example.com/cv.pdf")
      .success,
    false,
  );
});
