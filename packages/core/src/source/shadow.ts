export const shadow = (hue: number) => ({
  light: {
    sm: `0 1px 2px 0 oklch(0.20 0.02 ${hue} / 0.06)`,
    md: `0 2px 4px -1px oklch(0.20 0.02 ${hue} / 0.08), 0 4px 12px -2px oklch(0.20 0.02 ${hue} / 0.06)`,
    lg: `0 8px 24px -4px oklch(0.20 0.02 ${hue} / 0.12)`,
  },
  dark: {
    sm: '0 1px 2px 0 oklch(0 0 0 / 0.4)',
    md: '0 2px 4px -1px oklch(0 0 0 / 0.5), 0 4px 12px -2px oklch(0 0 0 / 0.4)',
    lg: '0 8px 24px -4px oklch(0 0 0 / 0.6)',
  },
})
