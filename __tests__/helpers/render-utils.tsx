import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark'
}

export function renderWithTheme(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { theme = 'light', ...renderOptions } = options || {}

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }

  return render(ui, renderOptions)
}

export function cleanup() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark')
  }
}
