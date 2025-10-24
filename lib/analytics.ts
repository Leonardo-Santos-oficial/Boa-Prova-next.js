export type StudyToolName = 'Quiz' | 'Pomodoro' | 'Study Plan'
export type StudyToolAction = 
  | 'started' 
  | 'completed' 
  | 'paused' 
  | 'resumed' 
  | 'reset'
  | 'skipped'
  | 'generated'

interface AnalyticsEvent {
  tool: StudyToolName
  action: StudyToolAction
  timestamp: number
  metadata?: Record<string, unknown>
}

class Analytics {
  private events: AnalyticsEvent[] = []

  trackStudyToolUsage(tool: StudyToolName, action: StudyToolAction, metadata?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      tool,
      action,
      timestamp: Date.now(),
      metadata
    }

    this.events.push(event)

    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log('[Analytics]', event)
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  clearEvents(): void {
    this.events = []
  }
}

export const analytics = new Analytics()
export const trackStudyToolUsage = analytics.trackStudyToolUsage.bind(analytics)
