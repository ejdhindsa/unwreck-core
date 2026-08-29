import { duration } from '../source/motion'
import { radius } from '../source/radius'
import { space } from '../source/space'
import { primitiveColorVars, resolve, semanticNames, THEMES } from './resolve'

interface DtcgToken {
  $value: string
  $description?: string
}

type DtcgGroup = {
  $type?: string
  [key: string]: DtcgGroup | DtcgToken | string | undefined
}

const createTokenGroup = (tokenType: string, tokenValues: Record<string, string>): DtcgGroup => {
  const group: DtcgGroup = { $type: tokenType }

  for (const [tokenName, tokenValue] of Object.entries(tokenValues)) {
    group[tokenName] = { $value: tokenValue }
  }

  return group
}

export function emitDtcg(): string {
  const themeColorTokens = THEMES.map((themeName) => {
    const rawVariables = primitiveColorVars(themeName)

    const primitiveTokens = Object.fromEntries(
      Object.entries(rawVariables).map(([cssVariable, hexValue]) => {
        const tokenName = cssVariable.slice(5)
        return [tokenName, hexValue]
      }),
    )

    const semanticTokens = Object.fromEntries(
      semanticNames.map((tokenName) => {
        return [tokenName, resolve(tokenName, themeName)]
      }),
    )

    const themeData = {
      $type: 'color',
      primitive: createTokenGroup('color', primitiveTokens),
      semantic: createTokenGroup('color', semanticTokens),
    }

    return [themeName, themeData]
  })

  const tokensDocument = {
    $description: '@unwreck/core design tokens (DTCG). Generated — do not edit.',
    color: Object.fromEntries(themeColorTokens),
    dimension: {
      $type: 'dimension',
      space: createTokenGroup('dimension', space),
      radius: createTokenGroup('dimension', radius),
    },
    duration: createTokenGroup('duration', duration),
  }

  return `${JSON.stringify(tokensDocument, null, 2)}\n`
}
