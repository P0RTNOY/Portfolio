import "server-only";

export type CourseUrlMetadata = {
  canonicalUrl: string;
  description: string | null;
  imageUrl: string | null;
  instructor: string | null;
  provider: string | null;
  title: string | null;
};

export class CourseMetadataError extends Error {
  code:
    | "COURSE_METADATA_FETCH_FAILED"
    | "COURSE_METADATA_INVALID_URL"
    | "COURSE_METADATA_TOO_LARGE";

  constructor(code: CourseMetadataError["code"], message: string) {
    super(message);
    this.name = "CourseMetadataError";
    this.code = code;
  }
}

const MAX_HTML_BYTES = 1_000_000;

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_match, code: string) =>
      String.fromCharCode(Number(code)),
    );
}

function cleanText(value: string | null | undefined) {
  return value
    ? decodeHtmlEntities(value.replace(/\s+/g, " ").trim()) || null
    : null;
}

function getAttribute(tag: string, name: string) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
  return cleanText(tag.match(pattern)?.[1]);
}

function extractMeta(html: string) {
  const values = new Map<string, string>();
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const key = getAttribute(tag, "property") ?? getAttribute(tag, "name");
    const content = getAttribute(tag, "content");

    if (key && content && !values.has(key.toLowerCase())) {
      values.set(key.toLowerCase(), content);
    }
  }

  return values;
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return cleanText(match?.[1]);
}

function extractJsonLd(html: string) {
  const scripts = html.match(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );

  if (!scripts) {
    return [];
  }

  return scripts.flatMap((script) => {
    const json = script
      .replace(/^<script\b[^>]*>/i, "")
      .replace(/<\/script>$/i, "")
      .trim();

    try {
      const parsed: unknown = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  });
}

function flattenJsonLdNodes(nodes: unknown[]): Record<string, unknown>[] {
  const flattened: Record<string, unknown>[] = [];

  for (const node of nodes) {
    if (!node || typeof node !== "object") {
      continue;
    }

    const record = node as Record<string, unknown>;
    flattened.push(record);

    if (Array.isArray(record["@graph"])) {
      flattened.push(...flattenJsonLdNodes(record["@graph"]));
    }
  }

  return flattened;
}

function firstString(value: unknown): string | null {
  if (typeof value === "string") {
    return cleanText(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const stringValue = firstString(item);
      if (stringValue) return stringValue;
    }
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (
      firstString(record.name) ??
      firstString(record.url) ??
      firstString(record["@id"])
    );
  }

  return null;
}

function getJsonLdCourse(html: string) {
  const nodes = flattenJsonLdNodes(extractJsonLd(html));

  return (
    nodes.find((node) => {
      const type = node["@type"];
      return Array.isArray(type)
        ? type.includes("Course")
        : type === "Course" || type === "Product";
    }) ?? null
  );
}

function toAbsoluteUrl(value: string | null, baseUrl: string) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function getProviderFromUrl(url: URL) {
  return url.hostname
    .replace(/^www\./, "")
    .split(".")
    .at(0)
    ?.replace(/^\w/, (letter) => letter.toUpperCase()) ?? null;
}

export async function getCourseUrlMetadata(
  courseUrl: string,
): Promise<CourseUrlMetadata> {
  let url: URL;

  try {
    url = new URL(courseUrl);
  } catch {
    throw new CourseMetadataError(
      "COURSE_METADATA_INVALID_URL",
      "Enter a valid course URL.",
    );
  }

  const response = await fetch(url, {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (compatible; PortfolioCourseImporter/1.0; +https://example.com)",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    const blockedMessage =
      response.status === 401 || response.status === 403
        ? "The course provider blocked server-side metadata access. Add the course manually, or use an official authenticated provider integration later."
        : `The course page returned HTTP ${response.status}.`;

    throw new CourseMetadataError(
      "COURSE_METADATA_FETCH_FAILED",
      blockedMessage,
    );
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_HTML_BYTES) {
    throw new CourseMetadataError(
      "COURSE_METADATA_TOO_LARGE",
      "The course page is too large to import safely.",
    );
  }

  const html = await response.text();

  if (html.length > MAX_HTML_BYTES) {
    throw new CourseMetadataError(
      "COURSE_METADATA_TOO_LARGE",
      "The course page is too large to import safely.",
    );
  }

  const meta = extractMeta(html);
  const courseNode = getJsonLdCourse(html);
  const providerFromUrl = getProviderFromUrl(url);
  const imageUrl = toAbsoluteUrl(
    firstString(courseNode?.["image"]) ??
      meta.get("og:image") ??
      meta.get("twitter:image") ??
      null,
    response.url,
  );

  return {
    canonicalUrl:
      toAbsoluteUrl(meta.get("og:url") ?? meta.get("canonical") ?? null, response.url) ??
      response.url,
    description:
      firstString(courseNode?.["description"]) ??
      meta.get("og:description") ??
      meta.get("description") ??
      meta.get("twitter:description") ??
      null,
    imageUrl,
    instructor:
      firstString(courseNode?.["instructor"]) ??
      firstString(courseNode?.["creator"]) ??
      firstString(courseNode?.["author"]) ??
      null,
    provider:
      meta.get("og:site_name") ??
      firstString(courseNode?.["provider"]) ??
      firstString(courseNode?.["publisher"]) ??
      providerFromUrl,
    title:
      firstString(courseNode?.["name"]) ??
      meta.get("og:title") ??
      meta.get("twitter:title") ??
      extractTitle(html),
  };
}
