import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSession = {
  username: string;
  expiresAt: number;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  if (
    process.env.NODE_ENV === "production" &&
    (value === "change-me" || value === "replace-with-a-long-random-secret")
  ) {
    throw new Error(`${name} must be changed before production use.`);
  }

  return value;
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function fromBase64Url(input: string) {
  const padded = input.padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  return Buffer.from(padded.replaceAll("-", "+").replaceAll("_", "/"), "base64");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(payload: string) {
  return base64Url(
    createHmac("sha256", getRequiredEnv("AUTH_SECRET")).update(payload).digest(),
  );
}

export function createAdminSessionToken(username: string) {
  const session: AdminSession = {
    username,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const payload = base64Url(JSON.stringify(session));
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !safeEqual(signature, signPayload(payload))) {
    return null;
  }

  try {
    const session = JSON.parse(fromBase64Url(payload).toString("utf8")) as AdminSession;

    if (!session.username || session.expiresAt <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(username: string, password: string) {
  const expectedUsername = getRequiredEnv("ADMIN_USERNAME");
  const expectedPassword = getRequiredEnv("ADMIN_PASSWORD");

  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(username), {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export function getAdminSessionFromRequest(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
