# 国内站域名迁移记录

## 目标

- 将自托管大陆站 canonical 域名从 `www.byted.online` 切换为 `blog.byted.online`。
- 保留旧 `www` 与服务器 IP 入口的跳转兼容。

## 已实施

- 更新站点默认 URL、联系入口、SEO/JSON-LD、部署脚本、公开端点校验、链接测试和部署文档。
- 更新服务器自动部署钩子与 systemd 环境，使 `NEXT_PUBLIC_SITE_URL=https://blog.byted.online`。
- 发布当前工作区到 `/var/www/portfolio/current`，服务 `portfolio.service` active。
- 更新 Nginx canonical 配置并签发 `blog.byted.online` 证书；证书同时包含 `www.byted.online`，旧 HTTPS 入口 301 到新域名。

## 验证

- `npm run lint`
- `npm run test:unit`：26/26 通过
- `npm run test:e2e`：42 通过，2 个既有跳过项
- `npm run build`：通过（部署时执行）
- `npm run build:pages`：通过
- `npm run check:links`：通过
- `npm run check:performance`：通过
- `SERVER_PUBLIC_URL=https://blog.byted.online VERIFY_SERVER_PUBLIC_URL=true npm run verify:public`：Vercel、Pages、自托管 IP、新域名均通过
- `https://blog.byted.online`：证书校验通过，HTTP 200
- `https://www.byted.online` 与 `http://106.12.154.163`：301 到新域名

## 已知限制

- 已停用 `/etc/nginx/sites-enabled/zhanggui-ip` 重复 IP 站点链接，保留 `/etc/nginx/sites-available/zhanggui-ip` 作为回滚备份。
- 作品集 HTTPS 监听已统一为 `ssl`，Nginx `nginx -t` 不再输出冲突或协议参数 warning。
- 当前部署使用本地工作区直接发布，服务器 release 名包含 `dirty`；仓库改动仍留在本地工作区，尚未提交或推送。
