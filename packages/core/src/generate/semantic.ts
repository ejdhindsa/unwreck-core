// 7-token accent mapping exposed on every color scale (buttons, badges, alerts)
export const accentPattern = {
  bg: 3,
  'bg-hover': 4,
  border: 7,
  solid: 9,
  'solid-hover': 10,
  fg: 11,
  'on-solid': 'ink',
} as const

const base = {
  // Surfaces
  'bg-canvas': 'neutral.1',
  'bg-subtle': 'neutral.2',
  'bg-surface': 'neutral.3',
  'bg-surface-hover': 'neutral.4',
  'bg-surface-active': 'neutral.5',
  'bg-overlay': 'neutral.1',

  // Text
  'fg-heading': 'neutral.12',
  'fg-default': 'neutral.12',
  'fg-muted': 'neutral.11',
  'fg-subtle': 'neutral.11',
  'fg-disabled': 'neutral.10',
  'fg-link': 'brand.11',
  'fg-link-hover': 'brand.12',

  // Borders
  'border-subtle': 'neutral.6',
  'border-default': 'neutral.7',
  'border-strong': 'neutral.8',

  // Interaction
  'focus-ring': 'brand.9',
} as const

export const semanticLight = { ...base }
export const semanticDark = { ...base }
export type SemanticName = keyof typeof base
