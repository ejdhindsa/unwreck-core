export type TokenName =
  | 'bg-canvas'
  | 'bg-subtle'
  | 'bg-surface'
  | 'bg-surface-hover'
  | 'bg-surface-active'
  | 'bg-overlay'
  | 'fg-heading'
  | 'fg-default'
  | 'fg-muted'
  | 'fg-subtle'
  | 'fg-disabled'
  | 'fg-link'
  | 'fg-link-hover'
  | 'border-subtle'
  | 'border-default'
  | 'border-strong'
  | 'focus-ring'
  | 'neutral-bg'
  | 'neutral-bg-hover'
  | 'neutral-border'
  | 'neutral-solid'
  | 'neutral-solid-hover'
  | 'neutral-fg'
  | 'neutral-on-solid'
  | 'brand-bg'
  | 'brand-bg-hover'
  | 'brand-border'
  | 'brand-solid'
  | 'brand-solid-hover'
  | 'brand-fg'
  | 'brand-on-solid'
  | 'success-bg'
  | 'success-bg-hover'
  | 'success-border'
  | 'success-solid'
  | 'success-solid-hover'
  | 'success-fg'
  | 'success-on-solid'
  | 'warning-bg'
  | 'warning-bg-hover'
  | 'warning-border'
  | 'warning-solid'
  | 'warning-solid-hover'
  | 'warning-fg'
  | 'warning-on-solid'
  | 'danger-bg'
  | 'danger-bg-hover'
  | 'danger-border'
  | 'danger-solid'
  | 'danger-solid-hover'
  | 'danger-fg'
  | 'danger-on-solid'
  | 'info-bg'
  | 'info-bg-hover'
  | 'info-border'
  | 'info-solid'
  | 'info-solid-hover'
  | 'info-fg'
  | 'info-on-solid'
  | 'space-0'
  | 'space-1'
  | 'space-2'
  | 'space-3'
  | 'space-4'
  | 'space-5'
  | 'space-6'
  | 'space-8'
  | 'space-10'
  | 'space-12'
  | 'space-16'
  | 'space-20'
  | 'space-24'
  | 'space-32'
  | 'space-40'
  | 'space-48'
  | 'space-px'
  | 'space-0-5'
  | 'radius-none'
  | 'radius-xs'
  | 'radius-sm'
  | 'radius-md'
  | 'radius-lg'
  | 'radius-xl'
  | 'radius-2xl'
  | 'radius-full'
  | 'shadow-sm'
  | 'shadow-md'
  | 'shadow-lg'
  | 'duration-instant'
  | 'duration-fast'
  | 'duration-normal'
  | 'duration-slow'
  | 'duration-slower'
  | 'easing-standard'
  | 'easing-emphasized'
  | 'easing-decelerate'
  | 'easing-accelerate'
  | 'font-size-xs'
  | 'font-size-sm'
  | 'font-size-base'
  | 'font-size-lg'
  | 'font-size-xl'
  | 'font-size-2xl'
  | 'font-size-3xl'
  | 'font-size-4xl'
  | 'font-size-5xl'
  | 'font-size-6xl'

export function cssVar(token: TokenName): string {
  return `var(--uw-${token})`
}

