/**
 * Universal step mapping for colored components (badges, buttons, alerts).
 * Every semantic scale (danger, success, etc.) receives these exact 7 tokens
 * so component logic remains scale-agnostic.
 */
export const accentPattern = {
  /** background for subtle elements (e.g., `var(--uw-danger-bg)`) */
  bg: 3,
  /** hover state for subtle backgrounds */
  'bg-hover': 4,
  /** interactive component borders (e.g., `var(--uw-danger-border)`) */
  border: 7,
  /** solid filled backgrounds, typically primary buttons (e.g., `var(--uw-danger-solid)`) */
  solid: 9,
  /** hover state for solid filled backgrounds */
  'solid-hover': 10,
  /** high-contrast text on subtle backgrounds or canvases (e.g., `var(--uw-danger-fg)`) */
  fg: 11,
  /** the mathematically solved accessible text color meant to sit on top of the `solid` step */
  'on-solid': 'ink',
} as const

/**
 * Core semantic token mapping.
 * Maps structural UI roles to specific steps on the generated primitive color scales.
 */
const base = {
  // ==========================================
  // SURFACES
  // ==========================================

  /** The foundational page background. */
  'bg-canvas': 'neutral.1',
  /** Slightly elevated backgrounds: wells, striped rows, code blocks. */
  'bg-subtle': 'neutral.2',
  /** Standard component backgrounds: cards, panels, inputs. */
  'bg-surface': 'neutral.3',
  /** Hover state for standard component backgrounds. */
  'bg-surface-hover': 'neutral.4',
  /** Active/Pressed state for standard component backgrounds. */
  'bg-surface-active': 'neutral.5',
  /** Top-level overlays: modals, popovers, dropdowns. */
  'bg-overlay': 'neutral.1',

  // ==========================================
  // TEXT
  // ==========================================

  /** Primary headings (h1–h6). Aliased to `fg-default` for easy decoupling later. */
  'fg-heading': 'neutral.12',
  /** Standard body copy. */
  'fg-default': 'neutral.12',
  /** Secondary text, captions, and field labels. */
  'fg-muted': 'neutral.11',
  /** Placeholders and timestamps. */
  'fg-subtle': 'neutral.11',
  /** Genuinely disabled controls */
  'fg-disabled': 'neutral.10',
  /** Interactive text links. */
  'fg-link': 'brand.11',
  /** Hover state for interactive text links. */
  'fg-link-hover': 'brand.12',

  // ==========================================
  // LINES
  // ==========================================

  /** Low-contrast separators and internal dividers. */
  'border-subtle': 'neutral.6',
  /** Standard borders for inputs, checkboxes, and card outlines. */
  'border-default': 'neutral.7',
  /** Emphasized borders or hover states for interactive inputs. */
  'border-strong': 'neutral.8',

  // ==========================================
  // INTERACTION
  // ==========================================

  /** Keyboard navigation focus rings. */
  'focus-ring': 'brand.9',
} as const

export const semanticLight = { ...base }
export const semanticDark = { ...base }
export type SemanticName = keyof typeof base
