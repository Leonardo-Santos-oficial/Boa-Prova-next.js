export interface StudySession {
  id: string
  topicId: string
  duration: number
  completed: boolean
  scheduledDate: Date
  completedDate?: Date
}

export interface StudyTopic {
  id: string
  title: string
  estimatedHours: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  completed: boolean
}

export interface StudyPlan {
  id: string
  userId: string
  topics: StudyTopic[]
  sessions: StudySession[]
  strategy: StudyStrategyType
  createdAt: Date
  targetDate?: Date
}

export enum StudyStrategyType {
  Intensive = 'INTENSIVE',
  Regular = 'REGULAR',
  Light = 'LIGHT'
}

export interface StudyPlanStrategy {
  getName(): StudyStrategyType
  calculateDailyHours(): number
  distributeTopics(topics: StudyTopic[], days: number): StudySession[]
  recommendBreakFrequency(): number
}

export interface StudyPlanMemento {
  state: StudyPlanState
  timestamp: Date
}

export interface StudyPlanState {
  topics: StudyTopic[]
  sessions: StudySession[]
  completedSessions: number
  totalHoursStudied: number
}

export interface StudyPlanGenerator {
  generatePlan(
    topics: StudyTopic[], 
    strategy: StudyStrategyType, 
    userId?: string,
    targetDate?: Date
  ): StudyPlan
}