export const tokens = {
  color: {
    light: {
      'bg-canvas': 'oklch(0.994 0.0004 138.4873)',
      'bg-subtle': 'oklch(0.98 0.0007 138.4873)',
      'bg-surface': 'oklch(0.956 0.0013 138.4873)',
      'bg-surface-hover': 'oklch(0.933 0.0019 138.4873)',
      'bg-surface-active': 'oklch(0.908 0.0023 138.4873)',
      'bg-overlay': 'oklch(0.994 0.0004 138.4873)',
      'fg-heading': 'oklch(0.305 0.0037 138.4873)',
      'fg-default': 'oklch(0.305 0.0037 138.4873)',
      'fg-muted': 'oklch(0.47 0.0071 138.4873)',
      'fg-subtle': 'oklch(0.47 0.0071 138.4873)',
      'fg-disabled': 'oklch(0.5202 0.0089 138.4873)',
      'fg-link': 'oklch(0.47 0.1293 138.4873)',
      'fg-link-hover': 'oklch(0.305 0.0679 138.4873)',
      'border-subtle': 'oklch(0.88 0.0028 138.4873)',
      'border-default': 'oklch(0.842 0.0034 138.4873)',
      'border-strong': 'oklch(0.78 0.0049 138.4873)',
      'focus-ring': 'oklch(0.5952 0.1616 138.4873)',
      'neutral-bg': 'oklch(0.956 0.0013 138.4873)',
      'neutral-bg-hover': 'oklch(0.933 0.0019 138.4873)',
      'neutral-border': 'oklch(0.842 0.0034 138.4873)',
      'neutral-solid': 'oklch(0.5652 0.0089 138.4873)',
      'neutral-solid-hover': 'oklch(0.5202 0.0089 138.4873)',
      'neutral-fg': 'oklch(0.47 0.0071 138.4873)',
      'neutral-on-solid': 'oklch(1 0 0)',
      'brand-bg': 'oklch(0.956 0.0242 138.4873)',
      'brand-bg-hover': 'oklch(0.933 0.0339 138.4873)',
      'brand-border': 'oklch(0.842 0.0614 138.4873)',
      'brand-solid': 'oklch(0.5952 0.1616 138.4873)',
      'brand-solid-hover': 'oklch(0.5502 0.1616 138.4873)',
      'brand-fg': 'oklch(0.47 0.1293 138.4873)',
      'brand-on-solid': 'oklch(0.22 0.0566 138.4873)',
      'success-bg': 'oklch(0.956 0.0244 151.0472)',
      'success-bg-hover': 'oklch(0.933 0.0342 151.0472)',
      'success-border': 'oklch(0.842 0.0618 151.0472)',
      'success-solid': 'oklch(0.6221 0.1627 151.0472)',
      'success-solid-hover': 'oklch(0.5771 0.155 151.0472)',
      'success-fg': 'oklch(0.47 0.1263 151.0472)',
      'success-on-solid': 'oklch(0.22 0.0569 151.0472)',
      'warning-bg': 'oklch(0.956 0.0228 82.8806)',
      'warning-bg-hover': 'oklch(0.933 0.032 82.8806)',
      'warning-border': 'oklch(0.842 0.0578 82.8806)',
      'warning-solid': 'oklch(0.7399 0.1522 82.8806)',
      'warning-solid-hover': 'oklch(0.6949 0.1429 82.8806)',
      'warning-fg': 'oklch(0.47 0.0967 82.8806)',
      'warning-on-solid': 'oklch(0.22 0.0452 82.8806)',
      'danger-bg': 'oklch(0.956 0.0218 26.7314)',
      'danger-bg-hover': 'oklch(0.933 0.0338 26.7314)',
      'danger-border': 'oklch(0.842 0.0781 26.7314)',
      'danger-solid': 'oklch(0.5708 0.2054 26.7314)',
      'danger-solid-hover': 'oklch(0.5258 0.2054 26.7314)',
      'danger-fg': 'oklch(0.47 0.1643 26.7314)',
      'danger-on-solid': 'oklch(1 0 0)',
      'info-bg': 'oklch(0.956 0.0214 252.825)',
      'info-bg-hover': 'oklch(0.933 0.0318 252.825)',
      'info-border': 'oklch(0.842 0.0575 252.825)',
      'info-solid': 'oklch(0.5656 0.1513 252.825)',
      'info-solid-hover': 'oklch(0.5206 0.1513 252.825)',
      'info-fg': 'oklch(0.47 0.1211 252.825)',
      'info-on-solid': 'oklch(1 0 0)',
    },
    dark: {
      'bg-canvas': 'oklch(0.178 0.0006 138.4873)',
      'bg-subtle': 'oklch(0.213 0.001 138.4873)',
      'bg-surface': 'oklch(0.256 0.0017 138.4873)',
      'bg-surface-hover': 'oklch(0.29 0.0022 138.4873)',
      'bg-surface-active': 'oklch(0.323 0.0026 138.4873)',
      'bg-overlay': 'oklch(0.178 0.0006 138.4873)',
      'fg-heading': 'oklch(0.948 0.0025 138.4873)',
      'fg-default': 'oklch(0.948 0.0025 138.4873)',
      'fg-muted': 'oklch(0.77 0.0064 138.4873)',
      'fg-subtle': 'oklch(0.77 0.0064 138.4873)',
      'fg-disabled': 'oklch(0.6102 0.0089 138.4873)',
      'fg-link': 'oklch(0.77 0.1164 138.4873)',
      'fg-link-hover': 'oklch(0.948 0.0453 138.4873)',
      'border-subtle': 'oklch(0.365 0.003 138.4873)',
      'border-default': 'oklch(0.428 0.0037 138.4873)',
      'border-strong': 'oklch(0.54 0.0052 138.4873)',
      'focus-ring': 'oklch(0.5952 0.1616 138.4873)',
      'neutral-bg': 'oklch(0.256 0.0017 138.4873)',
      'neutral-bg-hover': 'oklch(0.29 0.0022 138.4873)',
      'neutral-border': 'oklch(0.428 0.0037 138.4873)',
      'neutral-solid': 'oklch(0.5652 0.0089 138.4873)',
      'neutral-solid-hover': 'oklch(0.6102 0.0089 138.4873)',
      'neutral-fg': 'oklch(0.77 0.0064 138.4873)',
      'neutral-on-solid': 'oklch(1 0 0)',
      'brand-bg': 'oklch(0.256 0.0307 138.4873)',
      'brand-bg-hover': 'oklch(0.29 0.0404 138.4873)',
      'brand-border': 'oklch(0.428 0.0679 138.4873)',
      'brand-solid': 'oklch(0.5952 0.1616 138.4873)',
      'brand-solid-hover': 'oklch(0.6402 0.1616 138.4873)',
      'brand-fg': 'oklch(0.77 0.1164 138.4873)',
      'brand-on-solid': 'oklch(0.22 0.0566 138.4873)',
      'success-bg': 'oklch(0.256 0.0309 151.0472)',
      'success-bg-hover': 'oklch(0.29 0.0407 151.0472)',
      'success-border': 'oklch(0.428 0.0683 151.0472)',
      'success-solid': 'oklch(0.6221 0.1627 151.0472)',
      'success-solid-hover': 'oklch(0.6671 0.1627 151.0472)',
      'success-fg': 'oklch(0.77 0.1172 151.0472)',
      'success-on-solid': 'oklch(0.22 0.0569 151.0472)',
      'warning-bg': 'oklch(0.256 0.0289 82.8806)',
      'warning-bg-hover': 'oklch(0.29 0.038 82.8806)',
      'warning-border': 'oklch(0.428 0.0639 82.8806)',
      'warning-solid': 'oklch(0.7399 0.1522 82.8806)',
      'warning-solid-hover': 'oklch(0.7849 0.1522 82.8806)',
      'warning-fg': 'oklch(0.77 0.1096 82.8806)',
      'warning-on-solid': 'oklch(0.22 0.0452 82.8806)',
      'danger-bg': 'oklch(0.256 0.039 26.7314)',
      'danger-bg-hover': 'oklch(0.29 0.0513 26.7314)',
      'danger-border': 'oklch(0.428 0.0863 26.7314)',
      'danger-solid': 'oklch(0.5708 0.2054 26.7314)',
      'danger-solid-hover': 'oklch(0.6158 0.2054 26.7314)',
      'danger-fg': 'oklch(0.77 0.1357 26.7314)',
      'danger-on-solid': 'oklch(1 0 0)',
      'info-bg': 'oklch(0.256 0.0288 252.825)',
      'info-bg-hover': 'oklch(0.29 0.0378 252.825)',
      'info-border': 'oklch(0.428 0.0636 252.825)',
      'info-solid': 'oklch(0.5656 0.1513 252.825)',
      'info-solid-hover': 'oklch(0.6106 0.1513 252.825)',
      'info-fg': 'oklch(0.77 0.1089 252.825)',
      'info-on-solid': 'oklch(1 0 0)',
    },
  },
  space: {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '40': '10rem',
    '48': '12rem',
    px: '1px',
    '0-5': '0.125rem',
  },
  radius: {
    none: '0',
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadow: {
    light: {
      sm: '0 1px 2px 0 oklch(0.20 0.02 138.49 / 0.06)',
      md: '0 2px 4px -1px oklch(0.20 0.02 138.49 / 0.08), 0 4px 12px -2px oklch(0.20 0.02 138.49 / 0.06)',
      lg: '0 8px 24px -4px oklch(0.20 0.02 138.49 / 0.12)',
    },
    dark: {
      sm: '0 1px 2px 0 oklch(0 0 0 / 0.4)',
      md: '0 2px 4px -1px oklch(0 0 0 / 0.5), 0 4px 12px -2px oklch(0 0 0 / 0.4)',
      lg: '0 8px 24px -4px oklch(0 0 0 / 0.6)',
    },
  },
} as const

export type Tokens = typeof tokens
