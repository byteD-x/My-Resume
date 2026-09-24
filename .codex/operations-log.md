## 操作日志

### 编码前检查 - 三端同步检查

时间：2026-04-06 22:12:00 +08:00

- 已查阅上下文摘要文件：`.codex/context-summary-三端同步检查.md`
- 将复用以下既有组件：
  - `package.json`：读取现有校验脚本
  - `scripts/verify-public-endpoints.mjs`：执行三端公网探活
  - `scripts/deploy-server-status.mjs`：读取服务器部署 SHA 与服务状态
- 将遵循命名约定：沿用仓库既有脚本名和 Git 分支名，不新增术语
- 将遵循代码风格：只做只读核验，不新增业务代码
- 确认不重复造轮子：已检查 `scripts/` 和 `package.json`，现有脚本已覆盖本次需求

### 执行记录

时间：2026-04-06 22:13:00 +08:00

1. 读取 `package.json`、`next.config.ts`、`.github/workflows/pages.yml`、`README.md`
   - 结论：仓库当前存在两类同步对象
   - Git 远端：`origin`、`server`
   - 公开三端：Vercel、GitHub Pages、自托管入口

2. 核对 Git 同步状态
   - `git status --short --branch` 返回 `## main...origin/main`
   - `git branch -vv` 显示 `main` 跟踪 `origin/main`
   - `git log --oneline --decorate -5` 显示本地 `HEAD` 为 `941ce01`
   - `git ls-remote origin refs/heads/main` = `941ce0151b83c942fe25b9fc6a2e204bf1930b91`
   - `git ls-remote server refs/heads/main` = `941ce0151b83c942fe25b9fc6a2e204bf1930b91`
   - `git rev-parse HEAD / origin/main / server/main` 三者一致

3. 核对公开端点可达性
   - 执行 `npm run verify:public`
   - required 通过：`https://my-resume-gray-five.vercel.app`
   - required 通过：`https://byted-x.github.io/My-Resume`
   - required 通过：`https://106.12.154.163`
   - optional 失败：`https://www.byted.online`

4. 核对自托管部署状态
   - 执行 `npm run deploy:server:status`
   - `LAST_STATUS=success`
   - `TARGET_SHA=941ce0151b83c942fe25b9fc6a2e204bf1930b91`
   - `CURRENT_SHA=941ce0151b83c942fe25b9fc6a2e204bf1930b91`
   - `RELEASE_ID=20260406134022-941ce0151b83`
   - 运行服务状态：`active`

### 编码后声明 - 三端同步检查

时间：2026-04-06 22:15:00 +08:00

### 1. 复用了以下既有组件

- `scripts/verify-public-endpoints.mjs`：用于三端公网探活
- `scripts/deploy-server-status.mjs`：用于自托管部署 SHA 校验

### 2. 遵循了以下项目约定

- 命名约定：直接沿用现有脚本与远端命名
- 代码风格：保持只读核验，无业务代码改动
- 文件组织：所有工作记录写入项目本地 `.codex/`

### 3. 对比了以下相似实现

- `package.json`：沿用现有 `verify:public` 与 `deploy:server:status`
- `scripts/verify-public-endpoints.mjs`：沿用仓库既有三端定义
- `scripts/deploy-server-status.mjs`：沿用服务器部署结果判据

### 4. 未重复造轮子的证明

- 已检查 `package.json`、`scripts/verify-public-endpoints.mjs`、`scripts/deploy-server-status.mjs`
- 本次没有新增任何检查脚本，完全复用现有实现

### 编码前检查 - 备案上线

时间：2026-04-10 11:36:00 +08:00

- 已查阅上下文摘要文件：`.codex/context-summary-备案上线.md`
- 工具可用性说明：
  - `sequential-thinking`、`shrimp-task-manager`、`desktop-commander`、`context7`、`github.search_code` 当前会话不可用
  - 替代方案：使用仓库本地代码检索、现有文档、已有脚本与本地验证命令完成等价分析，并在日志留痕
