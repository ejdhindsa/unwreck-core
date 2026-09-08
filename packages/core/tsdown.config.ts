import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/generated/index.ts',
    theme: 'src/theme.ts',
    vite: 'src/vite.ts',
  },
  outDir: 'dist',
  format: 'esm',
  dts: true,
  platform: 'neutral',
  clean: false,
  external: ['react', 'vue', 'vite'],
})
