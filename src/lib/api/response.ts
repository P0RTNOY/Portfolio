import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function apiJson<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function apiError(
  code: string,
  message: string,
  status = 500,
  details?: unknown,
) {
  const body: ApiErrorBody = {
    error: {
      code,
      message,
      details,
    },
  };

  return NextResponse.json(body, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(
      "VALIDATION_ERROR",
      "The request payload is invalid.",
      400,
      error.flatten(),
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return apiError(
        "CONFLICT",
        "A project with this unique value already exists.",
        409,
        error.meta,
      );
    }

    if (error.code === "P2025") {
      return apiError("NOT_FOUND", "Project not found.", 404);
    }
  }

  console.error(error);
  return apiError("INTERNAL_ERROR", "Something went wrong.", 500);
}
