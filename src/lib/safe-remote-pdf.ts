import { lookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { Readable } from "node:stream";

import { normalizeRemoteDocumentUrl } from "./validations/remote-document-url";

const DEFAULT_MAX_BYTES = 4 * 1024 * 1024;
const DEFAULT_MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 10_000;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

export type SafeRemotePdfResult = {
  bytes: Uint8Array<ArrayBuffer>;
  contentType: string;
};

export type SafeRemotePdfOptions = {
  fetch?: (
    url: URL,
    init: RequestInit,
    validatedAddresses: readonly string[],
  ) => Promise<Response>;
  maxBytes?: number;
  maxRedirects?: number;
  resolve?: (hostname: string) => Promise<readonly string[]>;
};

export class SafeRemotePdfError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "DNS_LOOKUP_FAILED"
      | "FETCH_FAILED"
      | "NOT_PDF"
      | "TOO_LARGE"
      | "TOO_MANY_REDIRECTS"
      | "UNSAFE_ADDRESS"
      | "UNSAFE_URL",
  ) {
    super(message);
    this.name = "SafeRemotePdfError";
  }
}

function ipv4ToNumber(address: string) {
  return address
    .split(".")
    .reduce((value, part) => value * 256 + Number(part), 0);
}

function ipv4MatchesCidr(address: string, base: string, prefix: number) {
  const value = ipv4ToNumber(address);
  const baseValue = ipv4ToNumber(base);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return (value & mask) === (baseValue & mask);
}

const BLOCKED_IPV4_CIDRS: ReadonlyArray<readonly [string, number]> = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];

function expandIpv6(address: string) {
  const withoutZone = address.toLowerCase().split("%", 1)[0];
  const ipv4Tail = withoutZone.match(/(?:^|:)(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  let normalized = withoutZone;

  if (ipv4Tail) {
    const value = ipv4ToNumber(ipv4Tail);
    normalized = normalized.replace(
      ipv4Tail,
      `${((value >>> 16) & 0xffff).toString(16)}:${(value & 0xffff).toString(16)}`,
    );
  }

  const halves = normalized.split("::");
  if (halves.length > 2) {
    return null;
  }

  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves[1] ? halves[1].split(":") : [];
  const missing = 8 - left.length - right.length;

  if ((halves.length === 1 && missing !== 0) || missing < 0) {
    return null;
  }

  const groups = [...left, ...Array(missing).fill("0"), ...right];
  if (
    groups.length !== 8 ||
    groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))
  ) {
    return null;
  }

  return groups.map((group) => Number.parseInt(group, 16));
}

function ipv6MatchesCidr(address: string, base: string, prefix: number) {
  const value = expandIpv6(address);
  const baseValue = expandIpv6(base);

  if (value === null || baseValue === null) {
    return false;
  }

  const fullGroups = Math.floor(prefix / 16);
  const remainingBits = prefix % 16;

  for (let index = 0; index < fullGroups; index += 1) {
    if (value[index] !== baseValue[index]) {
      return false;
    }
  }

  if (remainingBits === 0) {
    return true;
  }

  const mask = (0xffff << (16 - remainingBits)) & 0xffff;
  return (value[fullGroups] & mask) === (baseValue[fullGroups] & mask);
}

const BLOCKED_IPV6_CIDRS: ReadonlyArray<readonly [string, number]> = [
  ["::", 96],
  ["::ffff:0:0", 96],
  ["64:ff9b:1::", 48],
  ["100::", 64],
  ["2001::", 32],
  ["2001:2::", 48],
  ["2001:10::", 28],
  ["2001:20::", 28],
  ["2001:db8::", 32],
  ["3fff::", 20],
  ["5f00::", 16],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
];

function isBlockedAddress(address: string) {
  const version = isIP(address);

  if (version === 4) {
    return BLOCKED_IPV4_CIDRS.some(([base, prefix]) =>
      ipv4MatchesCidr(address, base, prefix),
    );
  }

  if (version === 6) {
    return BLOCKED_IPV6_CIDRS.some(([base, prefix]) =>
      ipv6MatchesCidr(address, base, prefix),
    );
  }

  return true;
}

async function defaultResolve(hostname: string) {
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  return addresses.map(({ address }) => address);
}

