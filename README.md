# 知更·Paper — 提示词工具集

一组帮助写作者高效生成结构化 AI 提示词的单页应用。生成的提示词可直接粘贴至 Claude 等大语言模型使用。

## 核心应用

| 文件 | 定位 | 设计系统 |
|------|------|----------|
| `prompt_manager.html` | 学术论文 + 25个写作模板 + 去AI味 + 综述工作流 | Anthropic Claude |

## 功能特性

### 知更·Paper
- 论文参数配置：题目、投稿场合、论文类型、引用格式、学科方向、目标读者、写作风格
- 大纲管理：拖拽排序章节，滑块调节字数，按比例自动分配
- 提示词生成：系统角色 + 任务指令 + 论文信息表 + 大纲规划 + 语言规范
- 双版本模式：用户自提供文献 / AI 基于训练知识写作

### 模板库（25 个场景模板）
- **学术**：文献综述、论文摘要、开题报告、论文评审、答辩提纲
- **内容创作**：公众号长文、小红书种草、知乎回答、Twitter线程、邮件通讯
- **职场**：周报/月报、商务邮件、PRD需求文档、OKR、项目复盘
- **技术**：技术博客、API文档、README、故障复盘、RFC技术提案
- **翻译润色**：中译英、英译中、学术润色、通俗化改写、语调转换
- 搜索、分类筛选、收藏、生成历史（最近 20 条）

### 写作优化（Humanizer）
- 24 种 AI 写作痕迹模式检测（基于维基百科 AI 写作特征指南）
- 按类别筛选：内容、语言、风格、交流、填充
- 优化强度、语调、文本类型配置
- 生成完整系统提示词，含质量评分标准（5 维度 /50 分）

### 综述工作流
- 5 步流程指引（找文献 → CSV → 喂 AI → Pandoc → 完成）
- 一键生成 CSV 模板 / 工作流提示词 / Pandoc 命令

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
- 字体：Cormorant Garamond（标题）+ Inter（正文）
- 设计系统：Anthropic Claude 设计规范（奶油色画布 + 珊瑚色主色 + 深色表面）
- 持久化：localStorage（收藏、历史、主题偏好）

## 项目结构

```
知更Paper/
├── prompt_manager.html   # 核心应用（Anthropic 设计，所有功能）
├── design.md             # Anthropic 设计规范参考
├── PRD.md                # 产品需求文档
├── CLAUDE.md             # Claude Code 开发指引
└── README.md
```

## 开发

无需构建工具。修改 `prompt_manager.html` 后刷新浏览器即可预览。

## 许可

MIT License
