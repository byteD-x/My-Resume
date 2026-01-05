# 杜旭嘉 - 个人作品集网站

高性能、可访问的个人作品集网站，采用现代 Web 技术栈构建，支持可视化编辑模式。

![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-38B2AC?logo=tailwind-css)

## ✨ 特性

- **🎨 Premium 设计**: Glass-morphism 风格，平滑动画交互
- **♿ 可访问性**: WCAG 2.1 兼容，键盘导航，屏幕阅读器友好
- **🔍 SEO 优化**: 结构化数据 (JSON-LD)，Open Graph，语义化 HTML
- **📊 数据分析**: Google Analytics 4 集成
- **🔒 安全**: CSP Headers，XSS 防护
- **⚡ 高性能**: 动态导入，懒加载动画，Tailwind CSS v4 自动 purge
- **📱 响应式**: 移动优先设计，触摸友好 (44×44dp 最小触控区域)
- **🧪 测试覆盖**: Playwright E2E 测试

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16+ (App Router) |
| 语言 | TypeScript 5+ |
| 样式 | Tailwind CSS 4 |
| 动画 | Framer Motion |
| 图标 | Lucide React |
| 分析 | React GA4 |
| 测试 | Playwright |

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm run start
```

## 📝 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run lint:fix` | 自动修复 lint 问题 |
| `npm run format` | 使用 Prettier 格式化代码 |
| `npm run test:e2e` | 运行 Playwright E2E 测试 |
| `npm run test:e2e:ui` | 以 UI 模式运行测试 |
| `npm run check:links` | 检查死链 |

## 📊 Analytics 配置

要启用 Google Analytics 4，设置环境变量：

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

支持的追踪事件：
- 页面浏览
- 滚动深度 (25%, 50%, 75%, 100%)
- CTA 点击
- 简历下载
- 预约表单提交

## 🧪 测试

### 运行 E2E 测试

```bash
# 首次运行需安装浏览器
npx playwright install chromium

# 运行测试
npm run test:e2e

# 以 UI 模式运行（可视化调试）
npm run test:e2e:ui
```

测试覆盖：
- Hero 区域加载
- CTA 按钮点击
- 预约模态框交互
- 导航功能
- 滚动进度条
- 可访问性检查

## 📁 项目结构

```
src/
├── app/
│   ├── globals.css          # 全局样式 + CSS 变量
│   ├── layout.tsx           # 根布局 + SEO
│   └── page.tsx             # 主页面
├── components/
│   ├── Hero.tsx             # 首屏 + CTA
│   ├── AppointmentModal.tsx # 预约表单模态框
│   ├── ScrollProgressBar.tsx# 滚动进度条
│   ├── ExperienceCard.tsx   # 经历卡片 (可展开)
│   ├── Timeline/            # 时间轴组件
│   ├── Contact.tsx          # 联系方式
│   └── ui/                  # 基础 UI 组件
├── lib/
│   ├── analytics.ts         # GA4 工具函数
│   └── AnalyticsProvider.tsx# 分析初始化
├── config/
│   └── site.ts              # 站点配置
├── data.ts                  # 内容数据
└── types.ts                 # TypeScript 类型
```

## 🔐 安全

已配置的安全措施：

- **Content-Security-Policy**: 限制资源加载来源
- **X-Content-Type-Options**: 防止 MIME 类型嗅探
- **X-Frame-Options**: 防止点击劫持
- **X-XSS-Protection**: XSS 过滤
- **Referrer-Policy**: 控制 Referer 发送

## 🌐 部署

### GitHub Pages

项目已配置 GitHub Actions 自动部署：

1. 推送到 `main` 分支触发部署
2. CI 流程：Lint → Test → Build → Deploy

### Vercel

```bash
# 直接部署到 Vercel
npx vercel
```

## 📄 License

MIT

---

Made with ❤️ by 杜旭嘉