function fetchWithPinnedAddress(
  url: URL,
  init: RequestInit,
  validatedAddresses: readonly string[],
) {
  return new Promise<Response>((resolve, reject) => {
    const pinnedAddress = validatedAddresses[0];
    const request = httpsRequest(
      url,
      {
        headers: Object.fromEntries(new Headers(init.headers).entries()),
        method: "GET",
        lookup: (_hostname, _options, callback) => {
          callback(null, pinnedAddress, isIP(pinnedAddress) as 4 | 6);
        },
      },
      (incoming) => {
        const headers = new Headers();
        for (const [name, value] of Object.entries(incoming.headers)) {
          if (Array.isArray(value)) {
            for (const item of value) {
              headers.append(name, item);
            }
          } else if (value !== undefined) {
            headers.set(name, value);
          }
        }

        const status = incoming.statusCode ?? 500;
        const hasBody = status !== 204 && status !== 304;
        const body = hasBody
          ? (Readable.toWeb(incoming) as ReadableStream<Uint8Array>)
          : null;
        resolve(new Response(body, { headers, status }));
      },
    );

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error("The remote PDF request timed out."));
    });
    request.on("error", reject);
    request.end();
  });
}

function parseSafeUrl(value: string) {
  const normalized = normalizeRemoteDocumentUrl(value);
  if (!normalized) {
    throw new SafeRemotePdfError(
      "The remote document URL must use HTTPS without credentials.",
      "UNSAFE_URL",
    );
  }

  return new URL(normalized);
}

async function assertPublicDestination(
  url: URL,
  resolve: (hostname: string) => Promise<readonly string[]>,
) {
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const literalVersion = isIP(hostname);
  let addresses: readonly string[];

  if (literalVersion !== 0) {
    addresses = [hostname];
  } else {
    try {
      addresses = await resolve(hostname);
    } catch {
      throw new SafeRemotePdfError(
        "The remote document host could not be resolved.",
        "DNS_LOOKUP_FAILED",
      );
    }
  }

  if (addresses.length === 0) {
    throw new SafeRemotePdfError(
      "The remote document host could not be resolved.",
      "DNS_LOOKUP_FAILED",
    );
  }

  if (addresses.some((address) => isBlockedAddress(address))) {
    throw new SafeRemotePdfError(
      "The remote document host resolves to a non-public address.",
      "UNSAFE_ADDRESS",
    );
  }

  return addresses;
}

async function readBoundedBody(response: Response, maxBytes: number) {
  if (!response.body) {
    return new Uint8Array(0);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new SafeRemotePdfError(
        "The remote PDF exceeds the allowed size.",
        "TOO_LARGE",
      );
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function fetchSafeRemotePdf(
  input: string,
  options: SafeRemotePdfOptions = {},
): Promise<SafeRemotePdfResult> {
  const fetchImpl = options.fetch ?? fetchWithPinnedAddress;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const resolve = options.resolve ?? defaultResolve;
  let currentUrl = parseSafeUrl(input);
  let redirects = 0;

  while (true) {
    const validatedAddresses = await assertPublicDestination(
      currentUrl,
      resolve,
    );

    let response: Response;
    try {
      response = await fetchImpl(currentUrl, {
        headers: { Accept: "application/pdf" },
        redirect: "manual",
      }, validatedAddresses);
    } catch {
      throw new SafeRemotePdfError(
        "The remote PDF request failed.",
        "FETCH_FAILED",
      );
    }

    if (REDIRECT_STATUSES.has(response.status)) {
      await response.body?.cancel();

      if (redirects >= maxRedirects) {
        throw new SafeRemotePdfError(
          "The remote PDF exceeded the redirect limit.",
          "TOO_MANY_REDIRECTS",
        );
      }

      const location = response.headers.get("location");
      if (!location) {
        throw new SafeRemotePdfError(
          "The remote PDF returned an invalid redirect.",
          "FETCH_FAILED",
        );
      }

      try {
        currentUrl = parseSafeUrl(new URL(location, currentUrl).href);
      } catch (error) {
        if (error instanceof SafeRemotePdfError) {
          throw error;
        }
        throw new SafeRemotePdfError(
          "The remote PDF returned an invalid redirect.",
          "FETCH_FAILED",
        );
      }
      redirects += 1;
      continue;
    }

    if (!response.ok) {
      await response.body?.cancel();
      throw new SafeRemotePdfError(
        "The remote PDF request was not successful.",
        "FETCH_FAILED",
      );
    }

    const contentType = response.headers.get("content-type")?.trim() ?? "";
    if (!/^application\/pdf(?:\s*;|$)/i.test(contentType)) {
      await response.body?.cancel();
      throw new SafeRemotePdfError(
        "The remote response is not a PDF.",
        "NOT_PDF",
      );
    }

    const contentLength = response.headers.get("content-length");
    if (
      contentLength !== null &&
      Number.isFinite(Number(contentLength)) &&
      Number(contentLength) > maxBytes
    ) {
      await response.body?.cancel();
      throw new SafeRemotePdfError(
        "The remote PDF exceeds the allowed size.",
        "TOO_LARGE",
      );
    }

    return {
      bytes: await readBoundedBody(response, maxBytes),
      contentType,
    };
  }
}
