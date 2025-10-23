import {
  StudyPlan,
  StudyPlanGenerator,
  StudyPlanStrategy,
  StudyStrategyType,
  StudyTopic
} from './types'
import { IntensiveStrategy, RegularStrategy, LightStrategy } from './strategies'

export class DefaultStudyPlanGenerator implements StudyPlanGenerator {
  private strategies: Map<StudyStrategyType, StudyPlanStrategy> = new Map()

  constructor() {
    this.strategies.set(StudyStrategyType.Intensive, new IntensiveStrategy())
    this.strategies.set(StudyStrategyType.Regular, new RegularStrategy())
    this.strategies.set(StudyStrategyType.Light, new LightStrategy())
  }

  generatePlan(
    topics: StudyTopic[],
    strategyType: StudyStrategyType,
    userId: string = 'guest-user',
    targetDate?: Date
  ): StudyPlan {
    const strategy = this.strategies.get(strategyType)
    
    if (!strategy) {
      throw new Error(`Unknown strategy type: ${strategyType}`)
    }

    const days = this.calculateDays(topics, strategy, targetDate)
    const sessions = strategy.distributeTopics(topics, days)

    return {
      id: `plan-${Date.now()}`,
      userId,
      topics: JSON.parse(JSON.stringify(topics)),
      sessions,
      strategy: strategyType,
      createdAt: new Date(),
      targetDate
    }
  }

  private calculateDays(
    topics: StudyTopic[],
    strategy: StudyPlanStrategy,
    targetDate?: Date
  ): number {
    if (targetDate) {
      const now = new Date()
      const diffTime = targetDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return Math.max(diffDays, 1)
    }

    const totalHours = topics.reduce((sum, topic) => sum + topic.estimatedHours, 0)
    const dailyHours = strategy.calculateDailyHours()
    return Math.ceil(totalHours / dailyHours)
  }
}
