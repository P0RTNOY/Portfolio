import type { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiJson } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth";
import {
  CourseMetadataError,
  getFallbackCourseUrlMetadata,
  getCourseUrlMetadata,
} from "@/lib/course-metadata";
import { createCourseUrlSuggestion } from "@/services/ai-project-assistant";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const courseUrlRequestSchema = z.object({
  courseUrl: z.string().trim().url("Enter a valid course URL.").max(800),
  pastedDetails: z.string().trim().max(12000).optional(),
});

function canUseFallback(error: CourseMetadataError) {
  return error.code === "COURSE_METADATA_FETCH_FAILED";
}

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session) {
    return apiError("UNAUTHORIZED", "Admin authentication is required.", 401);
  }

  const payload: unknown = await request.json().catch(() => null);
  const parsed = courseUrlRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Course URL is missing or invalid.",
      400,
      parsed.error.flatten(),
    );
  }

  try {
    const metadata = await getCourseUrlMetadata(parsed.data.courseUrl);
    const result = await createCourseUrlSuggestion(
      metadata,
      parsed.data.pastedDetails,
    );

    return apiJson({
      aiWarning: result.aiWarning,
      metadata,
      suggestion: result.suggestion,
    });
  } catch (error) {
    if (error instanceof CourseMetadataError) {
      if (canUseFallback(error)) {
        const metadata = getFallbackCourseUrlMetadata(parsed.data.courseUrl);
        const result = await createCourseUrlSuggestion(
          metadata,
          parsed.data.pastedDetails,
        );
        const warning = parsed.data.pastedDetails
          ? `${error.message} Hugging Face used your pasted course details plus URL context. Review carefully before saving.`
          : `${error.message} Hugging Face used URL-only fallback suggestions. Review carefully before saving.`;

        return apiJson({
          aiWarning: result.aiWarning
            ? `${warning} AI note: ${result.aiWarning}`
            : warning,
          metadata,
          suggestion: result.suggestion,
        });
      }

      return apiError(error.code, error.message, 400);
    }

    console.error(error);
    return apiError(
      "COURSE_IMPORT_FAILED",
      "The course page could not be imported right now.",
      500,
    );
  }
}
