import { clampChroma, converter, formatCss, type Oklch, wcagContrast } from 'culori'

const toOklch = converter('oklch')

// Lightness and Chroma scale templates for Light Mode
const LIGHTNESS_SCALE_LIGHT = [
  0.994,
  0.98,
  0.956,
  0.933,
  0.908,
  0.88,
  0.842,
  0.78,
  null,
  null,
  0.47,
  0.305,
]
const CHROMA_SCALE_LIGHT = [0.04, 0.08, 0.15, 0.21, 0.26, 0.31, 0.38, 0.55, 1.0, 1.0, 0.8, 0.42]

// Lightness and Chroma scale templates for Dark Mode
const LIGHTNESS_SCALE_DARK = [
  0.178,
  0.213,
  0.256,
  0.29,
  0.323,
  0.365,
  0.428,
  0.54,
  null,
  null,
  0.77,
  0.948,
]
const CHROMA_SCALE_DARK = [0.07, 0.11, 0.19, 0.25, 0.29, 0.34, 0.42, 0.58, 1.0, 1.0, 0.72, 0.28]

// How much lightness to add/subtract for hover states (index 9 in the scale)
const HOVER_DELTA = { light: -0.045, dark: +0.045 } as const

const WHITE_COLOR: Oklch = { mode: 'oklch', l: 1, c: 0, h: 0 }

const fitColorToRgb = (lightness: number, chroma: number, hue: number) =>
  clampChroma({ mode: 'oklch', l: lightness, c: chroma, h: hue }, 'oklch', 'rgb') as Oklch

export interface ScaleInput {
  anchor: string
  darkAnchor?: string
  onSolid?: 'light' | 'dark' | 'auto'
  chromaScale?: number
}

interface ContrastResult {
  lightness: number
  solidBackgroundColor: Oklch
  textColor: Oklch
  contrastRatio: number
  lightnessShift: number // How far we had to shift the lightness to achieve contrast
}

/**
 * Searches outward from an initial lightness to find the closest
 * lightness value that meets the target WCAG contrast ratio.
 */
function findNearestAccessibleLightness(
  initialLightness: number,
  chroma: number,
  hue: number,
  textColor: Oklch,
  targetContrastRatio: number,
): ContrastResult | null {
  // Max 166 steps of 0.005 covers the full 0 to ~0.83 lightness spectrum
  for (let step = 0; step <= 166; step++) {
    const lightnessDelta = step * 0.005

    // First check exact lightness, then check outwards in both directions (+ and -)
    const lightnessOptions =
      step === 0
        ? [initialLightness]
        : [initialLightness - lightnessDelta, initialLightness + lightnessDelta]

    for (const currentLightness of lightnessOptions) {
      // Ignore extreme lightness/darkness bounds
      if (currentLightness < 0.15 || currentLightness > 0.98) continue

      const solidBackgroundColor = fitColorToRgb(currentLightness, chroma, hue)
      const contrastRatio = wcagContrast(solidBackgroundColor, textColor)

      if (contrastRatio >= targetContrastRatio) {
        return {
          lightness: currentLightness,
          solidBackgroundColor: solidBackgroundColor,
          textColor: textColor,
          contrastRatio: contrastRatio,
          lightnessShift: lightnessDelta,
        }
      }
    }
  }

  return null
}

/**
 * Determines whether white or dark text is better on the solid background,
 * and shifts the background color slightly if needed to guarantee readability.
 */
