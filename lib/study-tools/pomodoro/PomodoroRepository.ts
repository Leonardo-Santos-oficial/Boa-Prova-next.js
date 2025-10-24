import { PomodoroPhase } from './types'

export interface PomodoroState {
  phase: PomodoroPhase
  remainingTime: number
  completedSessions: number
  state: string
  timestamp: number
}

export interface PomodoroRepository {
  save(state: PomodoroState): void
  load(): PomodoroState | null
  clear(): void
}

export class LocalStoragePomodoroRepository implements PomodoroRepository {
  private readonly storageKey = 'pomodoro-state'

  save(state: PomodoroState): void {
    if (typeof window === 'undefined') return

    try {
      const data = JSON.stringify({
        ...state,
        timestamp: Date.now()
      })
      localStorage.setItem(this.storageKey, data)
    } catch (error) {
      console.error('Failed to save Pomodoro state:', error)
    }
  }

  load(): PomodoroState | null {
    if (typeof window === 'undefined') return null

    try {
      const data = localStorage.getItem(this.storageKey)
      if (!data) return null

      const state = JSON.parse(data) as PomodoroState
      
      const maxAge = 60 * 60 * 1000
      if (Date.now() - state.timestamp > maxAge) {
        this.clear()
        return null
      }

      return state
    } catch (error) {
      console.error('Failed to load Pomodoro state:', error)
      return null
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error('Failed to clear Pomodoro state:', error)
    }
  }
}
