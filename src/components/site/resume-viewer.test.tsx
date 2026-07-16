import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ResumeViewer } from "./resume-viewer";

test("renders an uploaded CV with obvious open and download controls", () => {
  const resumeUrl = "https://example.com/omer-portnoy-cv.pdf";
  const html = renderToStaticMarkup(
    <ResumeViewer resumeUrl={resumeUrl} />,
  );

  assert.match(html, /CV ready for review/);
  assert.match(html, /Open CV in new tab/);
  assert.match(html, /Download CV/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer"/);
  assert.match(html, /download=""/);
  assert.match(html, /title="Omer Portnoy CV PDF preview"/);
  assert.match(
    html,
    /src="https:\/\/example\.com\/omer-portnoy-cv\.pdf#view=FitH"/,
  );
});

test("renders an honest empty state until the latest CV is uploaded", () => {
  const html = renderToStaticMarkup(<ResumeViewer resumeUrl={null} />);

  assert.match(html, /CV not available/);
  assert.match(
    html,
    /The latest CV will appear here once it has been uploaded\./,
  );
  assert.doesNotMatch(html, /Open CV|Download CV|admin\/settings|Add CV/);
});
