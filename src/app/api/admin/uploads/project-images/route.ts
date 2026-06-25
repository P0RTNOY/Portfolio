import type { NextRequest } from "next/server";

import { apiError, apiJson } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth";
import {
  SupabaseStorageError,
  uploadProjectImage,
} from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const MAX_FILE_SIZE_BYTES = 3.5 * 1024 * 1024;
const MAX_TOTAL_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 8;

function getFiles(formData: FormData) {
  return formData
    .getAll("files")
    .filter((file): file is File => file instanceof File);
}

function validateFiles(files: File[]) {
  if (files.length === 0) {
    return "Choose at least one image to upload.";
  }

  if (files.length > MAX_FILES_PER_REQUEST) {
    return `Upload up to ${MAX_FILES_PER_REQUEST} images at a time.`;
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > MAX_TOTAL_SIZE_BYTES) {
    return "Upload up to 4 MB total at a time.";
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return `${file.name} is not a supported image type.`;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `${file.name} is larger than 3.5 MB.`;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session) {
    return apiError("UNAUTHORIZED", "Admin authentication is required.", 401);
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return apiError("VALIDATION_ERROR", "Upload payload is invalid.", 400);
  }

  const files = getFiles(formData);
  const validationError = validateFiles(files);

  if (validationError) {
    return apiError("VALIDATION_ERROR", validationError, 400);
  }

  try {
    const uploads = await Promise.all(files.map((file) => uploadProjectImage(file)));
    return apiJson({ uploads }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseStorageError) {
      return apiError(error.code, error.message, 503);
    }

    console.error(error);
    return apiError(
      "SUPABASE_UPLOAD_FAILED",
      "Project images could not be uploaded right now.",
      500,
    );
  }
}
