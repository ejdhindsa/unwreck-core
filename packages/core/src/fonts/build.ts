import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

interface FontRole {
  role: 'sans' | 'display' | 'mono'
  family: string
  file: string
  weight: string
  fallback: {
    name: string
    local: string
    sizeAdjust: string
    ascent: string
    descent: string
    lineGap: string
  }
  stack: string[]
}

const FONT_DEFINITIONS: FontRole[] = [
  {
    role: 'sans',
    family: 'Inter Variable',
    file: 'Inter.woff2',
    weight: '100 900',
    fallback: {
      name: 'Inter Fallback',
      local: 'Arial',
      sizeAdjust: '107.12%',
      ascent: '90.44%',
      descent: '22.52%',
      lineGap: '0%',
    },
    stack: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  },
  {
    role: 'display',
    family: 'Bricolage Grotesque Variable',
    file: 'BricolageGrotesque.woff2',
    weight: '200 800',
    fallback: {
      name: 'Bricolage Fallback',
      local: 'Arial',
      sizeAdjust: '100%',
      ascent: '95%',
      descent: '25%',
      lineGap: '0%',
    },
    stack: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  },
  {
    role: 'mono',
    family: 'JetBrains Mono Variable',
    file: 'JetBrainsMono.woff2',
    weight: '100 800',
    fallback: {
      name: 'JetBrains Mono Fallback',
      local: 'Courier New',
      sizeAdjust: '100%',
      ascent: '102%',
      descent: '30%',
      lineGap: '0%',
    },
    stack: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  },
]

const quoteFontName = (fontName: string) => `'${fontName}'`

function generateFontFaceCss(fontConfig: FontRole): string {
  const fontStack = [
    quoteFontName(fontConfig.family),
    quoteFontName(fontConfig.fallback.name),
    ...fontConfig.stack,
  ].join(', ')

  return `@font-face {
  font-family: ${quoteFontName(fontConfig.family)};
  src: url('./${fontConfig.file}') format('woff2');
  font-weight: ${fontConfig.weight};
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: ${quoteFontName(fontConfig.fallback.name)};
  src: local('${fontConfig.fallback.local}');
  size-adjust: ${fontConfig.fallback.sizeAdjust};
  ascent-override: ${fontConfig.fallback.ascent};
  descent-override: ${fontConfig.fallback.descent};
  line-gap-override: ${fontConfig.fallback.lineGap};
}

:root {
  --uw-font-${fontConfig.role}: ${fontStack};
}
`
}

export function buildFonts(packageRoot: string): void {
  const sourceDir = join(packageRoot, 'fonts')
  const outputDir = join(packageRoot, 'dist', 'fonts')

  mkdirSync(outputDir, { recursive: true })

  const fontCssBlocks: string[] = []

  for (const font of FONT_DEFINITIONS) {
    const sourcePath = join(sourceDir, font.file)

    if (!existsSync(sourcePath)) {
      console.warn(`[fonts] skipping ${font.role}: fonts/${font.file} not found`)
    } else {
      copyFileSync(sourcePath, join(outputDir, font.file))
      const css = generateFontFaceCss(font)
      writeFileSync(join(outputDir, `${font.role}.css`), css)

      fontCssBlocks.push(css)
    }
  }

  writeFileSync(join(outputDir, 'all.css'), fontCssBlocks.join('\n'))

  console.log(`[fonts] ${fontCssBlocks.length}/${FONT_DEFINITIONS.length} roles emitted`)
}
