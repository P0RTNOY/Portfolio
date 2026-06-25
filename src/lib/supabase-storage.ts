import "server-only";

import { createClient } from "@supabase/supabase-js";

const DEFAULT_PROJECT_IMAGES_BUCKET = "project-images";
const DEFAULT_RESUME_BUCKET = "portfolio-documents";
const PLACEHOLDER_SERVICE_ROLE_KEY = "your_supabase_service_role_key_here";
const PLACEHOLDER_URL = "https://your-project-ref.supabase.co";

type SupabaseStorageConfig = {
  projectImagesBucket: string;
  resumeBucket: string;
  serviceRoleKey: string;
  url: string;
};

const readyBuckets = new Set<string>();

export class SupabaseStorageError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "SUPABASE_BUCKET_ERROR"
      | "SUPABASE_NOT_CONFIGURED"
      | "SUPABASE_UPLOAD_FAILED",
  ) {
    super(message);
    this.name = "SupabaseStorageError";
  }
}

function getSupabaseStorageConfig(): SupabaseStorageConfig {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || url === PLACEHOLDER_URL) {
    throw new SupabaseStorageError(
      "SUPABASE_URL is not configured.",
      "SUPABASE_NOT_CONFIGURED",
    );
  }

  if (!serviceRoleKey || serviceRoleKey === PLACEHOLDER_SERVICE_ROLE_KEY) {
    throw new SupabaseStorageError(
      "SUPABASE_SERVICE_ROLE_KEY is not configured.",
      "SUPABASE_NOT_CONFIGURED",
    );
  }

  return {
    projectImagesBucket:
      process.env.SUPABASE_PROJECT_IMAGES_BUCKET?.trim() ||
      DEFAULT_PROJECT_IMAGES_BUCKET,
    resumeBucket:
      process.env.SUPABASE_RESUME_BUCKET?.trim() || DEFAULT_RESUME_BUCKET,
    serviceRoleKey,
    url,
  };
}

function getSupabaseStorageClient() {
  const config = getSupabaseStorageConfig();

  return {
    client: createClient(config.url, config.serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    }),
    projectImagesBucket: config.projectImagesBucket,
    resumeBucket: config.resumeBucket,
  };
}

async function ensurePublicBucket(bucket: string) {
  if (readyBuckets.has(bucket)) {
    return {
      bucket,
      client: getSupabaseStorageClient().client,
    };
  }

  const storage = getSupabaseStorageClient();
  const { data, error } = await storage.client.storage.getBucket(
    bucket,
  );

  if (data && !error) {
    if (!data.public) {
      const { error: updateError } =
        await storage.client.storage.updateBucket(bucket, {
          public: true,
        });

      if (updateError) {
        throw new SupabaseStorageError(
          updateError.message,
          "SUPABASE_BUCKET_ERROR",
        );
      }
    }

    readyBuckets.add(bucket);
    return {
      bucket,
      client: storage.client,
    };
  }

  const { error: createError } = await storage.client.storage.createBucket(
    bucket,
    {
      public: true,
    },
  );

  if (createError) {
    throw new SupabaseStorageError(
      createError.message,
      "SUPABASE_BUCKET_ERROR",
    );
  }

  readyBuckets.add(bucket);
  return {
    bucket,
    client: storage.client,
  };
}

async function ensureProjectImagesBucket() {
  const storage = getSupabaseStorageClient();
  return ensurePublicBucket(storage.projectImagesBucket);
}

async function ensureResumeBucket() {
  const storage = getSupabaseStorageClient();
  return ensurePublicBucket(storage.resumeBucket);
}

export async function uploadProjectImage(file: File) {
  const storage = await ensureProjectImagesBucket();
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const objectPath = [
    "project-screenshots",
    new Date().toISOString().slice(0, 10),
    `${crypto.randomUUID()}.${extension}`,
  ].join("/");
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await storage.client.storage
    .from(storage.bucket)
    .upload(objectPath, buffer, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new SupabaseStorageError(error.message, "SUPABASE_UPLOAD_FAILED");
  }

  const { data } = storage.client.storage
    .from(storage.bucket)
    .getPublicUrl(objectPath);

  return {
    path: objectPath,
    url: data.publicUrl,
  };
}

export async function uploadResumePdf(file: File) {
  const storage = await ensureResumeBucket();
  const objectPath = [
    "resumes",
    new Date().toISOString().slice(0, 10),
    `resume-${crypto.randomUUID()}.pdf`,
  ].join("/");
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await storage.client.storage
    .from(storage.bucket)
    .upload(objectPath, buffer, {
      cacheControl: "3600",
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    throw new SupabaseStorageError(error.message, "SUPABASE_UPLOAD_FAILED");
  }

  const { data } = storage.client.storage
    .from(storage.bucket)
    .getPublicUrl(objectPath);

  return {
    path: objectPath,
    url: data.publicUrl,
  };
}
