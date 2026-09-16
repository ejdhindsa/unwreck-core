# unwreck-core

unwreck-core is the design system foundation for everything under the `unwreck` brand. It's the source of truth for colors, type, spacing and motion across all my projects, so I stop rebuilding the same buttons and color logic every time I start something new.

It takes a small set of design primitives (colors, typography, spacing, shadows, motion) and compiles them into whatever format a given repo needs: CSS custom properties, a Tailwind v4 theme, W3C DTCG tokens, or typed TypeScript constants.

---

## What is this?

The goal was to make the architecture the actual product, not just a pile of hex codes. Every output format (CSS, Tailwind, JSON, TS) is generated from one source instead of hand maintained separately.

- **Perceptual OKLCH color scales.** Colors are generated in OKLCH using [Culori](https://culorijs.org/), 12 steps per scale with contrast that progresses uniformly instead of me eyeballing it.
- **Automated WCAG contrast solver.** Solid steps (buttons, badges) get run through the solver at build time to enforce a 4.5:1 minimum on text fills, in both light and dark mode. If an accent doesn't clear it, the emitter adjusts the foreground token instead of me catching it later.
- **Multi target emitters.** One source of truth outputs CSS variables (`--uw-*`), a Tailwind v4 `@theme inline` config, DTCG JSON, and typed TS constants.
- **Zero FOUC theme manager.** Handles `light` / `dark` / `system` preferences synced across tabs via `localStorage`. There's also a Vite plugin that kills the flash of unstyled content on first paint.

## Why was this made?

I kept rebuilding the same buttons, cards and color logic for every project on the unwreck roadmap, and it was never consistent. Slightly different grays each time, no shared source of truth, contrast I never actually verified.

My internship's internal `vue-core` package is where the idea came from, but I wanted something framework agnostic from the start since not everything I build is Vue.

The real reason though was accessibility. I got tired of manually checking contrast ratios every time I picked a new accent color. Baking the contrast solver into the generator means I pick an anchor color once and the system guarantees the rest is readable.

---

## Distribution Targets

All artifacts are built into `packages/core/dist`:

| Target            | Import Path                 | Output File          | Description                                                            |
| :---------------- | :-------------------------- | :------------------- | :--------------------------------------------------------------------- |
| **CSS Variables** | `@unwreck/core/css`         | `dist/tokens.css`    | `:root`, `[data-theme="light"]`, and `[data-theme="dark"]` tokens.     |
| **Tailwind v4**   | `@unwreck/core/tailwind`    | `dist/tailwind.css`  | `@theme inline` mappings and dark mode variant.                        |
| **CSS Reset**     | `@unwreck/core/reset`       | `dist/reset.css`     | Modern CSS reset with reduced motion defaults.                         |
| **Fonts**         | `@unwreck/core/fonts.css`   | `dist/fonts/all.css` | Self hosted variable fonts with zero layout shift fallbacks.           |
| **TypeScript**    | `@unwreck/core`             | `dist/index.js`      | Strongly typed token values, `cssVar()` helper, and `TokenName` union. |
| **Theme Runtime** | `@unwreck/core/theme`       | `dist/theme.js`      | Theme preference getter/setter, listeners, and DOM reader.             |
| **Vite Plugin**   | `@unwreck/core/vite`        | `dist/vite.js`       | Injects blocking theme initialization script into `<head>`.            |
| **DTCG JSON**     | `@unwreck/core/tokens.json` | `dist/tokens.json`   | Standard W3C Design Tokens Community Group JSON format.                |

---

## Getting Started

### 1. Installation

```bash
pnpm add @unwreck/core
# or
npm install @unwreck/core
```

### 2. CSS Setup

Import the reset, fonts and token variables into your application entrypoint:

```ts
import "@unwreck/core/reset";
import "@unwreck/core/fonts.css";
import "@unwreck/core/css";
```

Or via plain CSS:

```css
@import "@unwreck/core/reset";
@import "@unwreck/core/fonts.css";
@import "@unwreck/core/css";
```

### 3. Tailwind CSS v4 Setup

If you're using Tailwind v4, import the theme definition in your main stylesheet:

```css
@import "tailwindcss";
@import "@unwreck/core/css";
@import "@unwreck/core/tailwind";
```

This registers all token aliases under `--color-*`, `--radius-*`, `--font-*`, and gives you the `@custom-variant dark` matching `[data-theme="dark"]`.

### 4. Vite Plugin (Prevent Flash of Unstyled Theme)

In `vite.config.ts`, add the `unwreck` plugin to inject a synchronous theme resolver into the HTML `<head>` before render:

```ts
import { defineConfig } from "vite";
import { unwreck } from "@unwreck/core/vite";

export default defineConfig({
  plugins: [unwreck()],
});
```

---

## Token Subsystems

### 1. Color Engine

The color system is built from 6 primary scales. Each scale defines light and dark modes across 12 perceptual steps:

- **`brand`** (Anchor: `#439124`): Primary brand accents.
- **`neutral`** (Derived from brand with low chroma): Warm, brand tinted structural grays.
- **`success`** (Anchor: `#12A150`): Positive states and confirmations (guaranteed dark text on solid).
- **`warning`** (Anchor: `#D9A000`): Cautions and alerts (guaranteed dark text on solid).
- **`danger`** (Anchor: `#D62C2C`): Errors and destructive actions (guaranteed light text on solid).
- **`info`** (Anchor: `#2E7FD4`): Informational highlights and guidance.

#### The 12-Step Scale Roles

|  Step  | Role                     | Intended Usage                                                                                 |
| :----: | :----------------------- | :--------------------------------------------------------------------------------------------- |
| **1**  | App Canvas Background    | Base page background (`--uw-bg-canvas`)                                                        |
| **2**  | Subtle Background        | Code wells, hovered canvas (`--uw-bg-subtle`)                                                  |
| **3**  | Component Surface        | Cards, panels, input backgrounds (`--uw-bg-surface`, `*-bg`)                                   |
| **4**  | Component Surface Hover  | Hover state for cards and subtle buttons (`*-bg-hover`)                                        |
| **5**  | Component Surface Active | Active/pressed state for subtle elements (`--uw-bg-surface-active`)                            |
| **6**  | Subtle Border            | Low contrast dividers and separators (`--uw-border-subtle`)                                    |
| **7**  | Component Border         | Standard inputs, card outlines, checkboxes (`--uw-border-default`, `*-border`)                 |
| **8**  | Strong Border            | Hovered borders, active input outlines (`--uw-border-strong`)                                  |
| **9**  | Solid Accent             | Primary buttons, filled badges (`*-solid`), guaranteed 4.5:1 minimum against `*-on-solid`      |
| **10** | Solid Accent Hover       | Hovered state for primary buttons (`*-solid-hover`)                                            |
| **11** | High-Contrast Text       | Colored badges, link text, labels (`*-fg`), guaranteed 4.5:1 minimum against steps 1 to 3      |
| **12** | Maximum-Contrast Text    | Primary body text, headings (`--uw-fg-default`), guaranteed 7.0:1 minimum against steps 1 to 2 |

#### Universal Accent Pattern (7 Tokens per Scale)

Every color scale exposes the same 7 token component API:

```css
var(--uw-{scale}-bg)          /* Step 3: subtle component background */
var(--uw-{scale}-bg-hover)    /* Step 4: subtle background hover */
var(--uw-{scale}-border)      /* Step 7: interactive border */
var(--uw-{scale}-solid)       /* Step 9: solid fill */
var(--uw-{scale}-solid-hover) /* Step 10: solid fill hover */
var(--uw-{scale}-fg)          /* Step 11: readable text on subtle surfaces */
var(--uw-{scale}-on-solid)    /* Solved accessible text on solid fill */
```

### 2. Typography & Fonts

Three self hosted variable font families, with fallback metric overrides (`ascent-override`, `descent-override`, `size-adjust`) pre calculated so there's no layout shift:

- **Sans:** Inter (`--uw-font-sans`)
- **Display:** Bricolage Grotesque (`--uw-font-display`)
- **Mono:** JetBrains Mono (`--uw-font-mono`)

Font sizes from `2xl` through `6xl` use fluid viewport clamping (`clamp(...)`) so they scale smoothly between mobile and desktop.

### 3. Spacing & Radius

- **Space:** 4px grid (`1` = 0.25rem, `2` = 0.5rem, up to `48` = 12rem, plus `px` and `0-5`).
- **Radius:** `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`.

### 4. Elevation & Shadows

Shadows (`sm`, `md`, `lg`) are dynamically tinted in OKLCH using the neutral scale's hue. Light mode gets soft multi layer shadows, dark mode gets deeper black based ones with higher opacity.

### 5. Motion

- **Durations:** `instant` (0ms), `fast` (100ms), `normal` (200ms), `slow` (300ms), `slower` (400ms).
- **Easings:** `standard`, `emphasized`, `decelerate`, `accelerate`.

---

## Runtime Theme API

The theme runtime manages theme preferences and syncs changes across browser tabs:

```ts
import {
  getPreference,
  setTheme,
  resolve,
  subscribe,
  readToken,
} from "@unwreck/core/theme";

// Get user preference: 'light' | 'dark' | 'system'
const pref = getPreference();

// Set preference (stored in localStorage under 'uw-theme')
setTheme("dark");

// Resolve current theme against system preference: 'light' | 'dark'
const activeTheme = resolve();

// Subscribe to changes (syncs across tabs and system OS switches)
const unsubscribe = subscribe((newTheme) => {
  console.log("Active theme changed to:", newTheme);
});

// Read computed CSS variable from the DOM
const primaryColor = readToken("brand-solid");
```

---

## Development & Build

This repository is a monorepo managed with `pnpm`.

```bash
# Install dependencies
pnpm install

# Run contrast test suite (verifies WCAG AA/AAA invariants)
pnpm test

# Generate token files and bundle packages
pnpm run build
```

---

## NPM Registry

This is a real published npm package, not something you have to clone and build yourself.

Package page: [@unwreck/core on npm](https://www.npmjs.com/package/@unwreck/core)

Check there for the current version and the full list of exported subpaths (`/css`, `/tailwind`, `/reset`, `/fonts.css`, `/theme`, `/vite`, `/tokens.json`). If you're consuming this in another unwreck project, pin to a specific version instead of `latest` for now. Early releases might still shift step values as I tune the contrast solver.
