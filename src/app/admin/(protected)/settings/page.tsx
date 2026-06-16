import type { Metadata } from "next";
import { Globe2 } from "lucide-react";

import { updateSiteSettingsAction } from "@/app/admin/(protected)/settings/actions";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Site Content | Admin | Generic Portfolio",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
            Editable public content
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Site content
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Update the generic hero, about, skills, and contact content shown
            on the public portfolio.
          </p>
        </div>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <Globe2 aria-hidden="true" size={22} />
        </div>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <SiteSettingsForm
            action={updateSiteSettingsAction}
            settings={settings}
          />
        </CardContent>
      </Card>
    </div>
  );
}
