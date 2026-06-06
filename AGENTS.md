# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

知更·Paper (中文学术论文提示词管理器) — a single-file HTML application (`prompt_manager.html`) that helps users configure parameters, manage outlines, and generate structured prompts for AI-assisted Chinese academic paper writing.

## How to Run

Open `prompt_manager.html` directly in a browser. No build step, no dependencies to install.

## Architecture

Everything lives in one file: `prompt_manager.html` (~524 lines) with inline CSS and vanilla JavaScript. External dependency: Tabler Icons webfont via CDN.

**Three-tab UI:**
1. **论文参数** — Paper metadata: title, venue, type, citation format, discipline, research direction, audience, style, constraints.
2. **大纲管理** — Drag-and-drop outline reordering with per-section word count sliders. Auto-distribution uses type-based ratios (abstract 8%, intro 13%, body 60%, conclusion 9%).
3. **生成提示词** — Generates a Markdown prompt with system role, task instructions, paper metadata table, outline/word plan, language rules, and citation format.

**Two modes:** Version A (user-provided references only) vs Version B (AI knowledge with verification disclaimer).

**Key internals:**
- State: `sections` array of `{id, name, type, words, locked}` objects.
- `autosave()` is a no-op stub — persistence not implemented.
- `sendToChat()` calls external `sendPrompt()` if available — integration hook for a chat environment.
- CSS uses custom properties (`var(--color-text-primary)` etc.) for theming — designed to render inside a themed container/sidebar.
- Drag-and-drop uses native HTML5 drag events.

## Development Notes

- All UI text is in Simplified Chinese.
- No test suite, no linter, no CI/CD configured.
- The `.vscode/settings.json` contains only editor preferences (inlay hints, bracket colorization).
