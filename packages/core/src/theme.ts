export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'
export { themeInitScript } from './theme-init'

const LOCAL_STORAGE_KEY = 'uw-theme'

const getSystemThemeQuery = () => {
  return window.matchMedia('(prefers-color-scheme: dark)')
}

export function getPreference(): ThemePreference {
  const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (storedValue === 'light' || storedValue === 'dark') {
    return storedValue
  }

  return 'system'
}

export function resolve(preference: ThemePreference = getPreference()): ResolvedTheme {
  if (preference === 'system') {
    const isSystemDark = getSystemThemeQuery().matches
    return isSystemDark ? 'dark' : 'light'
  }

  return preference
}

export function setTheme(preference: ThemePreference): void {
  if (preference === 'system') {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY, preference)
  }

  const resolvedTheme = resolve(preference)
  apply(resolvedTheme)
}

function apply(theme: ResolvedTheme): void {
  const root = document.documentElement

  root.classList.add('uw-theme-switching')
  root.dataset.theme = theme

  // Double rAF ensures the theme dataset update paints before transition re-enables
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove('uw-theme-switching')
    })
  })
}

export function subscribe(onThemeChange: (theme: ResolvedTheme) => void): () => void {
  const sync = () => {
    const currentTheme = resolve()
    apply(currentTheme)
    onThemeChange(currentTheme)
  }

  const onSystemThemeChange = () => {
    if (getPreference() === 'system') {
      sync()
    }
  }

  const onStorageChange = (event: StorageEvent) => {
    // event.key is null when localStorage.clear() is invoked in another window/tab
    if (event.key === LOCAL_STORAGE_KEY || event.key === null) {
      sync()
    }
  }

  const systemThemeQuery = getSystemThemeQuery()

  systemThemeQuery.addEventListener('change', onSystemThemeChange)
  window.addEventListener('storage', onStorageChange)

  return () => {
    systemThemeQuery.removeEventListener('change', onSystemThemeChange)
    window.removeEventListener('storage', onStorageChange)
  }
}

export function readToken(tokenName: string, element: Element = document.documentElement): string {
  const styles = getComputedStyle(element)
  return styles.getPropertyValue(`--uw-${tokenName}`).trim()
}
