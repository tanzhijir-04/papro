# 学术论文提示词管理器

一款帮助中文学术论文写作者高效配置参数、管理大纲、生成结构化提示词的单页应用。生成的提示词可直接粘贴至 Claude 等大语言模型使用。

## 功能特性

- **论文参数配置** — 题目、投稿场合、论文类型、参考文献格式、学科方向、目标读者、写作风格等一站式填写
- **大纲管理** — 拖拽排序章节，滑块调节各章节字数，按比例自动分配
- **提示词生成** — 一键生成包含系统角色、任务指令、论文信息表、大纲字数规划、语言风格规范的完整 Markdown 提示词
- **双版本模式**
  - 版本 A：用户自提供文献，AI 严格引用
  - 版本 B：AI 基于训练知识写作，文献需用户核实
- **暗色模式** — 支持浅色/深色主题切换，自动记忆偏好
- **响应式设计** — 适配桌面端与移动端

## 使用方式

直接在浏览器中打开 `prompt_manager.html`，无需安装任何依赖。

```bash
# 本地打开
open prompt_manager.html

# 或使用 Python 快速启动服务
python -m http.server 8080
# 然后访问 http://localhost:8080/prompt_manager.html
```

## 技术栈

- 纯 HTML + CSS + Vanilla JavaScript，无框架依赖
- 字体：Cormorant Garamond（标题衬线）+ Inter（正文无衬线）
- 图标：Tabler Icons（CDN）
- 设计系统：遵循 Anthropic Claude 官网设计规范（奶油色画布 + 珊瑚色主色 + 深色海军表面）

## 项目结构

```
papro/
├── prompt_manager.html   # 应用主体（单文件，含 CSS + JS）
├── design.md             # Anthropic 设计规范参考文档
├── CLAUDE.md             # Claude Code 开发指引
└── README.md
```

## 开发

无需构建工具。修改 `prompt_manager.html` 后刷新浏览器即可预览。

## 许可

MIT License
