# 深色交互实验室改版记录

日期：2026-10-11

## 已完成

- 首页切换为深色作品集首屏：身份、价值主张、简历下载、关键结果、精选作品、关于与联系入口。
- 新增 `/projects`、`/experience`、`/about` 及 `/en/*` 页面，并保留 `/experiences/[slug]` 详情路由。
- 详情页改为正常滚动案例页，包含面包屑、结果、背景、问题、方案、证据和仓库入口。
- 接入 React Three Fiber / Drei / Three.js；桌面空闲时加载半透明有机环，移动端、低性能和减少动态效果模式使用静态首屏图。
- 使用图片生成工具产出五张本地 WebP：一张首屏视觉和四张主题封面。
- 四张封面主题映射：客服运行时=开放联结环，RAG=三片汇聚薄片，微信助手=嵌套记忆环，EasyCloudPan=分层存储结构。
- 更新深色主题变量、加载页、404、manifest、viewport、sitemap 和旧 hash 入口兼容层。

## 封面二次改版

- 原有抽象有机材质封面替换为四张可读的产品概念视觉：客服对话分流、文档检索到证据答案、聊天记忆到工具执行、文件上传到多端同步与权限治理。
- 图片由 `E:\Douyin-Viedo\grok-workflow-tool` 使用 `gpt-image-2.5-sunburst` 生成，压缩为 `public/images` 下的 WebP。
- `DarkProjectVisual` 增加中英文业务动线与核心技术标注，覆盖首页、作品索引和详情页。
- 生成提示词保存在 `.codex/cover-prompts/`，便于后续按单张项目继续迭代。

## 代码核对

- `npm run lint` 在本次修改后未发现 ESLint error；此前仅有的未使用导入警告已清理。
- 新增页面类型问题已修正。仓库既有 `tests` 类型配置仍报告 Playwright `interval` 字段和 Vitest `beforeAll/afterAll` 声明问题，未改动测试配置。
- 用户要求测试运行需确认；本记录之后不再主动启动测试、构建或公开端点检查。
