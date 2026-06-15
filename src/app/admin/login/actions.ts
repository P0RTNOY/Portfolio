"use server";

import { redirect } from "next/navigation";

import { setAdminSession, validateAdminCredentials } from "@/lib/auth";

export type LoginState = {
  error: string | null;
};

export async function loginAction(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return {
      error: "Enter both username and password.",
    };
  }

  if (!validateAdminCredentials(username, password)) {
    return {
      error: "The username or password is incorrect.",
    };
  }

  await setAdminSession(username);
  redirect("/admin");
}
