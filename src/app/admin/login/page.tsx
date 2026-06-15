import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/app/admin/login/login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login | Generic Portfolio",
  description: "Sign in to manage portfolio projects.",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-100/70 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <ShieldCheck aria-hidden="true" size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-500">Portfolio Admin</p>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Sign in
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Use the credentials configured in environment variables to manage
              portfolio content.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
