import {
  StudyPlan,
  StudyPlanMemento,
  StudyPlanState,
  StudySession,
  StudyTopic
} from './types'

export class StudyPlanCaretaker {
  private history: StudyPlanMemento[] = []
  private maxHistorySize: number = 10

  save(plan: StudyPlan): void {
    const memento = this.createMemento(plan)
    
    this.history.push(memento)
    
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
  }

  restore(index: number): StudyPlanState | null {
    if (index < 0 || index >= this.history.length) {
      return null
    }

    return this.history[index].state
  }

  getLatest(): StudyPlanState | null {
    if (this.history.length === 0) {
      return null
    }

    return this.history[this.history.length - 1].state
  }

  getHistory(): StudyPlanMemento[] {
    return [...this.history]
  }

  clear(): void {
    this.history = []
  }

  private createMemento(plan: StudyPlan): StudyPlanMemento {
    const completedSessions = plan.sessions.filter(s => s.completed).length
    const totalHoursStudied = plan.sessions
      .filter(s => s.completed)
      .reduce((sum, s) => sum + s.duration, 0)

    return {
      state: {
        topics: JSON.parse(JSON.stringify(plan.topics)),
        sessions: JSON.parse(JSON.stringify(plan.sessions)),
        completedSessions,
        totalHoursStudied
      },
      timestamp: new Date()
    }
  }
}

export class StudyPlanOriginator {
  constructor(private plan: StudyPlan) {}

  getPlan(): StudyPlan {
    return this.plan
  }

  completeSession(sessionId: string): void {
    const session = this.plan.sessions.find(s => s.id === sessionId)
    
    if (session && !session.completed) {
      session.completed = true
      session.completedDate = new Date()

      const topic = this.plan.topics.find(t => t.id === session.topicId)
      if (topic) {
        const topicSessions = this.plan.sessions.filter(s => s.topicId === topic.id)
        const allCompleted = topicSessions.every(s => s.completed)
        
        if (allCompleted) {
          topic.completed = true
        }
      }
    }
  }

  addTopic(topic: StudyTopic): void {
    this.plan.topics.push(topic)
  }

  removeTopic(topicId: string): void {
    this.plan.topics = this.plan.topics.filter(t => t.id !== topicId)
    this.plan.sessions = this.plan.sessions.filter(s => s.topicId !== topicId)
  }

  getProgress(): {
    completedTopics: number
    totalTopics: number
    completedSessions: number
    totalSessions: number
    hoursStudied: number
    totalHours: number
    percentageComplete: number
  } {
    const completedTopics = this.plan.topics.filter(t => t.completed).length
    const completedSessions = this.plan.sessions.filter(s => s.completed).length
    const hoursStudied = this.plan.sessions
      .filter(s => s.completed)
      .reduce((sum, s) => sum + s.duration, 0)
    const totalHours = this.plan.sessions.reduce((sum, s) => sum + s.duration, 0)

    return {
      completedTopics,
      totalTopics: this.plan.topics.length,
      completedSessions,
      totalSessions: this.plan.sessions.length,
      hoursStudied,
      totalHours,
      percentageComplete: totalHours > 0 ? Math.round((hoursStudied / totalHours) * 100) : 0
    }
  }

  restoreFromMemento(state: StudyPlanState): void {
    this.plan.topics = JSON.parse(JSON.stringify(state.topics))
    this.plan.sessions = JSON.parse(JSON.stringify(state.sessions))
  }
}
