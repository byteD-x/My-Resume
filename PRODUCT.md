# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

招聘方、技术合作方和需要把 AI 接入既有业务系统的技术负责人。访客需要在短时间内判断工程能力、交付边界和可验证证据。

## Product Purpose

这是杜旭嘉的工程作品集，用真实项目、仓库证据和可复核指标呈现 AI Agent、全栈交付、性能可靠性与业务理解能力。

## Positioning

作品集把访问过程组织成一部由滚动驱动的短片：从身份与价值主张开始，经过能力概览，进入三个问题到结果的案例现场，最后回到第一人称的工作哲学。

## Operating Context

现代浏览器、键盘和触控设备；中文为默认语言，提供英文路由。首屏内容必须立即可读，非关键动效和 3D 在空闲或进入视口后加载。

## Capabilities and Constraints

- 首页四幕：钩子、信任、证据、收束。
- 证据只使用源码、README、测试、脚本或已明确标注的履历口径，不编造线上指标。
- 保留 SEO、结构化数据、双语路由、案例详情、简历下载、键盘焦点和减少动态效果支持。
- 移动端使用普通文档流替代桌面 sticky 场景，滚动进度仍可见。

## Evidence on Hand

- 项目与验证来源见 `src/data.ts`、`src/lib/home-highlights.ts` 和 `docs/content-evidence-policy.md`。
- 案例详情规范路由位于 `src/app/projects/[slug]/` 与对应的双语路由；`src/app/experiences/[slug]/` 保留经历详情和旧项目链接兼容。
- 本地视觉资产位于 `public/images/`，本地字体子集位于 `public/fonts/`。

## Product Principles

- 先让访客知道我是谁，再让访客看到我如何工作。
- 每个案例只突出一个核心结果，并保留证据来源。
- 动效服务节奏和层级，不阻塞阅读和交互。
- 文案具体、可读、以第一人称承担判断。

## Accessibility & Inclusion

语义标题和区域、键盘可达焦点、可见焦点环、足够对比度、可访问进度导航、图片替代文本，以及 `prefers-reduced-motion` 降级。
