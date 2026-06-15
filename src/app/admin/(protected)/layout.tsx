import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return <AdminShell>{children}</AdminShell>;
}
