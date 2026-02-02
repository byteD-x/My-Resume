# AI Agent Documentation - 杜旭嘉作品集网站

## 项目概述

这是一个高性能、可访问的 Next.js 16 个人作品集网站，展示后端工程师杜旭嘉的专业经历、项目和技能。

**技术栈**: Next.js 16+ (App Router) | TypeScript 5+ | Tailwind CSS 4 | Framer Motion | React 19

## 文件结构

```
src/
├── app/
│   ├── globals.css              # 全局样式 + CSS 变量 + Tailwind 配置
│   ├── layout.tsx               # 根布局 + SEO + Analytics Provider
│   ├── page.tsx                 # 主页面（组合各组件）
│   ├── robots.ts                # SEO: robots.txt
│   └── sitemap.ts               # SEO: sitemap.xml
├── components/
│   ├── Hero.tsx                 # 首屏展示（姓名、职位、核心卖点）
│   ├── Hero/                    # Hero 子组件
│   │   ├── HeroCTA.tsx          # CTA 按钮（预约模态框）
│   │   ├── HeroBullets.tsx      # 核心能力列表
│   │   ├── HeroStatusBadges.tsx # 状态徽章（地点、可用性）
│   │   └── HeroQuickFacts.tsx   # 快速信息卡片
│   ├── HeroBackground.tsx       # 背景动画效果
│   ├── Timeline/                # 职业时间轴组件
│   │   ├── TimelineNew.tsx      # 主时间轴组件（含标签过滤）
│   │   ├── TimelineItem.tsx     # 单个时间轴条目
│   │   └── TimelineLayout.tsx   # 布局组件
│   ├── ProjectList.tsx          # 项目展示网格
│   ├── ExperienceCard.tsx       # 项目/经历卡片（可展开详情）
│   ├── TechStack.tsx            # 技能栈展示
│   ├── Services.tsx             # 服务介绍
│   ├── Contact.tsx              # 联系方式
│   ├── HighlightDeck.tsx        # 成就数据展示卡片
│   ├── AppointmentModal.tsx     # 预约咨询模态框
│   ├── ExperienceModal.tsx      # 经历详情模态框
│   ├── FloatingResumeButton.tsx # 悬浮简历下载按钮
│   ├── Navbar.tsx               # 导航栏
│   ├── Footer.tsx               # 页脚
│   ├── ScrollProgressBar.tsx    # 滚动进度条
│   ├── EditorToolbar.tsx        # 可编辑模式工具栏
│   ├── Editor/
│   │   └── EditableText.tsx     # 可编辑文本组件
│   └── ui/                      # 基础 UI 组件库
│       ├── Button.tsx           # 按钮
│       ├── Badge.tsx            # 徽章
│       ├── Section.tsx          # 区块容器
│       ├── Container.tsx        # 内容容器
│       ├── GlowCard.tsx         # 发光卡片
│       ├── AnimatedCounter.tsx  # 数字动画
│       ├── MotionWrapper.tsx    # 动画包装器
│       ├── CursorGlow.tsx       # 鼠标光晕效果
│       └── ...
├── lib/
│   ├── analytics.ts             # GA4 追踪工具函数
│   ├── AnalyticsProvider.tsx    # Analytics 上下文提供者
│   ├── content-schema.ts        # 内容数据 Zod 验证
│   ├── useEditableContent.ts    # 可编辑内容 Hook
│   ├── utils.ts                 # 工具函数 (cn, 等)
│   └── motion.ts                # 动画常量
├── hooks/
│   ├── useScroll.ts             # 滚动相关 Hook
│   ├── use3DTilt.ts             # 3D 倾斜效果
│   ├── useFocusTrap.ts          # 焦点陷阱（模态框）
│   └── useScrollLock.ts         # 滚动锁定
├── config/
│   ├── site.ts                  # 站点配置（名称、URL、SEO）
│   ├── animation.ts             # 动画配置常量
│   └── techColors.ts            # 技术标签颜色映射
├── data.ts                      # 默认内容数据（职业经历、项目、技能等）
└── types.ts                     # TypeScript 类型定义
```

