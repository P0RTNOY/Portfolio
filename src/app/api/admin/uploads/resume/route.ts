import type { NextRequest } from "next/server";

import { apiError, apiJson } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth";
import {
  SupabaseStorageError,
  uploadResumePdf,
} from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_RESUME_SIZE_BYTES = 4 * 1024 * 1024;

function getFile(formData: FormData) {
  const file = formData.get("file");
  return file instanceof File ? file : null;
}

function validateFile(file: File | null) {
  if (!file) {
    return "Choose a PDF resume to upload.";
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return `${file.name} is not a PDF file.`;
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return `${file.name} is larger than 4 MB.`;
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

  const file = getFile(formData);
  const validationError = validateFile(file);

  if (validationError) {
    return apiError("VALIDATION_ERROR", validationError, 400);
  }

  if (!file) {
    return apiError("VALIDATION_ERROR", "Choose a PDF resume to upload.", 400);
  }

  try {
    const upload = await uploadResumePdf(file);
    return apiJson({ upload }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseStorageError) {
      return apiError(error.code, error.message, 503);
    }

    console.error(error);
    return apiError(
      "SUPABASE_UPLOAD_FAILED",
      "Resume PDF could not be uploaded right now.",
      500,
    );
  }
}
