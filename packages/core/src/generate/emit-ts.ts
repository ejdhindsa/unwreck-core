import { radius } from '../source/radius'
import { shadow } from '../source/shadow'
import { space } from '../source/space'
import { neutralHue, resolve, semanticNames, THEMES, tokenNames } from './resolve'

const formatObjectEntries = (entries: [string, string][], indent = 4): string => {
  const pad = ' '.repeat(indent)
  return entries
    .map(([key, value]) => `${pad}${JSON.stringify(key)}: ${JSON.stringify(value)},`)
    .join('\n')
}

export function emitTs(): string {
  const allTokens = tokenNames()

  const colorBlocks = THEMES.map((themeName) => {
    const tokens = semanticNames.map((tokenName) => {
      return [tokenName, resolve(tokenName, themeName)] as [string, string]
    })

    return `    ${themeName}: {\n${formatObjectEntries(tokens, 6)}\n    },`
  }).join('\n')

  const activeShadows = shadow(neutralHue)

  const shadowBlocks = THEMES.map((themeName) => {
    const entries = Object.entries(activeShadows[themeName])
    return `    ${themeName}: {\n${formatObjectEntries(entries, 6)}\n    },`
  }).join('\n')

  const tokenTypes = allTokens.map((tokenName) => `  | ${JSON.stringify(tokenName)}`).join('\n')

  const spaceEntries = formatObjectEntries(Object.entries(space), 4)
  const radiusEntries = formatObjectEntries(Object.entries(radius), 4)

  return `export type TokenName =
${tokenTypes}

export function cssVar(token: TokenName): string {
  return \`var(--uw-\${token})\`
}

export const tokens = {
  color: {
${colorBlocks}
  },
  space: {
${spaceEntries}
  },
  radius: {
${radiusEntries}
  },
  shadow: {
${shadowBlocks}
  },
} as const

export type Tokens = typeof tokens
`
}
