import { scales } from '../source/color'
import { breakpoint, z } from '../source/layout'
import { duration, easing } from '../source/motion'
import { radius } from '../source/radius'
import { shadow } from '../source/shadow'
import { space } from '../source/space'
import { fontSize, fontWeight, letterSpacing, lineHeight } from '../source/typography'
import { accentPattern, semanticDark, semanticLight } from './semantic'

export type Theme = 'light' | 'dark'
export const THEMES = ['light', 'dark'] as const

export type ScaleName = keyof typeof scales
export const scaleNames = Object.keys(scales) as ScaleName[]

export const patternScales = scaleNames

export const neutralHue = Math.round(scales.neutral.hue * 100) / 100

const roundDecimals = (cssValue: string): string => {
  return cssValue.replace(/\d+\.\d+/g, (matched) => {
    return String(Math.round(Number(matched) * 10000) / 10000)
  })
}

function getScale(scaleName: string) {
  const scale = (scales as Record<string, (typeof scales)[ScaleName] | undefined>)[scaleName]

  if (!scale) {
    throw new Error(`Unknown scale "${scaleName}". Available scales are: ${scaleNames.join(', ')}`)
  }

  return scale
}

export function step(scaleName: string, stepNumber: number, theme: Theme): string {
  const scaleRamp = theme === 'light' ? getScale(scaleName).light : getScale(scaleName).dark

  const stepValue = scaleRamp[stepNumber - 1]

  if (!stepValue) {
    throw new Error(`Scale "${scaleName}" does not have step ${stepNumber} (expected 1–12).`)
  }

  return roundDecimals(stepValue)
}

export function ink(scaleName: string, theme: Theme): string {
  const colorScale = getScale(scaleName)
  const solidColor = theme === 'light' ? colorScale.onSolidLight : colorScale.onSolidDark

  return roundDecimals(solidColor)
}

const getSemanticMap = (theme: Theme): Record<string, string> => {
  return theme === 'light' ? semanticLight : semanticDark
}

export const baseSemanticNames: string[] = Object.keys(semanticLight)

export const accentSuffixes = Object.keys(accentPattern) as (keyof typeof accentPattern)[]

export const accentTokenNames: string[] = patternScales.flatMap((scale) => {
  return accentSuffixes.map((suffix) => `${scale}-${suffix}`)
})

export const semanticNames: string[] = [...baseSemanticNames, ...accentTokenNames]

export function resolve(tokenName: string, theme: Theme = 'light'): string {
  const mapReference = getSemanticMap(theme)[tokenName]

  if (mapReference) {
    const [scaleName, stepNumber] = mapReference.split('.')
    const parsedStep = Number(stepNumber)
    if (!scaleName || !stepNumber || Number.isNaN(parsedStep)) {
      throw new Error(
        `Invalid semantic mapping "${mapReference}" for token "${tokenName}" (expected format: "scale.step").`,
      )
    }
    return step(scaleName, parsedStep, theme)
  }

  // Accent patterns resolve as [scale]-[suffix] (e.g. brand-solid).
  // Base semantic tokens (bg-*, fg-*, border-*) are resolved first via getSemanticMap above.
  const firstDashIndex = tokenName.indexOf('-')

  if (firstDashIndex > 0) {
    const parsedScale = tokenName.slice(0, firstDashIndex)
    const parsedSuffix = tokenName.slice(firstDashIndex + 1)

    const isValidScale = scaleNames.includes(parsedScale as ScaleName)
    const isValidSuffix = parsedSuffix in accentPattern

    if (isValidScale && isValidSuffix) {
      const targetStep = accentPattern[parsedSuffix as keyof typeof accentPattern]

      if (targetStep === 'ink') {
        return ink(parsedScale, theme)
      }
      return step(parsedScale, targetStep, theme)
    }
  }

  throw new Error(`Unknown token "${tokenName}".`)
}

export function primitiveColorVars(theme: Theme): Record<string, string> {
  const variables: Record<string, string> = {}

  for (const scaleName of scaleNames) {
    for (let stepNumber = 1; stepNumber <= 12; stepNumber++) {
      variables[`--uw-${scaleName}-${stepNumber}`] = step(scaleName, stepNumber, theme)
    }
  }

  return variables
}

export function shadowVars(theme: Theme): Record<string, string> {
  const activeShadows = shadow(neutralHue)[theme]

  return {
    '--uw-shadow-sm': activeShadows.sm,
    '--uw-shadow-md': activeShadows.md,
    '--uw-shadow-lg': activeShadows.lg,
  }
}

const addPrefix = (prefix: string, tokens: Record<string, string>): Record<string, string> => {
  const entries = Object.entries(tokens).map(([key, value]) => {
    return [`--uw-${prefix}-${key}`, value]
  })

  return Object.fromEntries(entries)
}

export function staticVars(): Record<string, string> {
  return {
    ...addPrefix('space', space),
    ...addPrefix('radius', radius),
    ...addPrefix('font-size', fontSize),
    ...addPrefix('font-weight', fontWeight),
    ...addPrefix('line-height', lineHeight),
    ...addPrefix('letter-spacing', letterSpacing),
    ...addPrefix('duration', duration),
    ...addPrefix('easing', easing),
    ...addPrefix('breakpoint', breakpoint),
    ...addPrefix('z', z),
  }
}

export function semanticVars(theme: Theme): Record<string, string> {
  const variables: Record<string, string> = {}

  // e.g. --uw-fg-muted: var(--uw-neutral-11)
  for (const [tokenName, mapReference] of Object.entries(getSemanticMap(theme))) {
    const [scaleName, stepNumber] = mapReference.split('.')
    variables[`--uw-${tokenName}`] = `var(--uw-${scaleName}-${stepNumber})`
  }

  for (const scaleName of patternScales) {
    for (const suffix of accentSuffixes) {
      const targetStep = accentPattern[suffix]

      variables[`--uw-${scaleName}-${suffix}`] =
        targetStep === 'ink' ? ink(scaleName, theme) : `var(--uw-${scaleName}-${targetStep})`
    }
  }

  return variables
}

export function tokenNames(): string[] {
  const nonColorTokens = [
    ...Object.keys(space).map((key) => `space-${key}`),
    ...Object.keys(radius).map((key) => `radius-${key}`),
    ...['shadow-sm', 'shadow-md', 'shadow-lg'],
    ...Object.keys(duration).map((key) => `duration-${key}`),
    ...Object.keys(easing).map((key) => `easing-${key}`),
    ...Object.keys(fontSize).map((key) => `font-size-${key}`),
  ]

  return [...semanticNames, ...nonColorTokens]
}
