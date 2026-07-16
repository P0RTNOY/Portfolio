export function buildSeedSiteSettingsUpdate<
  T extends { resumeUrl: string | null },
>(settings: T): Omit<T, "resumeUrl"> | T {
  const { resumeUrl, ...update } = settings;
  return resumeUrl === null ? update : settings;
}
