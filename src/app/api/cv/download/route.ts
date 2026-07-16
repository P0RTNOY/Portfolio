import { createCvDownloadResponse } from "@/lib/cv-download";
import { fetchSafeRemotePdf } from "@/lib/safe-remote-pdf";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return createCvDownloadResponse({
    fetchPdf: fetchSafeRemotePdf,
    loadResumeUrl: async () => (await getSiteSettings()).resumeUrl,
  });
}
