## 项目上下文摘要（三端同步检查）

生成时间：2026-04-06 22:10:00 +08:00

### 1. 相似实现分析

- 实现1：`package.json`
  - 模式：通过 npm scripts 统一管理校验和部署命令
  - 可复用：`verify:public`、`deploy:server:status`
  - 需注意：优先复用现有脚本，不额外发明临时检查逻辑
- 实现2：`scripts/verify-public-endpoints.mjs`
  - 模式：集中验证 Vercel、GitHub Pages、自托管入口的公网可达性
  - 可复用：默认端点 URL、required/optional 判定
  - 需注意：默认仅把自托管域名作为 optional，IP 入口属于 required
- 实现3：`scripts/deploy-server-status.mjs`
  - 模式：通过 SSH 读取服务器部署目录中的 target/current SHA 和运行状态
  - 可复用：`LAST_STATUS`、`TARGET_SHA`、`CURRENT_SHA`、`service active`
  - 需注意：这是当前仓库里唯一能直接证明“已部署到某个 commit”的脚本

### 2. 项目约定

- 命名约定：npm script 采用 `动词:目标` 风格，例如 `verify:public`
- 文件组织：部署与校验逻辑集中在 `scripts/`，Pages 工作流位于 `.github/workflows/`
- 代码风格：验证优先复用仓库现有脚本和 Git 命令，不新增脚本

### 3. 可复用组件清单

- `scripts/verify-public-endpoints.mjs`：公开端点探活
- `scripts/deploy-server-status.mjs`：自托管部署状态读取
- `.github/workflows/pages.yml`：GitHub Pages 发布链路定义

### 4. 测试与验证策略

- Git 同步：`git status --short --branch`、`git rev-parse`、`git ls-remote`
- 公开端点：`npm run verify:public`
- 自托管部署：`npm run deploy:server:status`

### 5. 依赖和集成点

- 外部依赖：GitHub 远端仓库、自托管 Git 远端、自托管 SSH、Vercel、GitHub Pages
- 内部依赖：`package.json` 中现有脚本、`README.md` 中部署说明

### 6. 技术选型理由

- 优先使用仓库现有脚本，因为其已经编码了三端定义和判定标准
- 直接比较 SHA，比只看“页面能打开”更能证明 Git 推送成功

### 7. 关键风险点

- Vercel 与 GitHub Pages 当前页面内容未显式暴露 commit SHA，无法像自托管服务器一样做提交级硬校验
- 自托管域名 `https://www.byted.online` 仍为 optional，当前抓取失败不影响 required 校验通过
