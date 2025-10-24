import { LocalStoragePomodoroRepository, PomodoroState } from '@/lib/study-tools/pomodoro/PomodoroRepository'
import { PomodoroPhase } from '@/lib/study-tools/pomodoro/types'

describe('Pomodoro Repository Persistence', () => {
  let repository: LocalStoragePomodoroRepository
  let mockLocalStorage: Record<string, string>

  beforeEach(() => {
    mockLocalStorage = {}

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockLocalStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockLocalStorage[key] = value
        },
        removeItem: (key: string) => {
          delete mockLocalStorage[key]
        }
      },
      writable: true
    })

    repository = new LocalStoragePomodoroRepository()
  })

  it('should save pomodoro state to localStorage', () => {
    const state: PomodoroState = {
      phase: PomodoroPhase.Work,
      remainingTime: 1500,
      completedSessions: 0,
      state: 'RUNNING',
      timestamp: Date.now()
    }

    repository.save(state)

    const savedData = mockLocalStorage['pomodoro-state']
    expect(savedData).toBeDefined()
    
    const parsedState = JSON.parse(savedData)
    expect(parsedState.phase).toBe(PomodoroPhase.Work)
    expect(parsedState.remainingTime).toBe(1500)
    expect(parsedState.state).toBe('RUNNING')
  })

  it('should load pomodoro state from localStorage', () => {
    const state: PomodoroState = {
      phase: PomodoroPhase.ShortBreak,
      remainingTime: 300,
      completedSessions: 2,
      state: 'PAUSED',
      timestamp: Date.now()
    }

    mockLocalStorage['pomodoro-state'] = JSON.stringify(state)

    const loadedState = repository.load()

    expect(loadedState).not.toBeNull()
    expect(loadedState?.phase).toBe(PomodoroPhase.ShortBreak)
    expect(loadedState?.remainingTime).toBe(300)
    expect(loadedState?.completedSessions).toBe(2)
    expect(loadedState?.state).toBe('PAUSED')
  })

  it('should return null if no state exists', () => {
    const loadedState = repository.load()
    expect(loadedState).toBeNull()
  })

  it('should clear pomodoro state from localStorage', () => {
    const state: PomodoroState = {
      phase: PomodoroPhase.Work,
      remainingTime: 1500,
      completedSessions: 1,
      state: 'RUNNING',
      timestamp: Date.now()
    }

    repository.save(state)
    expect(mockLocalStorage['pomodoro-state']).toBeDefined()

    repository.clear()
    expect(mockLocalStorage['pomodoro-state']).toBeUndefined()
  })

  it('should not load expired state (older than 1 hour)', () => {
    const oldState: PomodoroState = {
      phase: PomodoroPhase.Work,
      remainingTime: 1500,
      completedSessions: 0,
      state: 'RUNNING',
      timestamp: Date.now() - (2 * 60 * 60 * 1000)
    }

    mockLocalStorage['pomodoro-state'] = JSON.stringify(oldState)

    const loadedState = repository.load()

    expect(loadedState).toBeNull()
    expect(mockLocalStorage['pomodoro-state']).toBeUndefined()
  })

  it('should handle corrupted localStorage data gracefully', () => {
    mockLocalStorage['pomodoro-state'] = 'invalid-json'

    const loadedState = repository.load()

    expect(loadedState).toBeNull()
  })

  it('should update timestamp when saving', () => {
    const state: PomodoroState = {
      phase: PomodoroPhase.Work,
      remainingTime: 1500,
      completedSessions: 0,
      state: 'RUNNING',
      timestamp: 0
    }

    repository.save(state)

    const savedData = mockLocalStorage['pomodoro-state']
    const parsedState = JSON.parse(savedData)

    expect(parsedState.timestamp).toBeGreaterThan(Date.now() - 1000)
    expect(parsedState.timestamp).toBeLessThanOrEqual(Date.now())
  })
})