function findBestSolidBackground(
  initialLightness: number,
  chroma: number,
  hue: number,
  themeMode: 'light' | 'dark' | 'auto',
  targetContrast = 4.5,
): ContrastResult {
  // Generate a very dark, low-chroma version of the same hue to use as "ink" text
  const darkTextColor = fitColorToRgb(0.22, chroma * 0.35, hue)

  // Decide which text colors to test based on theme preference
  const textColorsToTest: Oklch[] = (() => {
    if (themeMode === 'light') return [WHITE_COLOR]
    if (themeMode === 'dark') return [darkTextColor]
    return [WHITE_COLOR, darkTextColor]
  })()

  let bestResult: ContrastResult | null = null

  for (const textColorCandidate of textColorsToTest) {
    const testResult = findNearestAccessibleLightness(
      initialLightness,
      chroma,
      hue,
      textColorCandidate,
      targetContrast,
    )

    if (!testResult) continue

    // We prefer the result that requires the smallest lightness shift.
    // If shifts are equal, we pick the one that yields a higher contrast ratio.
    const isFirstMatch = !bestResult
    const isSmallerShift = testResult.lightnessShift < (bestResult?.lightnessShift ?? Infinity)
    const isEqualShiftButBetterContrast =
      testResult.lightnessShift === bestResult?.lightnessShift &&
      testResult.contrastRatio > bestResult.contrastRatio

    if (isFirstMatch || isSmallerShift || isEqualShiftButBetterContrast) {
      bestResult = testResult
    }
  }

  if (!bestResult) {
    throw new Error(
      `No readable solid color found at hue ${hue.toFixed(1)}, chroma ${chroma.toFixed(3)}, mode ${themeMode}`,
    )
  }

  return bestResult
}

// Exported as-is to preserve your external API
export interface Scale {
  name: string
  hue: number
  light: string[]
  dark: string[]
  onSolidLight: string
  onSolidDark: string
}

/**
 * Main orchestrator: generates both the light and dark color scales.
 */
export function buildScale(scaleName: string, scaleInput: ScaleInput): Scale {
  // Internal helper to map the template arrays into actual CSS colors
  const generateThemeSteps = (
    anchorHexColor: string,
    lightnessTemplate: (number | null)[],
    chromaTemplate: number[],
    themeType: 'light' | 'dark',
  ) => {
    const parsedAnchorColor = toOklch(anchorHexColor)

    if (!parsedAnchorColor) {
      throw new Error(`Unparseable anchor color for ${scaleName}: ${anchorHexColor}`)
    }

    const hue = parsedAnchorColor.h ?? 0
    const peakChroma = (parsedAnchorColor.c ?? 0) * (scaleInput.chromaScale ?? 1)

    // Calculates a perfectly accessible solid background (index 8) based on the anchor color
    const accessibleSolidBackground = findBestSolidBackground(
      parsedAnchorColor.l,
      peakChroma,
      hue,
      scaleInput.onSolid ?? 'auto',
    )

    const generatedColorSteps = lightnessTemplate.map((presetLightness, stepIndex) => {
      // For indices 8 and 9 (where the template is `null`), we dynamically inject
      // the accessible solid color and its hover state respectively.
      const stepLightness =
        presetLightness ??
        (stepIndex === 8
          ? accessibleSolidBackground.lightness
          : accessibleSolidBackground.lightness + HOVER_DELTA[themeType])

      const stepChroma = chromaTemplate[stepIndex] ?? 0

      return fitColorToRgb(stepLightness, peakChroma * stepChroma, hue)
    })

    return {
      hue: hue,
      steps: generatedColorSteps.map((colorStep) => formatCss(colorStep) ?? '#000000'),
      onSolidTextColor: formatCss(accessibleSolidBackground.textColor) ?? '#000000',
    }
  }

  const lightThemeConfig = generateThemeSteps(
    scaleInput.anchor,
    LIGHTNESS_SCALE_LIGHT,
    CHROMA_SCALE_LIGHT,
    'light',
  )
  const darkThemeAnchorHex = scaleInput.darkAnchor ?? scaleInput.anchor
  const darkThemeConfig = generateThemeSteps(
    darkThemeAnchorHex,
    LIGHTNESS_SCALE_DARK,
    CHROMA_SCALE_DARK,
    'dark',
  )

  return {
    name: scaleName,
    hue: lightThemeConfig.hue,
    light: lightThemeConfig.steps,
    dark: darkThemeConfig.steps,
    onSolidLight: lightThemeConfig.onSolidTextColor,
    onSolidDark: darkThemeConfig.onSolidTextColor,
  }
}
