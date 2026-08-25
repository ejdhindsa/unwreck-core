import { wcagContrast } from 'culori'
import { describe, expect, it } from 'vitest'
import { ink, resolve, scaleNames, step, THEMES, type Theme } from '../src/generate/resolve'

const calculateContrastRatio = (foregroundColor: string, backgroundColor: string): number => {
  const contrastRatio = wcagContrast(foregroundColor, backgroundColor)

  if (contrastRatio === undefined) {
    throw new Error(
      `Failed to calculate contrast for the pair: ${foregroundColor} over ${backgroundColor}`,
    )
  }

  return contrastRatio
}

describe.each(THEMES)('scale invariants (%s)', (activeTheme: Theme) => {
  it.each(scaleNames)('%s', (scaleName) => {
    const getStepValue = (stepNumber: number) => step(scaleName, stepNumber, activeTheme)

    for (const backgroundStep of [1, 2, 3]) {
      expect(
        calculateContrastRatio(getStepValue(11), getStepValue(backgroundStep)),
      ).toBeGreaterThanOrEqual(4.5)
    }

    for (const backgroundStep of [1, 2]) {
      expect(
        calculateContrastRatio(getStepValue(12), getStepValue(backgroundStep)),
      ).toBeGreaterThanOrEqual(7)
    }

    expect(
      calculateContrastRatio(ink(scaleName, activeTheme), getStepValue(9)),
    ).toBeGreaterThanOrEqual(4.5)
  })
})

describe.each(THEMES)('semantic pairings (%s)', (activeTheme: Theme) => {
  const BACKGROUND_TOKENS = ['bg-canvas', 'bg-subtle', 'bg-surface'] as const
  const FOREGROUND_TOKENS = [
    'fg-heading',
    'fg-default',
    'fg-muted',
    'fg-subtle',
    'fg-link',
  ] as const

  it.each(FOREGROUND_TOKENS)('%s clears AA on every text background', (foregroundToken) => {
    for (const backgroundToken of BACKGROUND_TOKENS) {
      const resolvedForeground = resolve(foregroundToken, activeTheme)
      const resolvedBackground = resolve(backgroundToken, activeTheme)

      expect(calculateContrastRatio(resolvedForeground, resolvedBackground)).toBeGreaterThanOrEqual(
        4.5,
      )
    }
  })

  it('focus-ring clears WCAG 1.4.11 against the canvas', () => {
    const resolvedFocusRing = resolve('focus-ring', activeTheme)
    const resolvedCanvas = resolve('bg-canvas', activeTheme)

    expect(calculateContrastRatio(resolvedFocusRing, resolvedCanvas)).toBeGreaterThanOrEqual(3)
  })

  it.each(scaleNames)('%s accent pattern is self-consistent', (scaleName) => {
    const resolvedAccentForeground = resolve(`${scaleName}-fg`, activeTheme)
    const resolvedAccentBackground = resolve(`${scaleName}-bg`, activeTheme)

    const resolvedSolidText = resolve(`${scaleName}-on-solid`, activeTheme)
    const resolvedSolidBackground = resolve(`${scaleName}-solid`, activeTheme)

    expect(
      calculateContrastRatio(resolvedAccentForeground, resolvedAccentBackground),
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      calculateContrastRatio(resolvedSolidText, resolvedSolidBackground),
    ).toBeGreaterThanOrEqual(4.5)
  })
})

describe('resolution error handling', () => {
  it('throws when resolving unknown semantic token', () => {
    expect(() => resolve('nonexistent-token')).toThrow(/Unknown token "nonexistent-token"/)
  })
})
