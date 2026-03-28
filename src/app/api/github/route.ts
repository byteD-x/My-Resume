import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 300;

const GITHUB_USERNAME = "byteD-x";
const REPO_NAMES = ["wechat-bot", "easyCloudPan"] as const;
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const REQUEST_TIMEOUT_MS = 5_000;
const API_FETCH_REVALIDATE_SECONDS = 3600;
const FALLBACK_FETCH_REVALIDATE_SECONDS = 300;
const SUCCESS_CACHE_CONTROL =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const DEGRADED_CACHE_CONTROL =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=600";

type TelemetrySource = "github-api" | "github-web" | "fallback";

interface GitHubRepoStat {
  name: string;
  stars: number;
  url: string;
  updated_at?: string;
}

interface TelemetryPayload {
  followers: number | null;
  public_repos: number | null;
  totalStars: number | null;
  specificRepos: GitHubRepoStat[];
  source: TelemetrySource;
  isPartial: boolean;
  message: string;
}

interface GitHubUserResponse {
  followers: number;
  public_repos: number;
}

interface GitHubRepoResponse {
  name: string;
  stargazers_count: number;
  html_url: string;
  updated_at: string;
}

const fallbackPayload: TelemetryPayload = {
  followers: null,
  public_repos: null,
  totalStars: null,
  specificRepos: [],
  source: "fallback",
  isPartial: true,
  message: "GitHub 数据暂不可用。",
};

const githubApiHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Portfolio-Resume-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
};

const githubWebHeaders: HeadersInit = {
  Accept: "text/html,application/xhtml+xml",
  "User-Agent": "Mozilla/5.0 (compatible; Portfolio-Resume-App/1.0)",
};

