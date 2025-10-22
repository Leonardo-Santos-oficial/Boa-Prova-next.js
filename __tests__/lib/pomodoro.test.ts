import { PomodoroTimer } from '@/lib/study-tools/pomodoro/PomodoroTimer'
import { PomodoroPhase, PomodoroSettings, PomodoroObserver } from '@/lib/study-tools/pomodoro/types'
import { StartCommand, PauseCommand, ResumeCommand, ResetCommand, SkipCommand } from '@/lib/study-tools/pomodoro/commands'

describe('Pomodoro Timer State + Command + Observer Pattern', () => {
  const mockSettings: PomodoroSettings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  }

  it('should start in IDLE state', () => {
    const timer = new PomodoroTimer(mockSettings)
    expect(timer.getState().getName()).toBe('IDLE')
  })

  it('should start timer with StartCommand', () => {
    const timer = new PomodoroTimer(mockSettings)
    const command = new StartCommand(timer)
    
    command.execute()
    
    expect(timer.getState().getName()).toBe('RUNNING')
    expect(timer.getPhase()).toBe(PomodoroPhase.Work)
    expect(timer.getRemainingTime()).toBe(25 * 60)
  })

  it('should pause timer with PauseCommand', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    new StartCommand(timer).execute()
    new PauseCommand(timer).execute()
    
    expect(timer.getState().getName()).toBe('PAUSED')
  })

  it('should resume timer with ResumeCommand', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    new StartCommand(timer).execute()
    new PauseCommand(timer).execute()
    new ResumeCommand(timer).execute()
    
    expect(timer.getState().getName()).toBe('RUNNING')
  })

  it('should reset timer with ResetCommand', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    new StartCommand(timer).execute()
    new ResetCommand(timer).execute()
    
    expect(timer.getState().getName()).toBe('IDLE')
    expect(timer.getCompletedSessions()).toBe(0)
  })

  it('should undo reset with ResetCommand', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    new StartCommand(timer).execute()
    timer.setRemainingTime(1000)
    
    const resetCommand = new ResetCommand(timer)
    resetCommand.execute()
    
    expect(timer.getState().getName()).toBe('IDLE')
    
    if (resetCommand.undo) {
      resetCommand.undo()
      expect(timer.getRemainingTime()).toBe(1000)
    }
  })

  it('should skip to next phase with SkipCommand', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    new StartCommand(timer).execute()
    expect(timer.getPhase()).toBe(PomodoroPhase.Work)
    
    new SkipCommand(timer).execute()
    expect(timer.getPhase()).toBe(PomodoroPhase.ShortBreak)
  })

  it('should notify observers on state change', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    const mockObserver: PomodoroObserver = {
      onStateChange: jest.fn(),
      onPhaseComplete: jest.fn(),
      onSessionComplete: jest.fn()
    }
    
    timer.subscribe(mockObserver)
    new StartCommand(timer).execute()
    
    expect(mockObserver.onStateChange).toHaveBeenCalled()
  })

  it('should track completed sessions', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    new StartCommand(timer).execute()
    expect(timer.getCompletedSessions()).toBe(0)
    
    timer.setRemainingTime(0)
    timer.getState().tick(timer)
    
    expect(timer.getCompletedSessions()).toBe(1)
  })

  it('should switch to long break after 4 sessions', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    new StartCommand(timer).execute()
    
    for (let i = 0; i < 3; i++) {
      timer.setRemainingTime(0)
      timer.getState().tick(timer)
      expect(timer.getCompletedSessions()).toBe(i + 1)
      
      timer.setRemainingTime(0)
      timer.getState().tick(timer)
    }
    
    timer.setRemainingTime(0)
    timer.getState().tick(timer)
    
    expect(timer.getPhase()).toBe(PomodoroPhase.LongBreak)
  })

  it('should decrement time on tick', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    new StartCommand(timer).execute()
    const initialTime = timer.getRemainingTime()
    
    timer.getState().tick(timer)
    
    expect(timer.getRemainingTime()).toBe(initialTime - 1)
  })

  it('should allow unsubscribe from observers', () => {
    const timer = new PomodoroTimer(mockSettings)
    
    const mockObserver: PomodoroObserver = {
      onStateChange: jest.fn(),
      onPhaseComplete: jest.fn(),
      onSessionComplete: jest.fn()
    }
    
    const unsubscribe = timer.subscribe(mockObserver)
    unsubscribe()
    
    new StartCommand(timer).execute()
    
    expect(mockObserver.onStateChange).not.toHaveBeenCalled()
  })
})
