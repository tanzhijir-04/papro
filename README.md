<div align="center">

# 知更·Paper

**学术论文智能写作助手**

配置参数 · 管理大纲 · 生成提示词 · 论文审阅 · 写作优化

[![License: MIT](https://img.shields.io/badge/License-MIT-c2694f.svg)](LICENSE)

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

### 双版本模式

- **版本 A（自提供文献）** — 仅引用你提供的文献，不虚构，适合已有文献库
- **版本 B（AI 知识写作）** — 基于 AI 训练知识，文献需核实，适合构思框架

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
| 图标 | [Tabler Icons](https://tabler.io/icons) |
| 持久化 | localStorage（主题偏好） |

## 项目结构

```
知更·Paper/
├── src/
│   ├── App.jsx                  # 主组件，Tab 切换 + 全局布局
│   ├── store.js                 # 全局状态（Preact Signals）
│   ├── index.css                # 设计系统（CSS 变量 + 响应式）
│   ├── index.jsx                # 入口
│   ├── components/
│   │   ├── TabBar.jsx           # 5-Tab 导航栏
│   │   ├── PaperParams.jsx      # 论文参数配置
│   │   ├── OutlineManager.jsx   # 大纲拖拽管理
│   │   ├── GeneratePrompt.jsx   # 提示词生成
│   │   ├── PaperReview.jsx      # 论文审阅（6 维度 × 4 等级）
│   │   └── Humanizer.jsx        # 写作优化（24 种 AI 模式）
│   └── data/
│       ├── hzPatterns.js        # 24 种 AI 写作模式定义
│       ├── templates.js         # 5 个学术模板定义
│       └── tplConfigs.js        # 模板字段 + buildPrompt 函数
├── prompt_manager.html          # 原始单文件版本（Legacy）
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

## 许可

[MIT License](LICENSE)