const fetchWithTimeout = async (
  url: string,
  init: RequestInit,
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

const parseHumanNumber = (value: string): number | null => {
  const normalized = value.replace(/,/g, "").trim().toLowerCase();
  const match = normalized.match(/^(\d+(?:\.\d+)?)([km])?$/);
  if (!match) return null;

  const numeric = Number.parseFloat(match[1]);
  if (Number.isNaN(numeric)) return null;

  if (match[2] === "k") return Math.round(numeric * 1_000);
  if (match[2] === "m") return Math.round(numeric * 1_000_000);
  return Math.round(numeric);
};

const extractNumberFromAnchor = (
  html: string,
  hrefPattern: string,
): number | null => {
  const pattern = new RegExp(
    `<a[^>]*href=["'][^"']*${hrefPattern}[^"']*["'][^>]*>([\\s\\S]*?)<\\/a>`,
    "i",
  );
  const match = html.match(pattern);
  if (!match) return null;

  const plainText = match[1]
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const numberToken = plainText.match(/(\d+(?:\.\d+)?[kKmM]|\d[\d,.]*)/);
  if (!numberToken) return null;

  return parseHumanNumber(numberToken[1]);
};

const fetchText = async (url: string): Promise<string | null> => {
  try {
    const response = await fetchWithTimeout(url, {
      headers: githubWebHeaders,
      next: { revalidate: FALLBACK_FETCH_REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;
    return response.text();
  } catch {
    return null;
  }
};

const jsonWithCache = (
  payload: TelemetryPayload,
  options?: { degraded?: boolean },
) =>
  NextResponse.json(payload, {
    headers: {
      "Cache-Control": options?.degraded
        ? DEGRADED_CACHE_CONTROL
        : SUCCESS_CACHE_CONTROL,
    },
  });

const fetchRepoStatsFromWeb = async (): Promise<GitHubRepoStat[]> => {
  const stats = await Promise.all(
    REPO_NAMES.map(async (repoName) => {
      const url = `https://github.com/${GITHUB_USERNAME}/${repoName}`;
      const html = await fetchText(url);
      if (!html) return null;

      const stars =
        extractNumberFromAnchor(
          html,
          `/${GITHUB_USERNAME}/${repoName}/stargazers`,
        ) ?? 0;

      return {
        name: repoName,
        stars,
        url,
      } satisfies GitHubRepoStat;
    }),
  );

  return stats.reduce<GitHubRepoStat[]>((acc, item) => {
    if (item) acc.push(item);
    return acc;
  }, []);
};

const fetchUserStatsFromWeb = async (): Promise<Pick<
  TelemetryPayload,
  "followers" | "public_repos"
> | null> => {
  const html = await fetchText(`https://github.com/${GITHUB_USERNAME}`);
  if (!html) return null;

  const followers = extractNumberFromAnchor(
    html,
    `/${GITHUB_USERNAME}\\?tab=followers`,
  );
  const publicRepos = extractNumberFromAnchor(
    html,
    `/${GITHUB_USERNAME}\\?tab=repositories`,
  );

  if (followers === null && publicRepos === null) return null;

  return {
    followers,
    public_repos: publicRepos,
  };
};

export async function GET() {
  if (isStaticExport) {
    return jsonWithCache(
      {
        ...fallbackPayload,
        message: "静态导出模式不包含实时 GitHub 数据。",
      },
      { degraded: true },
    );
  }

  try {
    let fallbackPromise: Promise<
      [Awaited<ReturnType<typeof fetchUserStatsFromWeb>>, GitHubRepoStat[]]
    > | null = null;

    const ensureFallbackPromise = () => {
      if (!fallbackPromise) {
        fallbackPromise = Promise.all([
          fetchUserStatsFromWeb(),
          fetchRepoStatsFromWeb(),
        ]);
      }
      return fallbackPromise;
    };

    const userResPromise = fetchWithTimeout(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      {
        headers: githubApiHeaders(),
        next: { revalidate: API_FETCH_REVALIDATE_SECONDS },
      },
    )
      .then((response) => {
        if (!response.ok) {
          void ensureFallbackPromise();
        }
        return response;
      })
      .catch((error) => {
        void ensureFallbackPromise();
        throw error;
      });

    const reposResPromise = fetchWithTimeout(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
      {
        headers: githubApiHeaders(),
        next: { revalidate: API_FETCH_REVALIDATE_SECONDS },
      },
    )
      .then((response) => {
        if (!response.ok) {
          void ensureFallbackPromise();
        }
        return response;
      })
      .catch((error) => {
        void ensureFallbackPromise();
        throw error;
      });

    const [userResult, reposResult] = await Promise.allSettled([
      userResPromise,
      reposResPromise,
    ]);

    const userRes = userResult.status === "fulfilled" ? userResult.value : null;
    const reposRes =
      reposResult.status === "fulfilled" ? reposResult.value : null;

    if (userRes?.ok && reposRes?.ok) {
      const [user, repos] = (await Promise.all([
        userRes.json(),
        reposRes.json(),
      ])) as [GitHubUserResponse, GitHubRepoResponse[]];

      const totalStars = Array.isArray(repos)
        ? repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)
        : 0;

      const specificRepos = REPO_NAMES.reduce<GitHubRepoStat[]>(
        (acc, repoName) => {
          const matched = repos.find((repo) => repo.name === repoName);
          if (!matched) return acc;

          acc.push({
            name: matched.name,
            stars: matched.stargazers_count || 0,
            url: matched.html_url,
            updated_at: matched.updated_at,
          });
          return acc;
        },
        [],
      );

      return jsonWithCache({
        followers: user.followers ?? null,
        public_repos: user.public_repos ?? null,
        totalStars,
        specificRepos,
        source: "github-api",
        isPartial: false,
        message: "已通过 GitHub 接口获取实时数据。",
      } satisfies TelemetryPayload);
    }

    const [userFromWeb, repoFromWeb] = await (
      fallbackPromise ?? ensureFallbackPromise()
    );

    const repoStarSum =
      repoFromWeb.length > 0
        ? repoFromWeb.reduce((acc, repo) => acc + repo.stars, 0)
        : null;

    if (userFromWeb || repoFromWeb.length > 0) {
      return jsonWithCache(
        {
          followers: userFromWeb?.followers ?? null,
          public_repos: userFromWeb?.public_repos ?? null,
          totalStars: repoStarSum,
          specificRepos: repoFromWeb,
          source: "github-web",
          isPartial: true,
          message:
            "GitHub 接口不可用或被限流，已自动降级为 GitHub 公开页面数据。",
        } satisfies TelemetryPayload,
        { degraded: true },
      );
    }

    const userStatus = userRes ? String(userRes.status) : "error";
    const reposStatus = reposRes ? String(reposRes.status) : "error";

    return jsonWithCache(
      {
        ...fallbackPayload,
        message: `GitHub 接口请求失败：user=${userStatus}, repos=${reposStatus}。`,
      },
      { degraded: true },
    );
  } catch {
    return jsonWithCache(fallbackPayload, { degraded: true });
  }
}
