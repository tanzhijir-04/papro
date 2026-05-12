# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

papro is a unified writing prompt tool — a single HTML application that helps users generate structured AI prompts. All features live in one file with a consistent Anthropic design system.

| File | Purpose |
|------|---------|
| `prompt_manager.html` | All-in-one prompt tool (论文 + 模板库 + 写作优化 + 综述工作流) |

## How to Run

Open `prompt_manager.html` directly in a browser. No build step, no dependencies.

```bash
python -m http.server 8080
# Then visit http://localhost:8080/prompt_manager.html
```

## Architecture

Single-file HTML with inline CSS and vanilla JavaScript (~3300 lines).

### prompt_manager.html
- **Anthropic design system**: cream canvas `#faf9f5`, coral primary `#cc785c`, dark navy `#181715`
- **6 tabs**: 论文参数, 大纲管理, 生成提示词, 写作优化, 模板库, 综述工作流
- **论文参数**: title, venue, paper type, citation format, discipline, audience, writing style
- **大纲管理**: drag-and-drop sections with word count sliders (`dragAllowed` flag guard)
- **生成提示词**: system role + task instructions + paper info table + outline plan + style rules
- **写作优化 (Humanizer)**: 24 AI writing patterns from Wikipedia, category filtering, intensity/tone/lang config, quality scoring (5 dimensions, /50)
- **模板库**: 25 writing templates across 5 categories (academic, content, business, tech, translate), search, favorites, history, per-template config with `buildPrompt()`
- **综述工作流**: 5-step workflow, CSV template, Pandoc commands
- Theme: `html.dark` class with CSS custom properties, localStorage persistence
- State: `sections` array for outline, `hzPatterns`/`hzSelected` for humanizer, `templates`/`tplConfigs` for template library

## Design System

Anthropic Claude design tokens (defined in CSS custom properties):
- Canvas: `#faf9f5` / Dark: `#181715`
- Primary: `#cc785c` / Active: `#a9583e`
- Fonts: Cormorant Garamond (headings) + Inter (body)
- Radius: 8px-12px
- Animations: fadeUp, fadeIn, scaleIn, pillPop, shimmer

## Development Notes

- All UI text is in Simplified Chinese.
- No test suite, no linter, no CI/CD configured.
- `.vscode/settings.json` contains only editor preferences.
- `PRD.md` contains the product requirements.
