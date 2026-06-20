import "server-only";

const GITHUB_API_BASE_URL = "https://api.github.com";
const MAX_TEXT_FILE_LENGTH = 12000;

export type GithubRepoContext = {
  defaultBranch: string;
  description: string | null;
  fullName: string;
  homepage: string | null;
  htmlUrl: string;
  languages: string[];
  license: string | null;
  manifests: Array<{
    content: string;
    path: string;
  }>;
  name: string;
  owner: string;
  readme: string | null;
  topics: string[];
};

type GithubRepoApiResponse = {
  default_branch?: unknown;
  description?: unknown;
  full_name?: unknown;
  homepage?: unknown;
  html_url?: unknown;
  license?: {
    name?: unknown;
  } | null;
  name?: unknown;
  owner?: {
    login?: unknown;
  };
  topics?: unknown;
};

export class GithubRepoError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "GITHUB_FETCH_FAILED"
      | "GITHUB_INVALID_REPO"
      | "GITHUB_REPO_NOT_FOUND",
  ) {
    super(message);
    this.name = "GithubRepoError";
  }
}

function getGithubHeaders(accept = "application/vnd.github+json") {
  const token = process.env.GITHUB_TOKEN?.trim();

  return {
    Accept: accept,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "User-Agent": "portfolio-ai-importer",
  };
}

export function parseGithubRepoUrl(repoUrl: string) {
  const trimmed = repoUrl.trim();
  const shorthandMatch = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
  const sshMatch = trimmed.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/);

  if (shorthandMatch) {
    return {
      owner: shorthandMatch[1],
      repo: shorthandMatch[2].replace(/\.git$/, ""),
    };
  }

  if (sshMatch) {
    return {
      owner: sshMatch[1],
      repo: sshMatch[2].replace(/\.git$/, ""),
    };
  }

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    throw new GithubRepoError(
      "Enter a valid GitHub repository URL.",
      "GITHUB_INVALID_REPO",
    );
  }

  if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
    throw new GithubRepoError(
      "Only github.com repository URLs are supported right now.",
      "GITHUB_INVALID_REPO",
    );
  }

  const [owner, repo] = url.pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.trim());

  if (!owner || !repo) {
    throw new GithubRepoError(
      "Use a GitHub repository URL like https://github.com/owner/repo.",
      "GITHUB_INVALID_REPO",
    );
  }

  return {
    owner,
    repo: repo.replace(/\.git$/, ""),
  };
}

async function fetchGithubJson<T>(path: string) {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: getGithubHeaders(),
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    throw new GithubRepoError(
      "The GitHub repository could not be found or is not accessible.",
      "GITHUB_REPO_NOT_FOUND",
    );
  }

  if (!response.ok) {
    throw new GithubRepoError(
      `GitHub request failed with status ${response.status}.`,
      "GITHUB_FETCH_FAILED",
    );
  }

  return (await response.json()) as T;
}

async function fetchGithubRaw(path: string) {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: getGithubHeaders("application/vnd.github.raw"),
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const text = await response.text();
  return text.slice(0, MAX_TEXT_FILE_LENGTH);
}

function cleanHomepage(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function ensureRepoData(
  owner: string,
  repo: string,
  data: GithubRepoApiResponse,
) {
  return {
    defaultBranch:
      typeof data.default_branch === "string" ? data.default_branch : "main",
    description:
      typeof data.description === "string" && data.description.trim()
        ? data.description.trim()
        : null,
    fullName:
      typeof data.full_name === "string" ? data.full_name : `${owner}/${repo}`,
    homepage: cleanHomepage(data.homepage),
    htmlUrl:
      typeof data.html_url === "string"
        ? data.html_url
        : `https://github.com/${owner}/${repo}`,
    license:
      typeof data.license?.name === "string" ? data.license.name : null,
    name: typeof data.name === "string" ? data.name : repo,
    owner: typeof data.owner?.login === "string" ? data.owner.login : owner,
    topics: Array.isArray(data.topics)
      ? data.topics.filter((topic): topic is string => typeof topic === "string")
      : [],
  };
}

export async function getGithubRepoContext(repoUrl: string) {
  const { owner, repo } = parseGithubRepoUrl(repoUrl);
  const repoData = await fetchGithubJson<GithubRepoApiResponse>(
    `/repos/${owner}/${repo}`,
  );
  const normalizedRepo = ensureRepoData(owner, repo, repoData);

  const [languagesResponse, readme, packageJson, pyproject, cargoToml] =
    await Promise.all([
      fetchGithubJson<Record<string, number>>(`/repos/${owner}/${repo}/languages`)
        .then((languages) => Object.keys(languages))
        .catch(() => []),
      fetchGithubRaw(`/repos/${owner}/${repo}/readme`),
      fetchGithubRaw(`/repos/${owner}/${repo}/contents/package.json`),
      fetchGithubRaw(`/repos/${owner}/${repo}/contents/pyproject.toml`),
      fetchGithubRaw(`/repos/${owner}/${repo}/contents/Cargo.toml`),
    ]);

  const manifests = [
    { content: packageJson, path: "package.json" },
    { content: pyproject, path: "pyproject.toml" },
    { content: cargoToml, path: "Cargo.toml" },
  ].filter(
    (manifest): manifest is { content: string; path: string } =>
      typeof manifest.content === "string" && manifest.content.length > 0,
  );

  return {
    ...normalizedRepo,
    languages: languagesResponse,
    manifests,
    readme,
  } satisfies GithubRepoContext;
}
