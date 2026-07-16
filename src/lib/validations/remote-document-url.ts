import { z } from "zod";

const REMOTE_DOCUMENT_URL_MAX_LENGTH = 1200;
const REMOTE_DOCUMENT_URL_MESSAGE =
  "Enter a credential-free HTTPS document URL.";

export function normalizeRemoteDocumentUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value.trim());

    if (
      url.protocol !== "https:" ||
      url.username !== "" ||
      url.password !== ""
    ) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

export const remoteDocumentUrlSchema = z
  .string()
  .trim()
  .max(REMOTE_DOCUMENT_URL_MAX_LENGTH, "Document URL is too long.")
  .refine((value) => normalizeRemoteDocumentUrl(value) !== null, {
    message: REMOTE_DOCUMENT_URL_MESSAGE,
  });

export const optionalRemoteDocumentUrlSchema = remoteDocumentUrlSchema
  .optional()
  .or(z.literal("").transform(() => undefined));
