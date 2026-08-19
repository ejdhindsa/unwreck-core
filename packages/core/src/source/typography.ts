const MIN_VW = 25 // rem — 400px
const MAX_VW = 80 // rem — 1280px

const fluid = (min: number, max: number) => {
  const slope = (max - min) / (MAX_VW - MIN_VW)
  const intercept = min - slope * MIN_VW
  return `clamp(${min}rem, ${intercept.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${max}rem)`
}

export const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': fluid(1.5, 1.75),
  '3xl': fluid(1.875, 2.25),
  '4xl': fluid(2.25, 3),
  '5xl': fluid(3, 4),
  '6xl': fluid(3.75, 5),
}

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

export const lineHeight = {
  none: '1',
  tight: '1.15',
  snug: '1.3',
  normal: '1.55',
  relaxed: '1.75',
}

export const letterSpacing = {
  tighter: '-0.03em',
  tight: '-0.015em',
  normal: '0',
  wide: '0.02em',
  wider: '0.06em',
}
