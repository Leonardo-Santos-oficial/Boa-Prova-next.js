import { createContext, useContext, useEffect, useRef, useState, PropsWithChildren } from 'react'

interface FocusModeState {
  isActive: boolean
  toggle: () => void
  activate: () => void
  deactivate: () => void
}

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
  }
  
  setState(newState: boolean): void {
    this.state = newState
    this.notify()
  }
  
  getState(): boolean {
    return this.state
  }
}

const FocusModeContext = createContext<FocusModeState | null>(null)

export function FocusModeProvider({ children }: PropsWithChildren) {
  const subjectRef = useRef(new FocusModeSubject())
  const [isActive, setIsActive] = useState(false)
  
  useEffect(() => {
    return subjectRef.current.subscribe(setIsActive)
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
