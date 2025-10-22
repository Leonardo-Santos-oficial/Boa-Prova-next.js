/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import FocusModeToggle from '@/components/study-tools/FocusModeToggle'
import { FocusModeProvider } from '@/contexts/FocusModeContext'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('FocusModeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should render the toggle button', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should show "Modo Foco" when inactive', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    expect(screen.getByText('Modo Foco')).toBeInTheDocument()
  })

  it('should toggle to "Sair do Modo Foco" when clicked', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('Sair do Modo Foco')).toBeInTheDocument()
  })

  it('should have proper aria-label when inactive', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Ativar modo foco (Ctrl+F ou F)')
  })

  it('should have proper aria-label when active', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-label', 'Desativar modo foco (Ctrl+F ou F)')
  })

  it('should have aria-pressed attribute', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('should show different emojis based on state', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    // Check inactive emoji
    expect(screen.getByText('🎯')).toBeInTheDocument()

    // Toggle and check active emoji
    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('👁️')).toBeInTheDocument()
  })

  it('should have screen reader text', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    const srText = screen.getByText(/Modo foco inativo/i)
    expect(srText).toHaveClass('sr-only')
  })

  it('should update screen reader text when toggled', () => {
    render(
      <FocusModeProvider>
        <FocusModeToggle />
      </FocusModeProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const srText = screen.getByText(/Modo foco ativo/i)
    expect(srText).toHaveClass('sr-only')
  })
})
