import type { Plugin } from 'vite'
import { themeInitScript } from './theme-init'

export function unwreck(): Plugin {
  return {
    name: 'unwreck',
    transformIndexHtml: {
      order: 'pre',
      handler: (htmlContent) => {
        return {
          html: htmlContent,
          tags: [
            {
              tag: 'script',
              children: themeInitScript,
              injectTo: 'head-prepend',
            },
          ],
        }
      },
    },
  }
}
