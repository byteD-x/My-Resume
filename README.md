# 杜旭嘉 | 个人作品集网站

高性能、可访问的个人作品集网站，采用 Next.js 16 构建，展示后端工程师的专业经历、项目与技能。

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12+-0055FF?logo=framer)](https://www.framer.com/motion/)

---

## ✨ 核心特性

### 🎨 现代化设计
- **Glass-morphism 风格** - 毛玻璃效果与渐变背景
- **平滑动画交互** - Framer Motion 驱动的手势与过渡动画
- **响应式布局** - 移动优先设计，适配所有设备

### ♿ 可访问性优先
- **WCAG 2.1 兼容** - 符合国际无障碍标准
- **键盘导航** - 完整的 Tab 键支持
- **屏幕阅读器友好** - 语义化 HTML + ARIA 标签
- **减少动画偏好** - 自动检测用户减少动画设置

### 🔍 SEO 优化
- **结构化数据** - JSON-LD 语义标记
- **Open Graph** - 社交分享预览优化
- **语义化 HTML** - 正确的标题层级与标签
- **Sitemap & Robots** - 搜索引擎友好

### 📊 数据分析
- **Google Analytics 4** - 完整的用户行为追踪
- **滚动深度追踪** - 25%, 50%, 75%, 100%
- **事件追踪** - CTA 点击、简历下载、表单提交

### ⚡ 高性能
- **动态导入** - 代码分割与懒加载
- **动画懒加载** - 仅在需要时加载动画库
- **SSR 优化** - 首屏内容优先渲染
- **Tailwind CSS v4** - 自动 purge 未使用样式

### 🔒 企业级安全
- **Content-Security-Policy** - 严格的资源加载策略
- **XSS 防护** - 输入验证与转义
- **Headers 安全** - X-Frame-Options, X-Content-Type-Options 等

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16+ (App Router) |
| **语言** | TypeScript 5+ |
| **运行时** | React 19 |
| **样式** | Tailwind CSS 4 |
| **动画** | Framer Motion 12+ |
| **UI 组件** | Lucide React |
| **分析** | React GA4 |
| **测试** | Playwright |

---

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

---

## 📝 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 (Turbopack) |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run lint:fix` | 自动修复 lint 问题 |
| `npm run format` | 使用 Prettier 格式化代码 |
| `npm run test:e2e` | 运行 Playwright E2E 测试 |
| `npm run test:e2e:ui` | 以 UI 模式运行测试 |
| `npm run check:links` | 检查死链 |
| `npm run analyze` | Bundle 大小分析 |

---

## 📊 Analytics 配置

要启用 Google Analytics 4，设置环境变量：

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**支持的事件追踪：**
- 页面浏览 (Page View)
- 滚动深度 (25%, 50%, 75%, 100%)
- CTA 按钮点击
- 简历下载
- 预约表单提交
- 外链点击

---

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

**测试覆盖范围：**
- Hero 区域加载与渲染
- CTA 按钮交互
- 预约模态框打开/关闭
- 导航链接功能
- 滚动进度条响应
- 可访问性检查 (WCAG)

---

## 📁 项目结构

```
src/
├── app/
│   ├── globals.css          # 全局样式 + CSS 变量
│   ├── layout.tsx           # 根布局 + SEO + Analytics
│   ├── page.tsx             # 主页面（组合所有组件）
│   ├── robots.ts            # robots.txt
│   └── sitemap.ts           # sitemap.xml
├── components/
│   ├── Hero.tsx             # 首屏展示区域
│   ├── Hero/                # Hero 子组件
│   ├── Timeline/            # 职业时间轴组件
│   ├── ProjectList.tsx      # 项目展示网格
│   ├── ExperienceCard.tsx   # 经历/项目卡片
│   ├── TechStack.tsx        # 技能栈展示
│   ├── Services.tsx         # 服务介绍
│   ├── Contact.tsx          # 联系方式
│   ├── HighlightDeck.tsx    # 成就数据卡片
│   ├── Navbar.tsx           # 导航栏
│   ├── Footer.tsx           # 页脚
│   ├── ScrollProgressBar.tsx# 滚动进度条
│   ├── EditorToolbar.tsx    # 可编辑模式工具栏
│   └── ui/                  # 基础 UI 组件库
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Section.tsx
│       ├── Container.tsx
│       ├── GlowCard.tsx
│       └── ...
├── lib/
│   ├── analytics.ts         # GA4 工具函数
│   ├── AnalyticsProvider.tsx# 分析上下文
│   ├── useEditableContent.ts# 可编辑内容 Hook
│   ├── utils.ts             # 工具函数
│   └── motion.ts            # 动画常量
├── hooks/
│   ├── useScroll.ts         # 滚动 Hook
│   ├── use3DTilt.ts         # 3D 倾斜效果
│   ├── useFocusTrap.ts      # 焦点陷阱
│   └── useScrollLock.ts     # 滚动锁定
├── config/
│   ├── site.ts              # 站点配置
│   ├── animation.ts         # 动画配置
│   └── techColors.ts        # 技术标签颜色
├── data.ts                  # 默认内容数据
└── types.ts                 # TypeScript 类型
```

---

## 🔐 安全特性

已配置的企业级安全措施：

| 安全措施 | 配置 |
|----------|------|
| Content-Security-Policy | 限制资源加载来源 |
| X-Content-Type-Options | 防止 MIME 类型嗅探 |
| X-Frame-Options | 防止点击劫持 |
| X-XSS-Protection | XSS 过滤 |
| Referrer-Policy | 控制 Referer 发送 |

---

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

---

## 📄 License

MIT License

---

**Made with ❤️ by 杜旭嘉**

- 📧 Email: 2041487752dxj@gmail.com
- 💻 GitHub: [@icefunicu](https://github.com/icefunicu)
- 🌐 Website: [https://my-resume-gray-five.vercel.app](https://my-resume-gray-five.vercel.app)
