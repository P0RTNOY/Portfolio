import type { SafeRemotePdfResult } from "./safe-remote-pdf";

type CvDownloadDependencies = {
  fetchPdf: (url: string) => Promise<SafeRemotePdfResult>;
  loadResumeUrl: () => Promise<string | null>;
};

export async function createCvDownloadResponse({
  fetchPdf,
  loadResumeUrl,
}: CvDownloadDependencies) {
  const resumeUrl = await loadResumeUrl();

  if (!resumeUrl) {
    return new Response("CV is not available.", { status: 404 });
  }

  try {
    const { bytes } = await fetchPdf(resumeUrl);
    return new Response(bytes, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": 'attachment; filename="omer-portnoy-cv.pdf"',
        "Content-Length": bytes.byteLength.toString(),
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    return new Response("CV could not be downloaded right now.", {
      status: 502,
    });
  }
}
