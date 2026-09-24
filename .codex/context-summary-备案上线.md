## 项目上下文摘要（备案上线）

生成时间：2026-04-10 11:35:00 +08:00

### 1. 相似实现分析

- 实现1：`src/components/Footer.tsx`
  - 模式：页脚信息通过 `FooterProps` 从页面层注入，底部版权区承载站点级固定信息
  - 可复用：底部信息分组、公开链接展示、统一文本样式
  - 需注意：不要破坏现有双栏布局与移动端换行节奏
- 实现2：`src/components/Contact.tsx`
  - 模式：站点公开入口来自 `src/data.ts` 的 `contact.websiteLinks`
  - 可复用：对外链接标签、URL 文本展示规则、外链 `noopener noreferrer`
  - 需注意：联系区负责公开站点入口，不适合承载监管信息
- 实现3：`src/config/site.ts` + `src/app/layout.tsx`
  - 模式：站点级元信息集中在 `siteConfig`，由 `layout.tsx` 注入 metadata / JSON-LD
  - 可复用：`NEXT_PUBLIC_SITE_URL` 优先、默认域名兜底
  - 需注意：Pages 导出与自托管部署都会覆盖 `NEXT_PUBLIC_SITE_URL`，默认值必须保持主站语义

### 2. 项目约定

- 命名约定：站点级常量集中在 `src/config/site.ts`，页面展示通过 props 传递
- 文件组织：页面内容数据放在 `src/data.ts`，基础配置放在 `src/config/`
- 导入顺序：先第三方依赖，再本地依赖；同类导入保持相邻
- 代码风格：TypeScript + 函数组件，优先小而明确的 props 扩展，不引入额外状态

### 3. 可复用组件清单

- `src/components/Footer.tsx`：页脚固定信息与外链展示
- `src/config/site.ts`：站点 URL 与站点级文案配置
- `scripts/setup-server-ci.mjs`：服务端部署时注入 `NEXT_PUBLIC_SITE_URL`
- `scripts/setup-server-https.mjs`：域名证书签发与 Nginx HTTPS 切换

### 4. 测试策略

- 测试框架：Vitest（`jsdom`）
- 参考文件：
  - `tests/unit/site-links.test.ts`
  - `tests/unit/verification.test.ts`
  - `tests/unit/utils.test.ts`
- 本次测试策略：
  - 保留既有自托管域名单测
  - 新增页脚渲染测试，验证备案号文本和 MIIT 链接存在
  - 执行 lint / build / e2e / pages build / link check 全量门禁

### 5. 依赖和集成点

- 外部依赖：
  - `https://www.byted.online`
  - `https://beian.miit.gov.cn/`
- 内部依赖：
  - `src/app/page.tsx` 负责将站点配置传给 `Footer`
  - `README.md` 与 `docs/deployment-channels.md` 承担部署说明
- 配置来源：
  - `NEXT_PUBLIC_SITE_URL`
  - `SERVER_PUBLIC_URL`
  - `VERIFY_SERVER_PUBLIC_URL`

### 6. 技术选型理由

- 备案号属于站点级固定信息，应放在 `siteConfig`，避免散落在页面数据中
- 备案展示放在页脚底部更符合现有布局和国内站点习惯
- 默认站点 URL 切到 `https://www.byted.online`，可让未显式传入环境变量的构建优先指向主域名；Pages 仍由构建脚本显式注入 Pages URL

### 7. 关键风险点

- 当前公网域名证书仍存在主机名不匹配，若直接开启 `VERIFY_SERVER_PUBLIC_URL=true`，CI 可能失败
- 若服务器环境变量仍保留 IP，重新部署后 metadata 仍会继续输出 IP
- 备案号属于监管信息，必须严格使用用户提供的准确编号：`晋ICP备2026004157号-1`
