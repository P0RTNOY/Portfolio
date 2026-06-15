import { NextRequest } from "next/server";

import { apiError, apiJson, handleApiError } from "@/lib/api/response";
import { deleteProject, getProjectById, updateProject } from "@/lib/projects";

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
    const { id } = await context.params;
    await deleteProject(id);

    return apiJson({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
