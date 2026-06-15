"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";

import { loginAction, type LoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const initialState: LoginState = {
    error: null,
  };
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          className="text-sm font-semibold text-zinc-950 dark:text-white"
          htmlFor="username"
        >
          Username
        </label>
        <Input
          autoComplete="username"
          id="username"
          name="username"
          placeholder="admin"
          required
          type="text"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-semibold text-zinc-950 dark:text-white"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          autoComplete="current-password"
          id="password"
          name="password"
          placeholder="Enter admin password"
          required
          type="password"
        />
      </div>

      {state.error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <Button className="w-full" disabled={pending} size="lg" type="submit">
        <LockKeyhole aria-hidden="true" size={18} />
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
