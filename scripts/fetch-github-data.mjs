import fs from 'fs';
import path from 'path';
import https from 'https';

// Configuration
const GITHUB_USERNAME = 'icefunicu'; // Replace with actual username from config if needed, but hardcoding for script is easier or read from env
const OUTPUT_FILE = path.join(import.meta.dirname, '../src/data/github-telemetry.json');
const SPECIFIC_REPOS = ['My-Resume', 'portfolio']; // repos to track specifically

async function fetchGitHubData() {
    console.log('Fetching GitHub data...');

    try {
        // 1. Fetch User Data
        const user = await fetchJson(`https://api.github.com/users/${GITHUB_USERNAME}`);

        // 2. Fetch Repos Data to count stars (this might need pagination for many repos, but for simple portfolio simple fetch is ok)
        // GitHub API defaults to 30 per page. 
        const repos = await fetchJson(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);

        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        // 3. Get specific repos details
        const specificReposData = repos
            .filter(repo => SPECIFIC_REPOS.includes(repo.name))
            .map(repo => ({
                name: repo.name,
                stars: repo.stargazers_count,
                url: repo.html_url
            }));

        const payload = {
            followers: user.followers,
            public_repos: user.public_repos,
            totalStars: totalStars,
            specificRepos: specificReposData,
            source: 'github-api', // It is from API at build time
            isPartial: false,
            message: `数据更新于 ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} (构建快照)`
        };

        // Ensure directory exists
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2));
        console.log(`GitHub data written to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Error fetching GitHub data:', error.message);
        // Write fallback data so build doesn't fail
        const fallback = {
            followers: null,
            public_repos: null,
            totalStars: null,
            specificRepos: [],
            source: 'fallback',
            isPartial: true,
            message: '构建时数据获取失败，使用本地降级数据。'
        };

        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fallback, null, 2));
    }
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Node.js Build Script',
                // 'Authorization': `token ${process.env.GITHUB_TOKEN}` // Optional: load from env if available to increase rate limit
            }
        };

        if (process.env.GITHUB_TOKEN) {
            options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        https.get(url, options, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                reject(new Error(`Request failed with status code ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (e) => reject(e));
    });
}

fetchGitHubData();
