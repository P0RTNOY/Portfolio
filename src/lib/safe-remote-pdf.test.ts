import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchSafeRemotePdf,
  SafeRemotePdfError,
} from "./safe-remote-pdf";

const pdfBytes = new TextEncoder().encode("%PDF-test");
const publicResolver = async () => ["93.184.216.34"];

function hasCode(code: string) {
  return (error: unknown) =>
    error instanceof SafeRemotePdfError && error.code === code;
}

test("blocks unsafe schemes and URL credentials before fetching", async () => {
  let fetchCalls = 0;
  const fakeFetch: typeof fetch = async () => {
    fetchCalls += 1;
    return new Response(pdfBytes, {
      headers: { "content-type": "application/pdf" },
    });
  };

  await assert.rejects(
    fetchSafeRemotePdf("http://example.com/cv.pdf", {
      fetch: fakeFetch,
      resolve: publicResolver,
    }),
    hasCode("UNSAFE_URL"),
  );
  await assert.rejects(
    fetchSafeRemotePdf("https://user:secret@example.com/cv.pdf", {
      fetch: fakeFetch,
      resolve: publicResolver,
    }),
    (error: unknown) =>
      hasCode("UNSAFE_URL")(error) &&
      error instanceof Error &&
      !error.message.includes("secret"),
  );
  assert.equal(fetchCalls, 0);
});

test("blocks literal private, loopback, link-local, and reserved addresses", async () => {
  for (const url of [
    "https://127.0.0.1/cv.pdf",
    "https://10.0.0.8/cv.pdf",
    "https://169.254.169.254/latest/meta-data",
    "https://192.0.2.1/cv.pdf",
    "https://[::1]/cv.pdf",
    "https://[fc00::1]/cv.pdf",
  ]) {
    await assert.rejects(fetchSafeRemotePdf(url), hasCode("UNSAFE_ADDRESS"));
  }
});

test("blocks a hostname when DNS resolves to a private address", async () => {
  await assert.rejects(
    fetchSafeRemotePdf("https://cv.example.com/cv.pdf", {
      fetch: async () =>
        new Response(pdfBytes, {
          headers: { "content-type": "application/pdf" },
        }),
      resolve: async () => ["10.12.0.4"],
    }),
    hasCode("UNSAFE_ADDRESS"),
  );
});

test("revalidates redirects and blocks a redirect to a private address", async () => {
  let fetchCalls = 0;
  await assert.rejects(
    fetchSafeRemotePdf("https://cv.example.com/cv.pdf", {
      fetch: async () => {
        fetchCalls += 1;
        return new Response(null, {
          status: 302,
          headers: { location: "https://127.0.0.1/internal.pdf" },
        });
      },
      resolve: publicResolver,
    }),
    hasCode("UNSAFE_ADDRESS"),
  );
  assert.equal(fetchCalls, 1);
});

test("limits redirect hops", async () => {
  let hop = 0;
  await assert.rejects(
    fetchSafeRemotePdf("https://cv.example.com/0.pdf", {
      fetch: async () => {
        hop += 1;
        return new Response(null, {
          status: 302,
          headers: { location: `https://cv.example.com/${hop}.pdf` },
        });
      },
      maxRedirects: 2,
      resolve: publicResolver,
    }),
    hasCode("TOO_MANY_REDIRECTS"),
  );
});

test("requires a successful PDF response", async () => {
  await assert.rejects(
    fetchSafeRemotePdf("https://cv.example.com/cv.pdf", {
      fetch: async () =>
        new Response("not found", {
          headers: { "content-type": "application/pdf" },
          status: 404,
        }),
      resolve: publicResolver,
    }),
    hasCode("FETCH_FAILED"),
  );

  await assert.rejects(
    fetchSafeRemotePdf("https://cv.example.com/cv.pdf", {
      fetch: async () =>
        new Response("<html>not a pdf</html>", {
          headers: { "content-type": "text/html" },
        }),
      resolve: publicResolver,
    }),
    hasCode("NOT_PDF"),
  );
});

test("rejects declared and streamed responses over the size limit", async () => {
  await assert.rejects(
    fetchSafeRemotePdf("https://cv.example.com/cv.pdf", {
      fetch: async () =>
        new Response(pdfBytes, {
          headers: {
            "content-length": "100",
            "content-type": "application/pdf",
          },
        }),
      maxBytes: 20,
      resolve: publicResolver,
    }),
    hasCode("TOO_LARGE"),
  );

  await assert.rejects(
    fetchSafeRemotePdf("https://cv.example.com/cv.pdf", {
      fetch: async () =>
        new Response(pdfBytes, {
          headers: { "content-type": "application/pdf" },
        }),
      maxBytes: 4,
      resolve: publicResolver,
    }),
    hasCode("TOO_LARGE"),
  );
});

test("returns bounded PDF bytes and disables automatic redirects", async () => {
  let redirectMode: RequestRedirect | undefined;
  const result = await fetchSafeRemotePdf(
    "https://cv.example.com/cv.pdf",
    {
      fetch: async (_url, init) => {
        redirectMode = init?.redirect;
        return new Response(pdfBytes, {
          headers: { "content-type": "application/pdf; charset=binary" },
        });
      },
      resolve: publicResolver,
    },
  );

  assert.deepEqual(result.bytes, pdfBytes);
  assert.equal(result.contentType, "application/pdf; charset=binary");
  assert.equal(redirectMode, "manual");
});

test("passes only validated DNS answers to the request transport", async () => {
  let transportAddresses: readonly string[] | undefined;
  const transport = async (
    _url: URL,
    _init: RequestInit,
    addresses: readonly string[],
  ) => {
    transportAddresses = addresses;
    return new Response(pdfBytes, {
      headers: { "content-type": "application/pdf" },
    });
  };

  await fetchSafeRemotePdf("https://cv.example.com/cv.pdf", {
    fetch: transport,
    resolve: async () => ["93.184.216.34"],
  });

  assert.deepEqual(transportAddresses, ["93.184.216.34"]);
});
