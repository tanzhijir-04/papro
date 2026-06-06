<div align="center">

# 知更·Paper

**学术论文智能写作助手**

🌐 **官网：https://zgpaper.pages.dev/**

配置参数 · 管理大纲 · 生成提示词 · 论文审阅 · 写作优化 · 写作指南

[![License: MIT](https://img.shields.io/badge/License-MIT-c2694f.svg)](LICENSE)
[![Sponsor](https://img.shields.io/badge/❤️_赞助-爱发电-c2694f.svg)](https://ifdian.net/a/tanz666/plan)

</div>

---

## 功能一览

| 模块 | 说明 |
|------|------|
| **论文参数** | 题目、投稿场合、论文类型、引用格式、学科方向、目标读者、写作风格 |
| **大纲管理** | 拖拽排序章节，滑块调节字数，按比例自动分配 |
| **生成提示词** | 系统角色 + 任务指令 + 论文信息表 + 大纲规划 + 语言规范，一键复制 |
| **论文审阅** | 6 维度审阅（逻辑/规范/语言/AIGC/论证/格式），4 级论文等级，生成结构化审阅提示词 |
| **写作优化** | 24 种 AI 写作痕迹检测，按类别筛选，强度/语调/语言配置 |
| **写作指南** | 7 步完整教程 + FAQ，右侧栏常驻显示，支持折叠/展开和拖拽调宽 |

### 双版本模式

- **版本 A（自提供文献）** — 仅引用你提供的文献，不虚构，适合已有文献库
- **版本 B（AI 知识写作）** — 基于 AI 训练知识，文献需核实，适合构思框架

### AI 工具集成

指南中推荐 6 款主流 AI 聊天工具，均带有官方品牌图标：

Kimi · DeepSeek · ChatGPT · Claude · 豆包 · 通义千问

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:5173
```

## 技术栈

| 层面 | 选型 |
|------|------|
| 框架 | [Preact](https://preactjs.com/) + [Preact Signals](https://github.com/preactjs/signals) |
| 构建 | [Vite](https://vitejs.dev/) |
| 字体 | Noto Serif SC（标题）+ Noto Sans SC（正文）+ JetBrains Mono（代码） |
| 图标 | [Tabler Icons](https://tabler.io/icons) + 品牌 SVG（OpenAI/Anthropic/DeepSeek） |
| 持久化 | localStorage（主题偏好、指南宽度、阅读进度） |

## 项目结构

```
知更·Paper/
├── src/
│   ├── App.jsx                  # 主组件，双栏布局 + 拖拽分界
│   ├── store.js                 # 全局状态（Preact Signals）
│   ├── index.css                # 设计系统（CSS 变量 + 响应式）
│   ├── index.jsx                # 入口
│   ├── components/
│   │   ├── TabBar.jsx           # 5-Tab 导航栏
│   │   ├── PaperParams.jsx      # 论文参数配置
│   │   ├── OutlineManager.jsx   # 大纲拖拽管理
│   │   ├── GeneratePrompt.jsx   # 提示词生成
│   │   ├── PaperReview.jsx      # 论文审阅（6 维度 × 4 等级）
│   │   ├── Humanizer.jsx        # 写作优化（24 种 AI 模式）
│   │   └── WritingGuide.jsx     # 写作指南（7 步教程 + FAQ）
│   └── data/
│       ├── hzPatterns.js        # 24 种 AI 写作模式定义
│       ├── templates.js         # 5 个学术模板定义
│       └── tplConfigs.js        # 模板字段 + buildPrompt 函数
├── prompt_manager.html          # 原始单文件版本（Legacy）
├── guide.html                   # 独立指南页面（Legacy）
├── PRD.md                       # 产品需求文档
├── CLAUDE.md                    # Claude Code 开发指引
└── AGENTS.md                    # Codex 开发指引
```

## 设计系统

基于 Anthropic Claude 设计规范演化，双色调配色：

| Token | 浅色 | 深色 |
|-------|------|------|
| 主色 | `#c2694f` 珊瑚 | 同 |
| 辅色 | `#4a9e8e` 青绿 | 同 |
| 画布 | `#f8f6f1` 奶油 | `#141311` 深黑 |
| 表面 | `#ffffff` 纯白 | `#1c1b18` 暗灰 |

支持浅色/深色主题切换，偏好自动保存到 localStorage。

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建结果
```

## 部署到 Cloudflare Pages

本项目是纯静态站点（无后端），非常适合部署到 Cloudflare Pages。

### 方式一：连接 GitHub 仓库（推荐）

1. **推送到 GitHub**（已完成）

2. **登录 Cloudflare Dashboard**
   - 打开 https://dash.cloudflare.com
   - 左侧菜单 → **Workers & Pages** → **Create**

3. **连接仓库**
   - 选择 **Pages** 标签 → **Connect to Git**
   - 授权并选择 `tanzhijir-04/papro` 仓库

4. **配置构建设置**

   | 字段 | 值 |
   |------|-----|
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node.js version | `18`（或更高） |

5. **点击 Save and Deploy**
   - 首次部署约 1-2 分钟
   - 部署完成后获得 `https://papro.pages.dev` 域名

6. **绑定自定义域名**（可选）
   - Pages 项目 → **Custom domains** → 添加你的域名
   - 按提示在域名 DNS 添加 CNAME 记录指向 `papro.pages.dev`

### 官网地址

https://zgpaper.pages.dev/

### 方式二：直接上传

```bash
# 本地构建
npm run build

# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist --project-name=zgpaper
```

### 自动部署

连接 GitHub 后，每次 push 到 `main` 分支会自动触发重新部署。

### 注意事项

- Cloudflare Pages 免费套餐包含：无限站点、无限请求、无限带宽
- 全球 CDN 加速，国内访问速度也不错
- 支持自动 HTTPS
- SPA 路由：本项目是单页应用，无需额外配置，Cloudflare Pages 默认支持

## 赞助支持

如果知更·Paper 对你有帮助，欢迎请作者喝杯咖啡 ☕

[❤️ 爱发电赞助](https://ifdian.net/a/tanz666/plan)

## 许可

[MIT License](LICENSE)
