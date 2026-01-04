import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour

const GITHUB_USERNAME = 'icefunicu';
const REPO_NAMES = ['wechat-bot', 'easyCloudPan']; // Repos to check specifically

export async function GET() {
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
            console.error('GitHub API rate limited or error');
            return NextResponse.json({ error: 'GitHub API Error' }, { status: 500 });
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

    } catch (error) {
        console.error('GitHub API Exception:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
