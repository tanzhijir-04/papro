# papro — 提示词工具集

一组帮助写作者高效生成结构化 AI 提示词的单页应用。生成的提示词可直接粘贴至 Claude 等大语言模型使用。

## 工具列表

| 应用 | 文件 | 定位 | 设计系统 |
|------|------|------|----------|
| 学术论文提示词管理器 | `prompt_manager.html` | 学术论文专用 | Anthropic Claude |
| 写作管理器 | `writer.html` | 通用写作，15+ 模板 | BMW M |
| 去 AI 味（独立版） | `humanizer.html` | 专注人性化处理 | Apple |

## 功能特性

### 学术论文提示词管理器（prompt_manager.html）
- 论文参数配置：题目、投稿场合、论文类型、引用格式、学科方向、目标读者、写作风格
- 大纲管理：拖拽排序章节，滑块调节字数，按比例自动分配
- 提示词生成：系统角色 + 任务指令 + 论文信息表 + 大纲规划 + 语言规范
- 双版本模式：用户自提供文献 / AI 基于训练知识写作

### 写作管理器（writer.html）
- 15+ 场景模板：学术、创作、职场、技术、翻译润色
- 实时预览：修改参数时提示词即时更新
- 模板配置：目标平台、语气风格、目标字数、AI 味控制
- 去 AI 味：集成 24 种 AI 写作痕迹检测与修复
- 收藏与历史：常用模板收藏，最近 20 条历史自动保存

### 去 AI 味（humanizer.html）
- 24 种 AI 写作痕迹模式检测
- 按类别筛选：内容、语言、风格、交流、填充
- 优化强度、语调、文本类型配置
- 生成完整系统提示词，含质量评分标准

## 使用方式

直接在浏览器中打开对应 HTML 文件，无需安装任何依赖。

```bash
# 本地打开
open writer.html

# 或使用 Python 快速启动服务
python -m http.server 8080
# 然后访问 http://localhost:8080/writer.html
```

## 技术栈

- 纯 HTML + CSS + Vanilla JavaScript，无框架依赖
- 字体：Inter（Google Fonts）
- 设计系统：BMW M 设计规范（纯黑画布 + M 三色条纹 + 方形按钮）
- 持久化：localStorage（收藏、历史、主题偏好）

## 项目结构

```
papro/
├── prompt_manager.html   # 学术论文提示词管理器（Anthropic 设计）
├── writer.html           # 写作管理器（BMW M 设计）
├── humanizer.html        # 去 AI 味独立版（Apple 设计）
├── design.md             # Anthropic 设计规范参考
├── apple_design.md       # Apple 设计规范参考
├── BMW_DESIGN.MD         # BMW M 设计规范参考
├── PRD.md                # 写作管理器产品需求文档
├── CLAUDE.md             # Claude Code 开发指引
└── README.md
```

## 开发

无需构建工具。修改对应 HTML 文件后刷新浏览器即可预览。

## 许可

MIT License
