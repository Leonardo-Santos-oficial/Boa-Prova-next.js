export enum PomodoroPhase {
  Work = 'WORK',
  ShortBreak = 'SHORT_BREAK',
  LongBreak = 'LONG_BREAK'
}

export interface PomodoroSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
}

export interface PomodoroTimerState {
  getName(): string
  start(context: PomodoroContext): void
  pause(context: PomodoroContext): void
  resume(context: PomodoroContext): void
  reset(context: PomodoroContext): void
  skip(context: PomodoroContext): void
  tick(context: PomodoroContext): void
}

export interface PomodoroContext {
  setState(state: PomodoroTimerState): void
  getState(): PomodoroTimerState
  getPhase(): PomodoroPhase
  setPhase(phase: PomodoroPhase): void
  getRemainingTime(): number
  setRemainingTime(time: number): void
  getCompletedSessions(): number
  incrementCompletedSessions(): void
  resetCompletedSessions(): void
  getSettings(): PomodoroSettings
  notifyObservers(): void
}

export interface PomodoroObserver {
  onStateChange(state: string, phase: PomodoroPhase, remainingTime: number): void
  onPhaseComplete(phase: PomodoroPhase): void
  onSessionComplete(sessionsCompleted: number): void
}

export interface PomodoroCommand {
  execute(): void
  undo?(): void
}
