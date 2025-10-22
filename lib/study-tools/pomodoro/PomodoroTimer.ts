import {
  PomodoroContext,
  PomodoroTimerState,
  PomodoroPhase,
  PomodoroSettings,
  PomodoroObserver
} from './types'
import { IdleState } from './states'

export class PomodoroTimer implements PomodoroContext {
  private state: PomodoroTimerState
  private phase: PomodoroPhase = PomodoroPhase.Work
  private remainingTime: number
  private completedSessions: number = 0
  private observers: PomodoroObserver[] = []
  private intervalId?: NodeJS.Timeout

  constructor(private settings: PomodoroSettings) {
    this.state = new IdleState()
    this.remainingTime = settings.workDuration * 60
  }

  setState(state: PomodoroTimerState): void {
    this.state = state
    this.notifyObservers()
  }

  getState(): PomodoroTimerState {
    return this.state
  }

  getPhase(): PomodoroPhase {
    return this.phase
  }

  setPhase(phase: PomodoroPhase): void {
    const oldPhase = this.phase
    this.phase = phase
    
    this.observers.forEach(observer => {
      if (oldPhase !== phase) {
        observer.onPhaseComplete(oldPhase)
      }
    })
  }

  getRemainingTime(): number {
    return this.remainingTime
  }

  setRemainingTime(time: number): void {
    this.remainingTime = time
  }

  getCompletedSessions(): number {
    return this.completedSessions
  }

  incrementCompletedSessions(): void {
    this.completedSessions++
    this.observers.forEach(observer => {
      observer.onSessionComplete(this.completedSessions)
    })
  }

  resetCompletedSessions(): void {
    this.completedSessions = 0
  }

  getSettings(): PomodoroSettings {
    return this.settings
  }

  subscribe(observer: PomodoroObserver): () => void {
    this.observers.push(observer)
    return () => {
      this.observers = this.observers.filter(o => o !== observer)
    }
  }

  notifyObservers(): void {
    const stateName = this.state.getName()
    this.observers.forEach(observer => {
      observer.onStateChange(stateName, this.phase, this.remainingTime)
    })
  }

  startTicking(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }

    this.intervalId = setInterval(() => {
      this.state.tick(this)
    }, 1000)
  }

  stopTicking(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }

  updateSettings(settings: Partial<PomodoroSettings>): void {
    this.settings = { ...this.settings, ...settings }
  }
}
