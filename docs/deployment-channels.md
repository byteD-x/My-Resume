# Deployment Channels

This project publishes through three separate channels:

1. `Vercel`
   - Trigger: Vercel Git integration on `main`
   - Purpose: public production site
   - Verify: `curl -I https://my-resume-gray-five.vercel.app`

2. `GitHub Pages`
   - Trigger: `.github/workflows/pages.yml`
   - Purpose: static export deployment
   - Verify: `curl -I https://byted-x.github.io/My-Resume/`

3. `Self-hosted server`
   - Trigger: `git push` to the SSH bare repo on `106.12.154.163`
   - Purpose: standalone Next.js service behind Nginx with direct IP HTTPS
   - Pipeline:
     - local git push writes to both GitHub and the server bare repo
     - server `post-receive` hook records the target SHA
     - `systemd-run` starts an asynchronous deployment job
     - the server builds `next build` locally with Node 22, rotates the release symlink, restarts `portfolio.service`, and health-checks `127.0.0.1:3000`
   - Verify:
     - `npm run deploy:server:status`
     - `ssh root@106.12.154.163 "systemctl status portfolio.service --no-pager"`
     - `curl -I https://106.12.154.163`

## Server Setup

Install or refresh the self-hosted CI channel:

```bash
npm run setup:server:ci
```

Enable or refresh direct-IP HTTPS:

```bash
npm run setup:server:https
```

The HTTPS bootstrap installs an isolated `certbot` runtime on the server and provisions a short-lived IP certificate for `106.12.154.163`.

After setup, plain `git push` to `origin` will push to both GitHub and the server because `origin` gets a second `pushurl`. The repository also keeps a dedicated `server` remote for direct troubleshooting.

Optional environment overrides for setup/status/deploy scripts:

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_PORT`
- `SERVER_GIT_DIR`
- `SERVER_APP_DIR`
- `SERVER_SERVICE_NAME`
- `SERVER_NODE_BIN`
- `SERVER_NPM_CLI`
- `SERVER_BIND_HOST`
- `SERVER_APP_PORT`
- `NEXT_PUBLIC_SITE_URL`
- `KEEP_RELEASES`
- `LOCAL_ORIGIN_REMOTE`
- `LOCAL_SERVER_REMOTE`
- `SKIP_BUILD=1` to reuse an existing local build artifact

## Common Commands

Push all release channels:

```bash
git push
```

Explicit push helper:

```bash
npm run push:all
```

Check self-hosted deployment status:

```bash
npm run deploy:server:status
```

## Rollback

The active release is always the `/var/www/portfolio/current` symlink.
To roll back, repoint it to an older release under `/var/www/portfolio/releases/` and restart `portfolio.service`.

## Notes

- The self-hosted channel is intentionally independent of GitHub Actions. GitHub only receives the same git push and continues triggering `Vercel` plus `Pages`.
- The server build runs with `/root/.local/share/mise/installs/node/22.22.1/bin/node`, not the system default `node`.
- Direct IP HTTPS uses Let's Encrypt short-lived IP certificates and therefore depends on automated renewal.
- `git push` across GitHub and the server is not atomic. If one remote succeeds and the other fails, resolve the failed side explicitly and push again.
