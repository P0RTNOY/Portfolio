import type { NextRequest } from "next/server";

import { getAdminSessionFromRequest } from "@/lib/auth";
import { apiError, apiJson } from "@/lib/api/response";
import { getAiProjectAssistantStatus } from "@/services/ai-project-assistant";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session) {
    return apiError(
      "UNAUTHORIZED",
      "Admin authentication is required.",
      401,
    );
  }

  return apiJson({
    ai: getAiProjectAssistantStatus(),
  });
}
