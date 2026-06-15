import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button size="sm" type="submit" variant="secondary">
        <LogOut aria-hidden="true" size={16} />
        Logout
      </Button>
    </form>
  );
}
