import { createContext, useContext, useEffect, useRef, useState, PropsWithChildren } from 'react'

interface FocusModeState {
  isActive: boolean
  toggle: () => void
  activate: () => void
  deactivate: () => void
}

const FOCUS_MODE_STORAGE_KEY = 'boa-prova-focus-mode'

class FocusModeSubject {
  private observers: Array<(state: boolean) => void> = []
  private state: boolean = false
  
  subscribe(observer: (state: boolean) => void): () => void {
    this.observers.push(observer)
    return () => {
      this.observers = this.observers.filter(o => o !== observer)
    }
  }
  
  notify(): void {
    this.observers.forEach(observer => observer(this.state))
  }
  
  toggle(): void {
    this.state = !this.state
    this.notify()
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(FOCUS_MODE_STORAGE_KEY, String(this.state))
    }
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'focus_mode_toggle', {
        event_category: 'study_tools',
        event_label: this.state ? 'activated' : 'deactivated',
      })
    }
  }
  
  setState(newState: boolean): void {
    this.state = newState
    this.notify()
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(FOCUS_MODE_STORAGE_KEY, String(this.state))
    }
  }
  
  getState(): boolean {
    return this.state
  }
  
  loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FOCUS_MODE_STORAGE_KEY)
      if (stored !== null) {
        this.state = stored === 'true'
        this.notify()
      }
    }
  }
}

const FocusModeContext = createContext<FocusModeState | null>(null)

export function FocusModeProvider({ children }: PropsWithChildren) {
  const subjectRef = useRef(new FocusModeSubject())
  const [isActive, setIsActive] = useState(() => {
    // Initialize from localStorage immediately
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FOCUS_MODE_STORAGE_KEY)
      if (stored !== null) {
        const savedState = stored === 'true'
        subjectRef.current.setState(savedState)
        return savedState
      }
    }
    return false
  })
  
  // Subscribe to subject changes
  useEffect(() => {
    return subjectRef.current.subscribe(setIsActive)
  }, [])
  
  // Keyboard shortcut: Ctrl+F or F (when not in input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        subjectRef.current.toggle()
        return
      }
      
      // Just F (when not in input/textarea)
      if (e.key.toLowerCase() === 'f') {
        const target = e.target as HTMLElement
        const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName)
        const isContentEditable = target.isContentEditable
        
        if (!isInput && !isContentEditable) {
          e.preventDefault()
          subjectRef.current.toggle()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  const contextValue: FocusModeState = {
    isActive,
    toggle: () => subjectRef.current.toggle(),
    activate: () => subjectRef.current.setState(true),
    deactivate: () => subjectRef.current.setState(false)
  }
  
  return (
    <FocusModeContext.Provider value={contextValue}>
      {children}
    </FocusModeContext.Provider>
  )
}

export function useFocusMode(): FocusModeState {
  const context = useContext(FocusModeContext)
  if (!context) {
    throw new Error('useFocusMode must be used within FocusModeProvider')
  }
  return context
}
