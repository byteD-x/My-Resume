# Portfolio

基于 Next.js 16 构建的个人作品集网站，面向 AI 应用工程师 / RAG / Agent 方向，强调可验证的工程交付、项目证据沉淀、双语路径与招聘方快速浏览体验。

## 在线地址

- 国际站（Vercel）：[https://my-resume-gray-five.vercel.app](https://my-resume-gray-five.vercel.app)
- 中国大陆主站（自托管）：[https://blog.byted.online](https://blog.byted.online)
- 自托管回退地址：[http://106.12.154.163](http://106.12.154.163)

## 项目概览

- 站点主题：杜旭嘉的 AI 应用工程作品集
- 当前定位：AI 应用工程师（RAG / Agent）
- 核心方向：检索增强、智能体运行时、业务系统集成、可验证交付
- 首页结构：Hero 定位、经历分组、Impact 指标、精选项目、项目案例、工程实力中枢与联系入口
- 代表项目：
  - `独立开发者｜AI 应用 / 全栈项目`
  - `RentBox 共享擦窗宝小程序`
  - `论文检索任务平台`
  - `智能客服运行时`
  - `微信智能助手`
  - `RAG-QA System`
  - `SubMed 医学论文检索小程序`
  - `EasyCloudPan`
  - `九州通四向穿梭车路径规划系统`

## 技术栈

- 框架：Next.js 16、React 19、TypeScript 5
- 样式与交互：Tailwind CSS 4、Framer Motion
- 测试：Playwright、Vitest
- 工具链：ESLint、Prettier、Bundle Analyzer、next-image-export-optimizer
- 部署形态：
  - 服务端构建：`output: 'standalone'`
  - 静态导出：`output: 'export'`
  - 运行时能力：中英文路径、详情页与拦截路由、简历下载 API / 静态下载兼容、GitHub 遥测降级、CSP 与缓存响应头、GA4 可选统计

## 本地开发

建议与 CI 保持一致，优先使用 Node.js 22。

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

默认开发命令使用 `next dev`。如需和 webpack 做对照，可使用：

```bash
npm run dev:webpack
```

仅在排查 Turbopack 首次编译问题时，按需使用 tracing：

```bash
npm run dev:trace
```

## 外置盘高性能开发模式

如果仓库放在外置盘、移动硬盘或较慢磁盘上，推荐使用仓库内置的“外置盘友好模式”。它不会把 `distDir` 移出项目目录，而是通过项目内 `.next-dev-cache` 链接目录，把高频写入的开发缓存落到本地 SSD / Dev Drive，从而减少首次编译和热更新的 I/O 压力。

### 1. 初始化快速缓存目录

```bash
npm run setup:fast-dev-cache
```

默认会把 `.next-dev-cache` 指向：

```text
%LOCALAPPDATA%\portfolio-dev-cache\portfolio\next
```

如需自定义本地 SSD 路径：

```bash
node scripts/setup-fast-dev-cache.mjs D:\dev-cache\portfolio\.next-dev
```

### 2. 使用外置盘友好模式启动

```bash
npm run dev:external
```

可选命令：

- `npm run dev:external:webpack`
- `npm run dev:external:trace`

这个模式会同时做两件事：

- 把 Next 开发缓存写入 `.next-dev-cache`
- 启用更轻的开发视觉模式，降低开发期首屏绘制负担

### 3. 系统级建议

- 将仓库目录加入 Windows Defender 排除列表
- 将本地缓存目标目录也加入 Windows Defender 排除列表
- 不要常驻开启 tracing 或详细 fetch logging，只在单次排障时启用

更多背景说明见：[docs/local-dev-performance.md](docs/local-dev-performance.md)

## 常用脚本

```bash
# 开发
npm run dev
npm run dev:webpack
npm run dev:trace
npm run setup:fast-dev-cache
npm run dev:external
npm run dev:external:webpack
npm run dev:external:trace

# 质量检查
npm run lint
npm run test:unit
npm run test:e2e
npm run build
npm run build:static
npm run check:links
npm run check:performance
npm run verify:public

# 数据、分析与部署
npm run build:data
npm run analyze
npm run optimize:images
npm run deploy:server
npm run deploy:server:status
npm run setup:server:ci
npm run setup:server:https
npm run push:all
```

## 测试与验证

仓库当前包含以下验证链路：

- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run build`
- `npm run build:static`
- `npm run check:links`
- `npm run check:performance`
- `npm run verify:public`

说明：

- 单元测试目录为 `tests/unit`，由 Vitest + jsdom 执行
- E2E 测试目录为 `tests/e2e`
- Playwright 默认覆盖 `chromium` 和 `Mobile Chrome`
- 本地执行 E2E 时会自动拉起 `npm run dev`
- `npm run build` 会先执行 `npm run build:data`；CI 中通过 `SKIP_GITHUB_FETCH=1` 跳过 GitHub 数据抓取
- `npm run build:static` 会进入静态导出模式，临时移出拦截路由、清理 `.next` / `out`，构建后运行图片优化
- `npm run verify:public` 用于校验 Vercel 与自托管公开端点；是否强制校验自托管主域名由环境变量控制

Vercel 通过 Git 集成发布，自托管服务器通过 SSH bare repo 发布；本地可用 `npm run build:static` 验证静态导出链路。

## 部署

项目当前维护两条发布链路：

1. `Vercel`
2. `自托管服务器`

其中：

- Vercel 面向国际访问
- 自托管服务器面向中国大陆主域名发布

部署细节、回滚方式、服务端脚本与环境变量说明见：[docs/deployment-channels.md](docs/deployment-channels.md)

## 目录结构

```text
portfolio/
├─ src/
│  ├─ app/                 # App Router 页面、布局、API 路由
│  ├─ components/          # 页面组件与交互组件
│  ├─ hooks/               # 自定义 hooks
│  ├─ lib/                 # 运行时工具与辅助逻辑
│  ├─ config/              # 站点配置
│  ├─ data.ts              # 作品集核心内容数据
│  └─ data/                # GitHub 遥测等辅助数据
├─ docs/                   # 开发、部署、履历素材相关文档
├─ scripts/                # 构建、部署、链接检查、缓存初始化脚本
├─ tests/                  # 单元测试与 E2E 测试
├─ public/                 # 静态资源、简历 PDF、OG 图与图片优化哈希
```

## 相关文档

- [docs/local-dev-performance.md](docs/local-dev-performance.md)
- [docs/deployment-channels.md](docs/deployment-channels.md)
- [docs/content-evidence-policy.md](docs/content-evidence-policy.md)
- [docs/resume-ai-main.md](docs/resume-ai-main.md)
- [docs/resume-experience-copy.md](docs/resume-experience-copy.md)
- [docs/resume-star-bank.md](docs/resume-star-bank.md)
- [docs/resume-writing-kit.md](docs/resume-writing-kit.md)
- [docs/resume-metrics-checklist.md](docs/resume-metrics-checklist.md)

## 备注

- 非静态导出场景下，Next.js 使用 `standalone` 输出，便于自托管部署
- 静态导出场景下，仓库通过 `build:static` 生成静态站点产物
- 若要分析包体积，可执行 `npm run analyze`
