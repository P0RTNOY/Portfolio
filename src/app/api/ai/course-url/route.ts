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

function getPastedDetailsQualityError(value: string | undefined) {
  const details = value?.trim();

  if (!details) {
    return "Udemy blocked metadata access. Paste the course title plus the real course description or what-you-will-learn text before importing.";
  }

  const normalized = details.toLowerCase();
  const wordCount = details.split(/\s+/).filter(Boolean).length;
  const hasSentence = /[.!?]/.test(details);
  const hasLearningSignal =
    /\b(learn|prepare|covers|understand|apply|build|master|exam|certification|description|what you'?ll learn|what you will learn|course includes)\b/i.test(
      details,
    );
  const audienceOnly =
    normalized.includes("who this course is for") &&
    !hasSentence &&
    !hasLearningSignal;

  if (audienceOnly || wordCount < 35 || !hasLearningSignal) {
    return "The pasted text does not include enough course content. Paste the Udemy title, instructor, description, and what-you-will-learn bullets. The audience list alone is not enough.";
  }

  return null;
}

function getCourseSuggestionWarning({
  aiWarning,
  metadataWarning,
  pastedDetails,
}: {
  aiWarning?: string;
  metadataWarning?: string;
  pastedDetails?: string;
}) {
  if (pastedDetails) {
    return metadataWarning
      ? `${metadataWarning} Suggestions were generated from your pasted course details plus URL context. Review carefully before saving.`
      : "Suggestions were generated from your pasted course details plus page metadata. Review carefully before saving.";
  }

  if (metadataWarning && aiWarning) {
    return `${metadataWarning} AI note: ${aiWarning}`;
  }

  return metadataWarning ?? aiWarning;
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
      aiWarning: getCourseSuggestionWarning({
        aiWarning: result.aiWarning,
        pastedDetails: parsed.data.pastedDetails,
      }),
      metadata,
      suggestion: result.suggestion,
    });
  } catch (error) {
    if (error instanceof CourseMetadataError) {
      if (canUseFallback(error)) {
        const metadata = getFallbackCourseUrlMetadata(parsed.data.courseUrl);
        const qualityError = getPastedDetailsQualityError(
          parsed.data.pastedDetails,
        );

        if (qualityError) {
          return apiError("COURSE_DETAILS_TOO_THIN", qualityError, 422, {
            metadataBlocked: true,
          });
        }

        const result = await createCourseUrlSuggestion(
          metadata,
          parsed.data.pastedDetails,
        );

        return apiJson({
          aiWarning: getCourseSuggestionWarning({
            aiWarning: result.aiWarning,
            metadataWarning: error.message,
            pastedDetails: parsed.data.pastedDetails,
          }),
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
