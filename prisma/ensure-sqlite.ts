import { closeSync, existsSync, mkdirSync, openSync, readFileSync } from "node:fs";
import path from "node:path";

function readDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    return null;
  }

  const envFile = readFileSync(envPath, "utf8");
  const match = envFile.match(/^DATABASE_URL=(.+)$/m);
  return match?.[1]?.trim().replace(/^["']|["']$/g, "") ?? null;
}

const databaseUrl = readDatabaseUrl();

if (databaseUrl?.startsWith("file:")) {
  const rawPath = databaseUrl.replace(/^file:/, "");
  const databasePath = path.isAbsolute(rawPath)
    ? rawPath
    : path.join(process.cwd(), "prisma", rawPath);

  mkdirSync(path.dirname(databasePath), { recursive: true });
  closeSync(openSync(databasePath, "a"));
}
