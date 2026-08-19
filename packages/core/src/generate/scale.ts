import { clampChroma, converter, formatCss, type Oklch, wcagContrast } from 'culori'

const toOklch = converter('oklch')

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

const HOVER_DELTA = { light: -0.045, dark: +0.045 } as const

const WHITE_COLOR: Oklch = { mode: 'oklch', l: 1, c: 0, h: 0 }
const MIN_LIGHTNESS = 0.15
const MAX_LIGHTNESS = 0.98

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
  backgroundColor: Oklch
  textColor: Oklch
  contrastRatio: number
  lightnessShift: number // How far we had to shift the lightness to achieve contrast
}

function findNearestAccessibleLightness(
  initialLightness: number,
  chroma: number,
  hue: number,
  textColor: Oklch,
  targetContrastRatio: number,
): ContrastResult | null {
  // 166 steps of 0.005 covers 0.83 (MAX_LIGHTNESS - MIN_LIGHTNESS)
  for (let step = 0; step <= 166; step++) {
    const lightnessDelta = step * 0.005

    // When shifting outward, test darker before lighter to favor deeper solid tones over washed-out ones on equal contrast distance
    const lightnessOptions = (
      step === 0
        ? [initialLightness]
        : [initialLightness - lightnessDelta, initialLightness + lightnessDelta]
    ).filter((l) => l >= MIN_LIGHTNESS && l <= MAX_LIGHTNESS)

    for (const currentLightness of lightnessOptions) {
      const backgroundColor = fitColorToRgb(currentLightness, chroma, hue)
      const contrastRatio = wcagContrast(backgroundColor, textColor)

      if (contrastRatio >= targetContrastRatio) {
        return {
          lightness: currentLightness,
          backgroundColor,
          textColor,
          contrastRatio,
          lightnessShift: lightnessDelta,
        }
      }
    }
  }

  return null
}

function findBestSolidBackground(
  initialLightness: number,
  chroma: number,
  hue: number,
  themeMode: 'light' | 'dark' | 'auto',
  targetContrast = 4.5,
): ContrastResult {
  const darkTextColor = fitColorToRgb(0.22, chroma * 0.35, hue)

  const candidates =
    themeMode === 'light'
      ? [WHITE_COLOR]
      : themeMode === 'dark'
        ? [darkTextColor]
        : [WHITE_COLOR, darkTextColor]

  let bestResult: ContrastResult | null = null

  for (const textColor of candidates) {
    const testResult = findNearestAccessibleLightness(
      initialLightness,
      chroma,
      hue,
      textColor,
      targetContrast,
    )

    if (
      testResult &&
      (!bestResult ||
        testResult.lightnessShift < bestResult.lightnessShift ||
        (testResult.lightnessShift === bestResult.lightnessShift &&
          testResult.contrastRatio > bestResult.contrastRatio))
    ) {
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

export interface Scale {
  name: string
  hue: number
  light: string[]
  dark: string[]
  onSolidLight: string
  onSolidDark: string
}

function generateThemeSteps(
  scaleName: string,
  scaleInput: ScaleInput,
  anchorHexColor: string,
  lightnessTemplate: (number | null)[],
  chromaTemplate: number[],
  themeType: 'light' | 'dark',
) {
  const anchorColor = toOklch(anchorHexColor)

  if (!anchorColor) {
    throw new Error(`Unparseable anchor color for ${scaleName}: ${anchorHexColor}`)
  }

  const hue = anchorColor.h ?? 0
  const peakChroma = (anchorColor.c ?? 0) * (scaleInput.chromaScale ?? 1)

  const solidBackground = findBestSolidBackground(
    anchorColor.l,
    peakChroma,
    hue,
    scaleInput.onSolid ?? 'auto',
  )

  const steps = lightnessTemplate.map((presetLightness, stepIndex) => {
    // index 8 = solid, index 9 = hover
    const stepLightness =
      presetLightness ??
      (stepIndex === 8
        ? solidBackground.lightness
        : solidBackground.lightness + HOVER_DELTA[themeType])

    const stepChroma = chromaTemplate[stepIndex] ?? 0

    return fitColorToRgb(stepLightness, peakChroma * stepChroma, hue)
  })

  return {
    hue,
    steps: steps.map((colorStep) => formatCss(colorStep) ?? '#000000'),
    onSolidTextColor: formatCss(solidBackground.textColor) ?? '#000000',
  }
}

export function buildScale(scaleName: string, scaleInput: ScaleInput): Scale {
  const lightTheme = generateThemeSteps(
    scaleName,
    scaleInput,
    scaleInput.anchor,
    LIGHTNESS_SCALE_LIGHT,
    CHROMA_SCALE_LIGHT,
    'light',
  )
  const darkAnchor = scaleInput.darkAnchor ?? scaleInput.anchor
  const darkTheme = generateThemeSteps(
    scaleName,
    scaleInput,
    darkAnchor,
    LIGHTNESS_SCALE_DARK,
    CHROMA_SCALE_DARK,
    'dark',
  )

  return {
    name: scaleName,
    hue: lightTheme.hue,
    light: lightTheme.steps,
    dark: darkTheme.steps,
    onSolidLight: lightTheme.onSolidTextColor,
    onSolidDark: darkTheme.onSolidTextColor,
  }
}
