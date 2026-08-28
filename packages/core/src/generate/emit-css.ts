import { primitiveColorVars, semanticVars, shadowVars, staticVars, type Theme } from './resolve'

const VALID_CSS_VARIABLE_PATTERN = /^--uw-[a-z0-9-]+$/

const formatDeclarations = (cssVariables: Record<string, string>): string => {
  return Object.entries(cssVariables)
    .map(([variableName, value]) => {
      if (!VALID_CSS_VARIABLE_PATTERN.test(variableName)) {
        throw new Error(`Invalid custom property name: ${variableName}`)
      }
      return `  ${variableName}: ${value};`
    })
    .join('\n')
}

const createSectionHeader = (label: string) => `\n  /* ${label} */`

function generateThemeBlock(
  cssSelector: string,
  theme: Theme,
  shouldIncludeStatic: boolean,
): string {
  const stylesheetParts = [
    `${cssSelector} {`,
    `  color-scheme: ${theme};`,
    createSectionHeader('Primitives'),
    formatDeclarations(primitiveColorVars(theme)),
    formatDeclarations(shadowVars(theme)),
  ]

  if (shouldIncludeStatic) {
    stylesheetParts.push(formatDeclarations(staticVars()))
  }

  stylesheetParts.push(
    createSectionHeader('Semantic'),
    formatDeclarations(semanticVars(theme)),
    '}',
  )

  return stylesheetParts.join('\n')
}

export function emitCss(): string {
  const reducedMotionOverrides = Object.keys(staticVars())
    .filter((tokenName) => tokenName.startsWith('--uw-duration-'))
    .map((tokenName) => `    ${tokenName}: 0ms;`)
    .join('\n')

  return `/* @unwreck/core */

${generateThemeBlock(':root,\n[data-theme="light"]', 'light', true)}

${generateThemeBlock('[data-theme="dark"]', 'dark', false)}

.uw-theme-switching,
.uw-theme-switching * {
  transition: none !important;
}

@media (prefers-reduced-motion: reduce) {
  :root {
${reducedMotionOverrides}
  }
}
`
}
