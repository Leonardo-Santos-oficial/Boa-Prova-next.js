import React, { useState, useEffect, useMemo } from 'react'
import { PomodoroTimer } from '@/lib/study-tools/pomodoro/PomodoroTimer'
import { PomodoroPhase, PomodoroSettings, PomodoroObserver } from '@/lib/study-tools/pomodoro/types'
import { StartCommand, PauseCommand, ResumeCommand, ResetCommand, SkipCommand } from '@/lib/study-tools/pomodoro/commands'
import { LocalStoragePomodoroRepository, PomodoroRepository } from '@/lib/study-tools/pomodoro/PomodoroRepository'
import { RunningState, PausedState } from '@/lib/study-tools/pomodoro/states'
import { trackStudyToolUsage } from '@/lib/analytics'

export function PomodoroComponent() {
  const [timer, setTimer] = useState<PomodoroTimer | null>(null)
  const [state, setState] = useState('IDLE')
  const [phase, setPhase] = useState<PomodoroPhase>(PomodoroPhase.Work)
  const [remainingTime, setRemainingTime] = useState(25 * 60)
  const [completedSessions, setCompletedSessions] = useState(0)

  const repository: PomodoroRepository = useMemo(() => new LocalStoragePomodoroRepository(), [])

  useEffect(() => {
    const settings: PomodoroSettings = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4
    }

    const pomodoroTimer = new PomodoroTimer(settings)

    const savedState = repository.load()
    if (savedState && savedState.state !== 'IDLE') {
      pomodoroTimer.setPhase(savedState.phase)
      pomodoroTimer.setRemainingTime(savedState.remainingTime)
      pomodoroTimer['completedSessions'] = savedState.completedSessions
      
      if (savedState.state === 'RUNNING') {
        pomodoroTimer.setState(new RunningState())
      } else if (savedState.state === 'PAUSED') {
        pomodoroTimer.setState(new PausedState())
      }
      
      setState(savedState.state)
      setPhase(savedState.phase)
      setRemainingTime(savedState.remainingTime)
      setCompletedSessions(savedState.completedSessions)
    }

    const observer: PomodoroObserver = {
      onStateChange: (newState, newPhase, newRemainingTime) => {
        setState(newState)
        setPhase(newPhase)
        setRemainingTime(newRemainingTime)
        
        repository.save({
          state: newState,
          phase: newPhase,
          remainingTime: newRemainingTime,
          completedSessions: pomodoroTimer.getCompletedSessions(),
          timestamp: Date.now()
        })
      },
      onPhaseComplete: (completedPhase: PomodoroPhase) => {
        if (typeof Audio !== 'undefined') {
          const audio = new Audio('/sounds/notification.mp3')
          audio.play().catch(() => {})
        }

        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('Pomodoro', {
            body: completedPhase === PomodoroPhase.Work ? 'Tempo de fazer uma pausa!' : 'Hora de voltar ao trabalho!',
            icon: '/icons/pomodoro.png'
          })
        }

        trackStudyToolUsage('Pomodoro', 'completed', { phase: completedPhase })
      },
      onSessionComplete: (sessions) => {
        setCompletedSessions(sessions)
      }
    }

    pomodoroTimer.subscribe(observer)
    setTimer(pomodoroTimer)

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      pomodoroTimer.stopTicking()
    }
  }, [repository])

  const handleStart = () => {
    if (!timer) return
    const command = new StartCommand(timer)
    command.execute()
    timer.startTicking()
    trackStudyToolUsage('Pomodoro', 'started')
  }

  const handlePause = () => {
    if (!timer) return
    const command = new PauseCommand(timer)
    command.execute()
    timer.stopTicking()
    trackStudyToolUsage('Pomodoro', 'paused')
  }

  const handleResume = () => {
    if (!timer) return
    const command = new ResumeCommand(timer)
    command.execute()
    timer.startTicking()
    trackStudyToolUsage('Pomodoro', 'resumed')
  }

  const handleReset = () => {
    if (!timer) return
    const command = new ResetCommand(timer)
    command.execute()
    timer.stopTicking()
    setCompletedSessions(0)
    repository.clear()
    trackStudyToolUsage('Pomodoro', 'reset')
  }

  const handleSkip = () => {
    if (!timer) return
    const command = new SkipCommand(timer)
    command.execute()
    trackStudyToolUsage('Pomodoro', 'skipped')
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseLabel = (): string => {
    switch (phase) {
      case PomodoroPhase.Work:
        return '⏰ Foco'
      case PomodoroPhase.ShortBreak:
        return '☕ Intervalo Curto'
      case PomodoroPhase.LongBreak:
        return '🌟 Intervalo Longo'
    }
  }

  const getPhaseColor = (): string => {
    switch (phase) {
      case PomodoroPhase.Work:
        return 'text-red-600 dark:text-red-400'
      case PomodoroPhase.ShortBreak:
        return 'text-green-600 dark:text-green-400'
      case PomodoroPhase.LongBreak:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">Cronômetro Pomodoro</h3>

      <div className="mb-6 text-center">
        <div className={`text-sm font-semibold mb-2 ${getPhaseColor()}`}>
          {getPhaseLabel()}
        </div>
        <div className="text-6xl font-bold mb-2">
          {formatTime(remainingTime)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          🍅 Sessões completadas: {completedSessions}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {state === 'IDLE' && (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ▶️ Iniciar
          </button>
        )}

        {state === 'RUNNING' && (
          <>
            <button
              onClick={handlePause}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              ⏸️ Pausar
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ⏭️ Pular
            </button>
          </>
        )}

        {state === 'PAUSED' && (
          <button
            onClick={handleResume}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ▶️ Retomar
          </button>
        )}

        {(state === 'RUNNING' || state === 'PAUSED') && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🔄 Reiniciar
          </button>
        )}
      </div>

      <div className="text-xs text-center text-gray-500 dark:text-gray-400">
        <p>⏰ Foco: 25min | ☕ Intervalo: 5min | 🌟 Intervalo Longo: 15min</p>
      </div>
    </div>
  )
}
