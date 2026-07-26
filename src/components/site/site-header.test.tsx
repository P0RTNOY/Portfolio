import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

test("public navigation exposes the premium portfolio sections and contact path", () => {
  const markup = renderToStaticMarkup(<SiteHeader siteName="Omer Portnoy" />);

  assert.match(markup, /href="\/#work"/);
  assert.match(markup, /href="\/#capabilities"/);
  assert.match(markup, /href="\/#experience"/);
  assert.match(markup, /href="\/#contact"/);
  assert.match(markup, /aria-label="Open navigation"/);
});

test("public footer does not expose the private admin route", () => {
  const markup = renderToStaticMarkup(
    <SiteFooter
      contactEmail="omer@example.com"
      githubUrl="https://github.com/example"
      siteName="Omer Portnoy"
    />,
  );

  assert.doesNotMatch(markup, /href="\/admin"/);
  assert.match(markup, /mailto:omer@example.com/);
  assert.match(markup, /https:\/\/github.com\/example/);
});
