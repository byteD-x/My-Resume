# 杜旭嘉 - 个人作品集网站

Apple 风格的单页个人作品集网站，支持可视化编辑模式。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 可视化编辑模式

本项目支持一个特殊的"可视化编辑模式"，让你可以直接在浏览器中编辑内容，然后导出配置。

### 开启编辑模式

1. 打开 `src/data.ts` 文件
2. 将 `ENABLE_EDITING` 设置为 `true`：
   ```typescript
   export const ENABLE_EDITING = true;
   ```
3. 启动开发服务器：`npm run dev`
4. 在浏览器中打开 `http://localhost:3000`

### 编辑内容

- 编辑模式下，页面右上角会显示"编辑模式已启用"提示
- 所有可编辑的文字区域会显示虚线边框
- 点击任意可编辑区域即可开始编辑
- 按 `Enter` 确认编辑，按 `Esc` 取消编辑

### 导出配置

1. 完成所有编辑后，点击页面右下角的 **"Export Config"** 按钮
2. 在弹出的对话框中，点击 **"复制代码"**
3. 将复制的代码粘贴到 `src/data.ts` 文件中，完全替换原有内容
4. 导出的代码会自动将 `ENABLE_EDITING` 设置为 `false`

### 部署

1. 确保 `ENABLE_EDITING` 为 `false`
2. 运行构建命令：
   ```bash
   npm run build
   ```
3. 构建产物位于 `out` 目录，可直接部署到任意静态托管服务

## 部署到 GitHub Pages

1. 在 `next.config.ts` 中配置 `basePath`（如果需要）：
   ```typescript
   basePath: '/your-repo-name',
   assetPrefix: '/your-repo-name/',
   ```

2. 构建项目：
   ```bash
   npm run build
   ```

3. 将 `out` 目录的内容推送到 `gh-pages` 分支

## 项目结构

```
src/
├── app/
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 主页面
├── components/
│   ├── EditableText.tsx # 可编辑文本组件
│   ├── Timeline.tsx     # 时间轴组件
│   ├── Hero.tsx         # 首屏组件
│   ├── About.tsx        # 关于我组件
│   ├── Skills.tsx       # 技能组件
│   ├── VibeCoding.tsx   # Vibe Coding 组件
│   ├── Projects.tsx     # 项目组件
│   ├── Contact.tsx      # 联系方式组件
│   └── ExportButton.tsx # 导出按钮组件
├── data.ts              # 数据文件（编辑开关 + 内容）
└── types.ts             # TypeScript 类型定义
```

## 自定义数据
所有个人信息都存储在 `src/data.ts` 中，你可以：

1. **使用可视化编辑模式**（推荐）：开启编辑模式 → 在浏览器中编辑 → 导出配置
2. **直接编辑 data.ts**：手动修改 `portfolioData` 对象中的内容

## License

MIT
