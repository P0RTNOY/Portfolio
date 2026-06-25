import type { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiJson } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth";
import {
  CvImportError,
  generateSiteContentFromCv,
} from "@/services/cv-site-content-suggester";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const requestSchema = z.object({
  resumeUrl: z.string().trim().url("Enter a valid resume PDF URL.").max(1200),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session) {
    return apiError("UNAUTHORIZED", "Admin authentication is required.", 401);
  }

  const payload: unknown = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Resume URL is missing or invalid.",
      400,
      parsed.error.flatten(),
    );
  }

  try {
    const result = await generateSiteContentFromCv(parsed.data.resumeUrl);

    return apiJson(result);
  } catch (error) {
    if (error instanceof CvImportError) {
      return apiError(error.code, error.message, 422);
    }

    console.error(error);
    return apiError(
      "CV_SITE_CONTENT_FAILED",
      "Site content could not be generated from the resume right now.",
      500,
    );
  }
}
