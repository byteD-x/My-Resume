import { NextResponse } from 'next/server';

// 静态导出需要强制静态配置（API 路由在静态导出时会被忽略，但需要此配置避免构建错误）
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

const GITHUB_USERNAME = 'icefunicu';
const REPO_NAMES = ['wechat-bot', 'easyCloudPan']; // Repos to check specifically
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
const fallbackPayload = {
    followers: 0,
    public_repos: 0,
    totalStars: 0,
    specificRepos: [],
};

export async function GET() {
    if (isStaticExport) {
        return NextResponse.json(fallbackPayload);
    }

    try {
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-Resume-App',
        };

        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        // Parallel fetch for user repos to get total stars
        // And specific repos if needed details
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers, next: { revalidate: 3600 } }),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, { headers, next: { revalidate: 3600 } })
        ]);

        if (!userRes.ok || !reposRes.ok) {
            return NextResponse.json(fallbackPayload);
        }

        const user = await userRes.json();
        const repos = await reposRes.json();

        // Calculate total stars
        interface GitHubRepo {
            name: string;
            stargazers_count: number;
            html_url: string;
            updated_at: string;
        }

        const totalStars = Array.isArray(repos)
            ? repos.reduce((acc: number, repo: GitHubRepo) => acc + repo.stargazers_count, 0)
            : 0;

        // Get specific repo stats
        const specificRepos = Array.isArray(repos)
            ? repos.filter((r: GitHubRepo) => REPO_NAMES.includes(r.name)).map((r: GitHubRepo) => ({
                name: r.name,
                stars: r.stargazers_count,
                url: r.html_url,
                updated_at: r.updated_at
            }))
            : [];

        return NextResponse.json({
            followers: user.followers,
            public_repos: user.public_repos,
            totalStars,
            specificRepos
        });

    } catch {
        return NextResponse.json(fallbackPayload);
    }
}
