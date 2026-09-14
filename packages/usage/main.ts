import '@unwreck/core/reset'
import '@unwreck/core/css'
import { getPreference, setTheme } from '@unwreck/core/theme'

// Setup theme toggler
const btn = document.getElementById('theme-toggle')
btn?.addEventListener('click', () => {
  const current = getPreference()
  const next = current === 'dark' ? 'light' : 'dark'
  setTheme(next)
})

// Render Brand Scale
const brandGrid = document.getElementById('brand-grid')
for (let i = 1; i <= 12; i++) {
  const div = document.createElement('div')
  div.className = 'swatch'
  div.style.backgroundColor = `var(--uw-brand-${i})`

  // Choose text color based on step (rough approximation for contrast on the fly)
  div.style.color = i >= 9 ? 'var(--uw-brand-on-solid)' : 'var(--uw-brand-12)'

  div.innerHTML = `
    <div>brand-${i}</div>
  `
  brandGrid?.appendChild(div)
}

// Render Semantic Scales
const semantics = [
  { bg: 'bg-canvas', fg: 'fg-default' },
  { bg: 'bg-subtle', fg: 'fg-default' },
  { bg: 'bg-surface', fg: 'fg-default' },
  { bg: 'bg-surface-hover', fg: 'fg-default' },
  { bg: 'brand-bg', fg: 'brand-fg' },
  { bg: 'success-bg', fg: 'success-fg' },
  { bg: 'warning-bg', fg: 'warning-fg' },
  { bg: 'danger-bg', fg: 'danger-fg' },
  { bg: 'info-bg', fg: 'info-fg' },
]

const semanticGrid = document.getElementById('semantic-grid')
for (const s of semantics) {
  const div = document.createElement('div')
  div.className = 'swatch'
  div.style.backgroundColor = `var(--uw-${s.bg})`
  div.style.color = `var(--uw-${s.fg})`
  div.innerHTML = `
    <div>${s.bg}</div>
  `
  semanticGrid?.appendChild(div)
}

console.log('Tokens loaded!')
