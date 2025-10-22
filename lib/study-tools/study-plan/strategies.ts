import {
  StudyPlanStrategy,
  StudyStrategyType,
  StudyTopic,
  StudySession
} from './types'

abstract class BaseStudyStrategy implements StudyPlanStrategy {
  abstract getName(): StudyStrategyType
  abstract calculateDailyHours(): number
  abstract recommendBreakFrequency(): number

  distributeTopics(topics: StudyTopic[], days: number): StudySession[] {
    const sessions: StudySession[] = []
    const dailyHours = this.calculateDailyHours()
    
    const sortedTopics = this.prioritizeTopics(topics)
    const totalHours = sortedTopics.reduce((sum, topic) => sum + topic.estimatedHours, 0)
    
    let currentDay = 0
    let currentDayHours = 0
    const startDate = new Date()

    sortedTopics.forEach(topic => {
      let remainingHours = topic.estimatedHours

      while (remainingHours > 0) {
        const availableHours = dailyHours - currentDayHours
        const sessionDuration = Math.min(remainingHours, availableHours, this.getMaxSessionDuration())

        if (sessionDuration > 0) {
          const sessionDate = new Date(startDate)
          sessionDate.setDate(sessionDate.getDate() + currentDay)

          sessions.push({
            id: `session-${Date.now()}-${sessions.length}`,
            topicId: topic.id,
            duration: sessionDuration,
            completed: false,
            scheduledDate: sessionDate
          })

          remainingHours -= sessionDuration
          currentDayHours += sessionDuration
        }

        if (currentDayHours >= dailyHours) {
          currentDay++
          currentDayHours = 0
        }
      }
    })

    return sessions
  }

  protected prioritizeTopics(topics: StudyTopic[]): StudyTopic[] {
    const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    
    return [...topics].sort((a, b) => {
      const weightDiff = priorityWeight[b.priority] - priorityWeight[a.priority]
      if (weightDiff !== 0) return weightDiff
      return a.estimatedHours - b.estimatedHours
    })
  }

  protected abstract getMaxSessionDuration(): number
}

export class IntensiveStrategy extends BaseStudyStrategy {
  getName(): StudyStrategyType {
    return StudyStrategyType.Intensive
  }

  calculateDailyHours(): number {
    return 8
  }

  recommendBreakFrequency(): number {
    return 50
  }

  protected getMaxSessionDuration(): number {
    return 3
  }
}

export class RegularStrategy extends BaseStudyStrategy {
  getName(): StudyStrategyType {
    return StudyStrategyType.Regular
  }

  calculateDailyHours(): number {
    return 4
  }

  recommendBreakFrequency(): number {
    return 45
  }

  protected getMaxSessionDuration(): number {
    return 2
  }
}

export class LightStrategy extends BaseStudyStrategy {
  getName(): StudyStrategyType {
    return StudyStrategyType.Light
  }

  calculateDailyHours(): number {
    return 2
  }

  recommendBreakFrequency(): number {
    return 30
  }

  protected getMaxSessionDuration(): number {
    return 1
  }
}
