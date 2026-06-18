import { NextRequest } from "next/server";

import { apiError, apiJson, handleApiError } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { deleteProject, getProjectById, updateProject } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProjectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectById(id);

    if (!project) {
      return apiError("NOT_FOUND", "Project not found.", 404);
    }

    return apiJson({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: ProjectRouteContext) {
  try {
    const session = await getAdminSessionFromRequest(request);

    if (!session) {
      return apiError("UNAUTHORIZED", "Admin authentication is required.", 401);
    }

    const { id } = await context.params;
    const payload = await request.json();
    const project = await updateProject(id, payload);

    return apiJson({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: ProjectRouteContext,
) {
  try {
    const session = await getAdminSessionFromRequest(_request);

    if (!session) {
      return apiError("UNAUTHORIZED", "Admin authentication is required.", 401);
    }

    const { id } = await context.params;
    await deleteProject(id);

    return apiJson({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