## 核心功能

### 1. 首屏展示 (Hero)
- 展示姓名、职位、核心能力
- 状态徽章（地点、可用性）
- 快速信息卡片（技术栈摘要）
- CTA 按钮触发预约模态框

### 2. 成就数据 (HighlightDeck)
- 可点击的成就卡片
- 点击后滚动到相关经历
- 链接到 GitHub 项目

### 3. 职业时间轴 (Timeline)
- 按时间倒序排列的职业经历
- 标签过滤功能（按技术栈筛选）
- 可展开查看详情（背景、问题、解决方案、结果）
- 标记高亮项目

### 4. 项目展示 (ProjectList)
- 卡片式布局
- 技术标签
- 展开查看详细信息
- GitHub 链接

### 5. 技能栈 (TechStack)
- 按类别分组（后端、数据、AI、全栈、运维）
- AI 原生开发者（Vibe Coding）介绍

### 6. 服务介绍 (Services)
- 全栈应用开发
- AI 工程化落地
- 性能优化与重构
- 自动化与数据处理

### 7. 联系 (Contact)
- 联系方式（电话、邮箱、微信）
- GitHub 链接
- 简历下载按钮
- 预约表单

### 8. 可访问性
- 键盘导航支持
- 屏幕阅读器优化（ARIA 标签）
- 滚动进度条
- 跳过链接

## 数据管理

### 默认数据 (`src/data.ts`)
所有内容数据集中管理，包括：
- `hero`: 首屏信息
- `about`: 关于介绍
- `impact`: 成就数据
- `timeline`: 职业经历
- `projects`: 项目经历
- `skills`: 技能分类
- `services`: 服务介绍
- `vibeCoding`: AI 原生开发者介绍
- `contact`: 联系信息

### 可编辑模式
- 通过 `useEditableContent` Hook 管理
- 支持本地预览修改
- 导出/导入 JSON
- 重置为默认值

## 性能优化

### 代码分割
- 动态导入非首屏组件
- 懒加载背景动画

### 动画策略
- 使用 `useReducedMotion` 检测用户偏好
- 首选 CSS 动画
- Framer Motion 仅在需要复杂动画时使用

## 开发规范

### 组件命名
- 页面组件: `PascalCase.tsx`
- UI 组件: `PascalCase.tsx`（位于 `ui/` 目录）
- 复合组件: 同名目录 + `index.ts`

### 样式
- 使用 Tailwind CSS
- 遵循移动优先设计
- 保持响应式

### 类型
- 所有组件 Props 使用 TypeScript 接口
- 共用类型定义在 `types.ts`

## 可用命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | ESLint 检查 |
| `npm run lint:fix` | 自动修复 lint |
| `npm run format` | Prettier 格式化 |
| `npm run test:e2e` | Playwright E2E 测试 |
| `npm run test:e2e:ui` | UI 模式运行测试 |
| `npm run analyze` | Bundle 分析 |

## 配置项

### 环境变量
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID  # Google Analytics ID
NEXT_PUBLIC_BASE_PATH          # GitHub Pages 部署路径
NEXT_PUBLIC_STATIC_EXPORT      # 是否静态导出
```

### 站点配置 (`src/config/site.ts`)
- 站点名称、角色
- SEO 描述
- OG 图片路径

## 测试

### E2E 测试 (Playwright)
- Hero 区域加载
- CTA 按钮点击
- 预约模态框交互
- 导航功能
- 可访问性检查

## 部署

### GitHub Pages
- 自动部署通过 GitHub Actions
- 触发条件: 推送到 main 分支

### Vercel
- `npx vercel` 直接部署

## 联系人

- **姓名**: 杜旭嘉
- **邮箱**: 2041487752dxj@gmail.com
- **GitHub**: https://github.com/icefunicu
- **网站**: https://my-resume-gray-five.vercel.app
