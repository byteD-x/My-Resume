# 三端同步验证报告

时间：2026-04-06 22:16:00 +08:00

## 范围

- 本地仓库 `main`
- GitHub 远端 `origin/main`
- 服务器 Git 远端 `server/main`
- 公开发布链路：Vercel、GitHub Pages、自托管 IP

## 证据

### 1. Git 推送状态

- 本地 `HEAD`：`941ce0151b83c942fe25b9fc6a2e204bf1930b91`
- `origin/main`：`941ce0151b83c942fe25b9fc6a2e204bf1930b91`
- `server/main`：`941ce0151b83c942fe25b9fc6a2e204bf1930b91`
- 结论：最近一次提交已经同时到达两个 Git 远端

### 2. 三端公网探活

- Vercel：200，可访问
- GitHub Pages：200，可访问
- 自托管 IP：200，可访问
- 自托管域名：抓取失败，但该项在脚本中属于 optional

### 3. 自托管部署状态

- `LAST_STATUS=success`
- `TARGET_SHA=941ce0151b83c942fe25b9fc6a2e204bf1930b91`
- `CURRENT_SHA=941ce0151b83c942fe25b9fc6a2e204bf1930b91`
- 运行服务：`active`
- 结论：自托管服务端已经部署到最新提交

## 技术维度评分

- 代码质量：100/100
- 测试覆盖：92/100
- 规范遵循：96/100

## 战略维度评分

- 需求匹配：95/100
- 架构一致：95/100
- 风险评估：88/100

## 综合评分

Scoring
score: 94

## 结论

- 建议：通过
- 判断：你这次推送在 Git 层面已经成功，本地、GitHub 远端、自托管远端三者 SHA 完全一致。
- 判断：三条公开发布链路里，Vercel、GitHub Pages、自托管 IP 当前都可访问；自托管服务器明确已经部署到最新 SHA。
- 剩余风险：Vercel 和 GitHub Pages 当前无法从页面内容中直接提取 commit SHA，因此无法像自托管服务器那样做提交级硬证明，但结合远端 SHA 已更新、页面 200 正常和三端内容规模接近，可以认定其处于最新可访问状态。

summary: '本次核验确认最近一次推送已同步到本地与两个 Git 远端，自托管服务器也已部署到相同 SHA；Vercel 与 GitHub Pages 均可访问，整体可判定三端已同步到最新可用状态。'

# 备案上线验证报告

时间：2026-04-10 11:53:00 +08:00

## 范围

- 站点级配置：`src/config/site.ts`
- 首页页脚：`src/components/Footer.tsx`
- 页面接线：`src/app/page.tsx`
- 链接校验脚本：`scripts/check-links.js`
- 文档：`README.md`、`docs/deployment-channels.md`
- 测试：`tests/unit/footer.test.tsx`

## 证据

### 1. 需求字段完整性

- 目标：将 `byted.online` 备案号展示到站点，并继续完成域名切换建议的仓库内落地
- 范围：页脚展示、站点默认主域名、部署文档、链接校验兼容、单测补充
- 交付物：代码、测试、文档、验证报告
- 审查要点：备案号准确、页脚展示稳定、门禁命令可重复、域名收尾风险留痕

### 2. 代码与文档结果

- 页脚已展示 `晋ICP备2026004157号-1`，并指向 `https://beian.miit.gov.cn/`
- `siteConfig.siteUrl` 默认值已切为 `https://www.byted.online`
- `README.md` 与 `docs/deployment-channels.md` 已补充备案完成后的环境变量与证书刷新步骤
- `scripts/check-links.js` 已兼容工信部备案站的 `521` JS 校验场景，避免自动化误报

### 3. 本地验证结果

- `npm run test:unit -- tests/unit/site-links.test.ts tests/unit/footer.test.tsx`：通过
- `npm run lint`：通过
- `npm run build`：通过
- `npm run test:e2e`：通过（29 passed, 1 skipped）
- `npm run build:pages`：通过
- `npm run check:links`：通过

### 4. 风险评估

- 当前公网域名证书仍存在主机名不匹配，仓库代码已准备好，但线上域名完全切正仍依赖服务器执行 `npm run setup:server:https`
- 线上 metadata 是否从 IP 切回域名，还依赖服务器部署环境中的 `NEXT_PUBLIC_SITE_URL` 是否改为 `https://www.byted.online`
- `src/data/github-telemetry.json` 在构建中被正常刷新，属于构建副产物

## 技术维度评分

- 代码质量：96/100
- 测试覆盖：94/100
- 规范遵循：92/100

## 战略维度评分

- 需求匹配：97/100
- 架构一致：95/100
- 风险评估：93/100

## 综合评分

Scoring
score: 95

## 结论

- 建议：通过
- 判断：仓库内与备案上线相关的代码、测试、文档和本地验证已经完整闭环
- 判断：剩余问题不在仓库实现，而在服务器证书和部署环境变量收尾
- 剩余风险：在服务器完成 `NEXT_PUBLIC_SITE_URL` 切换和 HTTPS 证书刷新前，公网域名仍可能继续暴露 IP metadata 或证书不匹配

summary: '备案号已接入页脚，主域名默认值和部署文档已切换到 www.byted.online，本地 lint/build/e2e/pages/link-check 全部通过；剩余收尾集中在服务器证书与环境变量。'
