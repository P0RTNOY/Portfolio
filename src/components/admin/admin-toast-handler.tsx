"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Toast } from "@/components/ui/toast";

export function AdminToastHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const success = searchParams.get("success");

  function handleDismiss() {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("success");
    const newUrl = newSearchParams.toString()
      ? `${pathname}?${newSearchParams.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  }

  if (!success) return null;

  let message = "Operation successful.";
  if (success === "created") message = "Project created successfully.";
  if (success === "updated") message = "Project updated successfully.";
  if (success === "deleted") message = "Project deleted successfully.";

  return <Toast message={message} onDismiss={handleDismiss} />;
}
