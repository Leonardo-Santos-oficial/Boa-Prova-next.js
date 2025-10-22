/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react'
import { FocusModeProvider, useFocusMode } from '@/contexts/FocusModeContext'

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
    removeItem: (key: string) => {
      delete store[key]
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock gtag
Object.defineProperty(window, 'gtag', {
  value: jest.fn(),
  writable: true,
})

describe('FocusModeContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  describe('Observer Pattern', () => {
    it('should start with focus mode inactive', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      expect(result.current.isActive).toBe(false)
    })

    it('should toggle focus mode state', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        result.current.toggle()
      })

      expect(result.current.isActive).toBe(true)

      act(() => {
        result.current.toggle()
      })

      expect(result.current.isActive).toBe(false)
    })

    it('should activate focus mode', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        result.current.activate()
      })

      expect(result.current.isActive).toBe(true)
    })

    it('should deactivate focus mode', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        result.current.activate()
      })

      expect(result.current.isActive).toBe(true)

      act(() => {
        result.current.deactivate()
      })

      expect(result.current.isActive).toBe(false)
    })

    it('should notify multiple observers', () => {
      const { result, rerender } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      const initialState = result.current.isActive

      act(() => {
        result.current.toggle()
      })

      rerender()

      expect(result.current.isActive).toBe(!initialState)
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should persist focus mode state to localStorage', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        result.current.toggle()
      })

      expect(localStorage.getItem('boa-prova-focus-mode')).toBe('true')

      act(() => {
        result.current.toggle()
      })

      expect(localStorage.getItem('boa-prova-focus-mode')).toBe('false')
    })

    it('should load focus mode state from localStorage on mount', async () => {
      localStorage.setItem('boa-prova-focus-mode', 'true')

      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      // Wait a bit for useEffect to run
      await waitFor(() => {
        expect(result.current.isActive).toBe(true)
      }, { timeout: 2000 })
    })

    it('should handle missing localStorage data gracefully', () => {
      localStorage.clear()

      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      expect(result.current.isActive).toBe(false)
    })

    it('should save state changes to localStorage via activate', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        result.current.activate()
      })

      expect(localStorage.getItem('boa-prova-focus-mode')).toBe('true')
    })

    it('should save state changes to localStorage via deactivate', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        result.current.activate()
      })

      act(() => {
        result.current.deactivate()
      })

      expect(localStorage.getItem('boa-prova-focus-mode')).toBe('false')
    })
  })

  describe('Analytics Tracking', () => {
    it('should track focus mode activation', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        result.current.toggle()
      })

      expect((window as any).gtag).toHaveBeenCalledWith('event', 'focus_mode_toggle', {
        event_category: 'study_tools',
        event_label: 'activated',
      })
    })

    it('should track focus mode deactivation', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        result.current.activate()
      })

      jest.clearAllMocks()

      act(() => {
        result.current.toggle()
      })

      expect((window as any).gtag).toHaveBeenCalledWith('event', 'focus_mode_toggle', {
        event_category: 'study_tools',
        event_label: 'deactivated',
      })
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('should toggle on Ctrl+F', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'f',
          ctrlKey: true,
          bubbles: true,
        })
        window.dispatchEvent(event)
      })

      expect(result.current.isActive).toBe(true)
    })

    it('should toggle on F key when not in input', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'f',
          bubbles: true,
        })
        Object.defineProperty(event, 'target', {
          value: document.body,
          writable: false,
        })
        window.dispatchEvent(event)
      })

      expect(result.current.isActive).toBe(true)
    })

    it('should NOT toggle on F when in input field', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      const input = document.createElement('input')
      document.body.appendChild(input)

      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'f',
          bubbles: true,
        })
        Object.defineProperty(event, 'target', {
          value: input,
          writable: false,
        })
        window.dispatchEvent(event)
      })

      expect(result.current.isActive).toBe(false)

      document.body.removeChild(input)
    })

    it('should NOT toggle on F when in textarea', () => {
      const { result } = renderHook(() => useFocusMode(), {
        wrapper: FocusModeProvider,
      })

      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)

      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'f',
          bubbles: true,
        })
        Object.defineProperty(event, 'target', {
          value: textarea,
          writable: false,
        })
        window.dispatchEvent(event)
      })

      expect(result.current.isActive).toBe(false)

      document.body.removeChild(textarea)
    })
  })

  describe('Error Handling', () => {
    it('should throw error when useFocusMode is used outside provider', () => {
      // Suppress console error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useFocusMode())
      }).toThrow('useFocusMode must be used within FocusModeProvider')

      consoleSpy.mockRestore()
    })
  })
})
