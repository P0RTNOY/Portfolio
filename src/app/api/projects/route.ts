import { NextRequest } from "next/server";

import { apiError, apiJson, handleApiError } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth";
import {
  createProject,
  getProjectBySlug,
  listProjects,
} from "@/lib/projects";
import { projectStatusSchema } from "@/lib/validations/project";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slug = searchParams.get("slug");

    if (slug) {
      const project = await getProjectBySlug(slug);

      if (!project) {
        return apiError("NOT_FOUND", "Project not found.", 404);
      }

      return apiJson({ project });
    }

    const featuredParam = searchParams.get("featured");
    const statusParam = searchParams.get("status");
    const status = statusParam
      ? projectStatusSchema.parse(statusParam)
      : undefined;

    const projects = await listProjects({
      featured: featuredParam ? featuredParam === "true" : undefined,
      status,
    });

    return apiJson({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(request);

    if (!session) {
      return apiError("UNAUTHORIZED", "Admin authentication is required.", 401);
    }

    const payload = await request.json();
    const project = await createProject(payload);

    return apiJson({ project }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
