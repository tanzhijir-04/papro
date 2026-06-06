# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

知更·Paper is a unified writing prompt tool — a Preact application that helps users generate structured AI prompts. Features are organized as components with a consistent Anthropic design system.

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main component, tab switching + global state |
| `src/store.js` | Global state (Preact Signals) |
| `src/index.css` | Global styles (Anthropic design tokens) |
| `src/data/*.js` | Template and pattern data |
| `src/components/*.jsx` | Tab components |
| `prompt_manager.html` | Original single-file version (legacy) |

## How to Run

```bash
npm install
npm run dev
# Then visit http://localhost:5173
```

## Architecture

Preact + Vite with Preact Signals for state management.

### Components
- **PaperParams**: 论文参数 (title, venue, paper type, citation format, discipline, audience, writing style)
- **OutlineManager**: 大纲管理 (drag-and-drop sections with word count sliders)
- **GeneratePrompt**: 生成提示词 (system role + task instructions + paper info table)
- **Humanizer**: 写作优化 (24 AI writing patterns, category filtering, quality scoring)
- **TemplateLibrary**: 模板库 (25 templates, search, favorites, history, buildPrompt)
- **ReviewWorkflow**: 综述工作流 (5-step workflow, CSV template, Pandoc commands)

### State Management (store.js)
- Paper parameters: signals for all form fields
- Outline: sections array signal + totalWords
- Humanizer: hzSelected Set, hzIntensity, hzTone, hzLang, hzType
- Template: tplFavorites, tplHistory, tplSelected
- **Linkage**: pendingText signal for template→Humanizer connection

### Data Files
- `hzPatterns.js`: 24 AI writing patterns
- `templates.js`: 25 template definitions
- `tplConfigs.js`: Template fields + buildPrompt functions

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
- `PRD.md` contains the product requirements.
