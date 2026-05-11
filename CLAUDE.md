# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

papro is a collection of writing prompt tools — single-file HTML applications that help users generate structured AI prompts. Three apps ship today:

| App | File | Design System | Purpose |
|-----|------|---------------|---------|
| 学术论文提示词管理器 | `prompt_manager.html` | Anthropic Claude | Academic paper prompts |
| 写作管理器 | `writer.html` | BMW M | General writing, 15+ templates |
| 去 AI 味 | `humanizer.html` | Apple | AI dehumanization prompts |

## How to Run

Open any HTML file directly in a browser. No build step, no dependencies.

```bash
python -m http.server 8080
# Then visit http://localhost:8080/writer.html
```

## Architecture

Each app is a self-contained single-file HTML with inline CSS and vanilla JavaScript. No shared code between apps (each has its own design tokens).

### prompt_manager.html (~1500+ lines)
- **Anthropic design system**: cream canvas, coral primary, dark navy surfaces
- 5 tabs: 论文参数, 大纲管理, 生成提示词, 写作优化, 综述工作流
- State: `sections` array of `{id, name, type, words, locked}` objects
- Drag-and-drop uses flag-based guard (`dragAllowed`) to avoid slider conflicts
- Theme: `html.dark` class with CSS custom properties, localStorage persistence

### writer.html (~1200+ lines)
- **BMW M design system**: pure black canvas, M tricolor accents, rectangular buttons, weight 700/300 contrast
- 4 tabs: 模板库, 去AI味, 收藏, 去AI味
- 25 templates across 5 categories (academic, content, business, tech, translate)
- Real-time prompt preview with debounce
- Humanizer integration: 24 AI writing patterns from Wikipedia
- localStorage: favorites, history (20 items)

### humanizer.html (~500 lines)
- **Apple design system**: white/parchment canvas, #0066cc accent, pill-shaped buttons
- Standalone version of the humanizer with full pattern grid
- Dark mode toggle with `prefers-color-scheme` default

## Design System References

- `design.md` — Anthropic/Claude design tokens
- `apple_design.md` — Apple design tokens
- `BMW_DESIGN.MD` — BMW M design tokens

## Development Notes

- All UI text is in Simplified Chinese.
- No test suite, no linter, no CI/CD configured.
- `.vscode/settings.json` contains only editor preferences.
- `PRD.md` contains the product requirements for the writing manager.
