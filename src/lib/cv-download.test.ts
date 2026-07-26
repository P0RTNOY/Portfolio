import assert from "node:assert/strict";
import test from "node:test";

import { createCvDownloadResponse } from "./cv-download";

const pdfBytes = new TextEncoder().encode("%PDF-download");

test("returns 404 without a configured CV and does not fetch", async () => {
  let fetched = false;
  const response = await createCvDownloadResponse({
    fetchPdf: async () => {
      fetched = true;
      return { bytes: pdfBytes, contentType: "application/pdf" };
    },
    loadResumeUrl: async () => null,
  });

  assert.equal(response.status, 404);
  assert.equal(fetched, false);
});

test("serves configured CV bytes as a same-origin attachment", async () => {
  const response = await createCvDownloadResponse({
    fetchPdf: async (url) => {
      assert.equal(url, "https://cdn.example.com/cv.pdf");
      return { bytes: pdfBytes, contentType: "application/pdf" };
    },
    loadResumeUrl: async () => "https://cdn.example.com/cv.pdf",
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.equal(
    response.headers.get("content-disposition"),
    'attachment; filename="omer-portnoy-cv.pdf"',
  );
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), pdfBytes);
});

test("returns a generic bad-gateway response when the remote PDF is unsafe", async () => {
  const response = await createCvDownloadResponse({
    fetchPdf: async () => {
      throw new Error("upstream secret query value");
    },
    loadResumeUrl: async () => "https://cdn.example.com/cv.pdf?token=secret",
  });

  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /secret|token|cdn\.example/i);
});
