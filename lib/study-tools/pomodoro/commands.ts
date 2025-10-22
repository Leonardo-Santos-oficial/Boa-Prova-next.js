import { PomodoroCommand, PomodoroContext } from './types'

export class StartCommand implements PomodoroCommand {
  constructor(private context: PomodoroContext) {}

  execute(): void {
    this.context.getState().start(this.context)
  }
}

export class PauseCommand implements PomodoroCommand {
  constructor(private context: PomodoroContext) {}

  execute(): void {
    this.context.getState().pause(this.context)
  }
}

export class ResumeCommand implements PomodoroCommand {
  constructor(private context: PomodoroContext) {}

  execute(): void {
    this.context.getState().resume(this.context)
  }
}

export class ResetCommand implements PomodoroCommand {
  private previousState?: {
    remainingTime: number
    phase: unknown
  }

  constructor(private context: PomodoroContext) {}

  execute(): void {
    this.previousState = {
      remainingTime: this.context.getRemainingTime(),
      phase: this.context.getPhase()
    }
    
    this.context.getState().reset(this.context)
  }

  undo(): void {
    if (this.previousState) {
      this.context.setRemainingTime(this.previousState.remainingTime)
      this.context.setPhase(this.previousState.phase as never)
    }
  }
}

export class SkipCommand implements PomodoroCommand {
  constructor(private context: PomodoroContext) {}

  execute(): void {
    this.context.getState().skip(this.context)
  }
}
