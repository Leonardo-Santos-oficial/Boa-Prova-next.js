import { PomodoroTimerState, PomodoroContext, PomodoroPhase } from './types'

export class IdleState implements PomodoroTimerState {
  getName(): string {
    return 'IDLE'
  }

  start(context: PomodoroContext): void {
    const settings = context.getSettings()
    context.setRemainingTime(settings.workDuration * 60)
    context.setPhase(PomodoroPhase.Work)
    context.setState(new RunningState())
  }

  pause(): void {
    throw new Error('Cannot pause when idle')
  }

  resume(): void {
    throw new Error('Cannot resume when idle')
  }

  reset(context: PomodoroContext): void {
    // Already idle, just restore default time
    context.setRemainingTime(context.getSettings().workDuration * 60)
    context.setPhase(PomodoroPhase.Work)
    context.resetCompletedSessions()
  }

  skip(): void {
    throw new Error('Cannot skip when idle')
  }

  tick(): void {
    // No-op
  }
}

export class RunningState implements PomodoroTimerState {
  getName(): string {
    return 'RUNNING'
  }

  start(): void {
    throw new Error('Timer already running')
  }

  pause(context: PomodoroContext): void {
    context.setState(new PausedState())
  }

  resume(): void {
    throw new Error('Timer already running')
  }

  reset(context: PomodoroContext): void {
    context.setState(new IdleState())
    context.setPhase(PomodoroPhase.Work)
    context.setRemainingTime(context.getSettings().workDuration * 60)
    context.resetCompletedSessions()
  }

  skip(context: PomodoroContext): void {
    this.completePhase(context)
  }

  tick(context: PomodoroContext): void {
    const remaining = context.getRemainingTime()
    
    if (remaining <= 0) {
      this.completePhase(context)
    } else {
      context.setRemainingTime(remaining - 1)
    }
    
    context.notifyObservers()
  }

  private completePhase(context: PomodoroContext): void {
    const currentPhase = context.getPhase()
    const settings = context.getSettings()
    const completedSessions = context.getCompletedSessions()

    if (currentPhase === PomodoroPhase.Work) {
      context.incrementCompletedSessions()
      
      if ((completedSessions + 1) % settings.sessionsUntilLongBreak === 0) {
        context.setPhase(PomodoroPhase.LongBreak)
        context.setRemainingTime(settings.longBreakDuration * 60)
      } else {
        context.setPhase(PomodoroPhase.ShortBreak)
        context.setRemainingTime(settings.shortBreakDuration * 60)
      }
    } else {
      context.setPhase(PomodoroPhase.Work)
      context.setRemainingTime(settings.workDuration * 60)
    }

    context.notifyObservers()
  }
}

export class PausedState implements PomodoroTimerState {
  getName(): string {
    return 'PAUSED'
  }

  start(): void {
    throw new Error('Timer already started')
  }

  pause(): void {
    // Already paused
  }

  resume(context: PomodoroContext): void {
    context.setState(new RunningState())
  }

  reset(context: PomodoroContext): void {
    context.setState(new IdleState())
    context.setPhase(PomodoroPhase.Work)
    context.setRemainingTime(context.getSettings().workDuration * 60)
    context.resetCompletedSessions()
  }

  skip(context: PomodoroContext): void {
    const runningState = new RunningState()
    context.setState(runningState)
    runningState.skip(context)
  }

  tick(): void {
    // No-op when paused
  }
}
