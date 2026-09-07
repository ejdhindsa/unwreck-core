import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildFonts } from './fonts/build'
import { emitCss } from './generate/emit-css'
import { emitDtcg } from './generate/emit-dtcg'
import { emitTailwind } from './generate/emit-tailwind'
import { emitTs } from './generate/emit-ts'

const packageRoot = fileURLToPath(new URL('..', import.meta.url))
const distDirectory = join(packageRoot, 'dist')
const generatedDirectory = join(packageRoot, 'src', 'generated')

rmSync(distDirectory, { recursive: true, force: true })
rmSync(generatedDirectory, { recursive: true, force: true })
mkdirSync(distDirectory, { recursive: true })
mkdirSync(generatedDirectory, { recursive: true })

writeFileSync(join(distDirectory, 'tokens.css'), emitCss())
writeFileSync(join(distDirectory, 'tailwind.css'), emitTailwind())
writeFileSync(join(distDirectory, 'tokens.json'), emitDtcg())
writeFileSync(join(generatedDirectory, 'index.ts'), emitTs())

copyFileSync(join(packageRoot, 'src', 'reset.css'), join(distDirectory, 'reset.css'))

buildFonts(packageRoot)

console.log('[build] dist/ and src/generated/ written')