- 将复用以下既有组件：
  - `src/components/Footer.tsx`：页脚布局与底部信息区
  - `src/config/site.ts`：站点级配置
  - `src/app/page.tsx`：页面层 props 注入
  - `tests/unit/site-links.test.ts`：现有站点域名单测模式
- 将遵循命名约定：站点常量进入 `siteConfig`，页面展示通过 props 透传
- 将遵循代码风格：小步修改、保持函数组件写法、避免引入不必要状态
- 确认不重复造轮子：已检查 `src/components/Footer.tsx`、`src/components/Contact.tsx`、`src/components/Navbar.tsx`、`src/config/site.ts`，仓库内不存在现成备案展示实现

### 执行记录 - 备案上线

时间：2026-04-10 11:50:00 +08:00

1. 完成上下文检索与模式提取
   - 分析 `src/components/Footer.tsx`、`src/components/Contact.tsx`、`src/components/Navbar.tsx`
   - 分析 `src/config/site.ts`、`src/app/page.tsx`
   - 分析 `tests/unit/site-links.test.ts`、`tests/unit/utils.test.ts`、`tests/unit/verification.test.ts`

2. 完成代码实现
   - 在 `src/config/site.ts` 增加 `icpRecord`、`icpRecordUrl`
   - 将默认站点地址从 Vercel 切到 `https://www.byted.online`
   - 在 `src/app/page.tsx` 向 `Footer` 注入备案配置
   - 在 `src/components/Footer.tsx` 底部版权区展示 `晋ICP备2026004157号-1` 并链接到工信部备案站

3. 完成验证补强
   - 新增 `tests/unit/footer.test.tsx`，校验备案号文本和工信部链接渲染
   - 发现 `npm run check:links` 对 `https://beian.miit.gov.cn/` 返回 `521`
   - 在 `scripts/check-links.js` 增加 `LINK_CHECK_DEGRADED_HOSTS` 机制，默认将 `beian.miit.gov.cn` 作为“自动化受限但允许降级通过”的主机处理

4. 完成文档同步
   - 更新 `docs/deployment-channels.md`，补充 2026-04 域名切换检查清单
   - 更新 `README.md` 中的主域名与 CI 变量说明

5. 完成本地验证
   - `npm run test:unit -- tests/unit/site-links.test.ts tests/unit/footer.test.tsx`：通过
   - `npm run lint`：通过
   - `npm run build`：通过
   - `npm run test:e2e`：通过（29 passed, 1 skipped）
   - `npm run build:pages`：通过
   - `npm run check:links`：通过

6. 线上现状留痕
   - `curl -k -I https://www.byted.online` 返回 `200 OK`
   - `curl -I https://www.byted.online` 当前仍报证书主机名不匹配
   - 结论：备案已完成，公网域名已通，但服务端证书与构建环境变量仍需服务器侧收尾

### 编码后声明 - 备案上线

时间：2026-04-10 11:52:00 +08:00

### 1. 复用了以下既有组件

- `src/components/Footer.tsx`：复用既有页脚结构，在底部信息区挂载备案信息
- `src/config/site.ts`：复用站点级配置入口，避免把备案号散落在页面数据中
- `src/app/page.tsx`：沿用页面层 props 注入方式，不改动 `Footer` 的调用层级
- `tests/unit/site-links.test.ts`：沿用既有站点信息测试方式补充页脚用例

### 2. 遵循了以下项目约定

- 命名约定：站点固定信息放在 `siteConfig`
- 代码风格：只做必要 props 扩展与小范围文档更新
- 文件组织：实现改动在 `src/`，验证与记录落在 `tests/` 和 `.codex/`

### 3. 对比了以下相似实现

- `src/components/Contact.tsx`：继续让联系区只负责公开入口，不承载监管文案
- `src/components/Navbar.tsx`：保持站点级文案与 CTA 的轻量 props 传递模式
- `src/components/Footer.tsx`：沿用页脚底部版权区承载固定站点信息的结构

### 4. 未重复造轮子的证明

- 已检查 `src/components/Footer.tsx`、`src/components/Contact.tsx`、`src/components/Navbar.tsx`、`src/config/site.ts`
- 仓库中不存在现成备案展示或 MIIT 链接封装，本次在现有页脚结构上最小化扩展
