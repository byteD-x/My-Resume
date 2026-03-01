export type TelemetrySource = "github-api" | "github-web" | "fallback";

export interface GitHubRepoStats {
  name: string;
  stars: number;
  url: string;
}

export interface GitHubTelemetryPayload {
  followers: number | null;
  public_repos: number | null;
  totalStars: number | null;
  specificRepos: GitHubRepoStats[];
  source?: TelemetrySource;
  isPartial?: boolean;
  message?: string;
}

export const fallbackGithubTelemetry: GitHubTelemetryPayload = {
  followers: null,
  public_repos: null,
  totalStars: null,
  specificRepos: [],
  source: "fallback",
  isPartial: true,
  message: "未获取到 GitHub 数据。",
};

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedPayload: GitHubTelemetryPayload | null = null;
let cachedAt = 0;
let inFlight: Promise<GitHubTelemetryPayload> | null = null;

const toNumberOrNull = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return value;
};

const toStringOrFallback = (value: unknown, fallback = ""): string => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  return fallback;
};

const normalizeTelemetry = (payload: unknown): GitHubTelemetryPayload => {
  if (!payload || typeof payload !== "object") {
    return fallbackGithubTelemetry;
  }

  const record = payload as Record<string, unknown>;
  const repos = Array.isArray(record.specificRepos)
    ? record.specificRepos
        .map((repo) => {
          if (!repo || typeof repo !== "object") return null;
          const item = repo as Record<string, unknown>;
          const name = toStringOrFallback(item.name);
          if (!name) return null;
          const stars = toNumberOrNull(item.stars) ?? 0;
          const url = toStringOrFallback(
            item.url,
            `https://github.com/${name}`,
          );
          return { name, stars, url } satisfies GitHubRepoStats;
        })
        .filter((repo): repo is GitHubRepoStats => repo !== null)
    : [];

  const source =
    record.source === "github-api" ||
    record.source === "github-web" ||
    record.source === "fallback"
      ? record.source
      : "fallback";

  return {
    followers: toNumberOrNull(record.followers),
    public_repos: toNumberOrNull(record.public_repos),
    totalStars: toNumberOrNull(record.totalStars),
    specificRepos: repos,
    source,
    isPartial: Boolean(record.isPartial),
    message: toStringOrFallback(
      record.message,
      fallbackGithubTelemetry.message,
    ),
  };
};

const requestGithubTelemetry = async (): Promise<GitHubTelemetryPayload> => {
  const response = await fetch("/api/github", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`status=${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  return normalizeTelemetry(payload);
};

export async function getGithubTelemetry(options?: {
  force?: boolean;
}): Promise<GitHubTelemetryPayload> {
  const force = Boolean(options?.force);
  const now = Date.now();

  if (!force && cachedPayload && now - cachedAt < CACHE_TTL_MS) {
    return cachedPayload;
  }

  if (!force && inFlight) {
    return inFlight;
  }

  const request = (async () => {
    const payload = await requestGithubTelemetry();
    cachedPayload = payload;
    cachedAt = Date.now();
    return payload;
  })();

  inFlight = request;

  try {
    return await request;
  } catch (error) {
    if (!force && cachedPayload) {
      return cachedPayload;
    }
    throw error;
  } finally {
    if (inFlight === request) {
      inFlight = null;
    }
  }
}
