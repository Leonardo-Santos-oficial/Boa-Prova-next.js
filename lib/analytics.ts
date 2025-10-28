export type StudyToolName = 'Quiz' | 'Pomodoro' | 'Study Plan'
export type StudyToolAction = 
  | 'started' 
  | 'completed' 
  | 'paused' 
  | 'resumed' 
  | 'reset'
  | 'skipped'
  | 'generated'

export type AdEventType = 'impression' | 'loaded' | 'error' | 'clicked' | 'viewable'

interface AnalyticsEvent {
  tool: StudyToolName
  action: StudyToolAction
  timestamp: number
  metadata?: Record<string, unknown>
}

interface AdEvent {
  type: AdEventType
  adId: string
  position: string
  timestamp: number
  metadata?: Record<string, unknown>
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private adEvents: AdEvent[] = []

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

  trackAdEvent(type: AdEventType, adId: string, position: string, metadata?: Record<string, unknown>): void {
    const event: AdEvent = {
      type,
      adId,
      position,
      timestamp: Date.now(),
      metadata
    }

    this.adEvents.push(event)

    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log('[Ad Analytics]', event)
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  getAdEvents(): AdEvent[] {
    return [...this.adEvents]
  }

  clearEvents(): void {
    this.events = []
  }

  clearAdEvents(): void {
    this.adEvents = []
  }

  getAdMetrics(): {
    totalImpressions: number
    totalLoaded: number
    totalErrors: number
    errorRate: number
  } {
    const totalImpressions = this.adEvents.filter(e => e.type === 'impression').length
    const totalLoaded = this.adEvents.filter(e => e.type === 'loaded').length
    const totalErrors = this.adEvents.filter(e => e.type === 'error').length

    return {
      totalImpressions,
      totalLoaded,
      totalErrors,
      errorRate: totalImpressions > 0 ? totalErrors / totalImpressions : 0
    }
  }
}

export const analytics = new Analytics()
export const trackStudyToolUsage = analytics.trackStudyToolUsage.bind(analytics)
export const trackAdEvent = analytics.trackAdEvent.bind(analytics)

