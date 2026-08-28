import { breakpoint } from '../source/layout'
import { easing } from '../source/motion'
import { radius } from '../source/radius'
import { fontSize } from '../source/typography'
import { accentSuffixes, baseSemanticNames, patternScales } from './resolve'

const TOKEN_ALIASES: Record<string, string> = {
  'fg-default': 'fg',
  'fg-link': 'link',
  'fg-link-hover': 'link-hover',
  'border-default': 'border',
  'focus-ring': 'ring',
  'bg-canvas': 'canvas',
}

function toTailwindColor(tokenName: string): string {
  const mappedAlias = TOKEN_ALIASES[tokenName]

  if (mappedAlias) {
    return mappedAlias
  }

  if (tokenName.startsWith('bg-')) {
    return tokenName.slice(3)
  }

  return tokenName
}

function toTailwindAccent(scaleName: string, suffix: string): string {
  if (suffix === 'solid') {
    return scaleName
  }

  if (suffix === 'solid-hover') {
    return `${scaleName}-hover`
  }

  if (suffix === 'on-solid') {
    return `on-${scaleName}`
  }

  return `${scaleName}-${suffix}`
}

const createCssVariableLine = (propertyName: string, propertyValue: string) => {
  return `  ${propertyName}: ${propertyValue};`
}

export function emitTailwind(): string {
  const semanticColors = baseSemanticNames.map((tokenName) => {
    const tailwindName = toTailwindColor(tokenName)
    return createCssVariableLine(`--color-${tailwindName}`, `var(--uw-${tokenName})`)
  })

  const accentColors = patternScales.flatMap((scaleName) => {
    return accentSuffixes.map((suffix) => {
      const tailwindName = toTailwindAccent(scaleName, suffix)
      return createCssVariableLine(`--color-${tailwindName}`, `var(--uw-${scaleName}-${suffix})`)
    })
  })

  const colorTokens = [...semanticColors, ...accentColors].join('\n')

  const staticTokens = [
    createCssVariableLine('--spacing', '0.25rem'),
    '',
    ...Object.keys(radius).map((radiusKey) => {
      return createCssVariableLine(`--radius-${radiusKey}`, `var(--uw-radius-${radiusKey})`)
    }),
    '',
    ...['sm', 'md', 'lg'].map((shadowSize) => {
      return createCssVariableLine(`--shadow-${shadowSize}`, `var(--uw-shadow-${shadowSize})`)
    }),
    '',
    ...Object.keys(easing).map((easingKey) => {
      return createCssVariableLine(`--ease-${easingKey}`, `var(--uw-easing-${easingKey})`)
    }),
    '',
    ...Object.keys(breakpoint).map((breakpointKey) => {
      return createCssVariableLine(
        `--breakpoint-${breakpointKey}`,
        `var(--uw-breakpoint-${breakpointKey})`,
      )
    }),
    '',
    ...Object.keys(fontSize).map((fontSizeKey) => {
      return createCssVariableLine(`--text-${fontSizeKey}`, `var(--uw-font-size-${fontSizeKey})`)
    }),
    '',
    createCssVariableLine(
      '--font-sans',
      'var(--uw-font-sans, ui-sans-serif, system-ui, sans-serif)',
    ),
    createCssVariableLine(
      '--font-display',
      'var(--uw-font-display, var(--uw-font-sans, ui-sans-serif, system-ui, sans-serif))',
    ),
    createCssVariableLine(
      '--font-mono',
      'var(--uw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
    ),
  ].join('\n')

  return `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme inline {
${colorTokens}

${staticTokens}
}
`
}
