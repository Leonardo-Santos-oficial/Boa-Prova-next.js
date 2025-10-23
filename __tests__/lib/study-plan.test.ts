import { DefaultStudyPlanGenerator } from '@/lib/study-tools/study-plan/StudyPlanGenerator'
import { StudyStrategyType, StudyTopic } from '@/lib/study-tools/study-plan/types'
import { IntensiveStrategy, RegularStrategy, LightStrategy } from '@/lib/study-tools/study-plan/strategies'

describe('Study Plan Strategy Pattern', () => {
  const mockTopics: StudyTopic[] = [
    {
      id: '1',
      title: 'High Priority Topic',
      estimatedHours: 10,
      priority: 'HIGH',
      completed: false
    },
    {
      id: '2',
      title: 'Medium Priority Topic',
      estimatedHours: 8,
      priority: 'MEDIUM',
      completed: false
    },
    {
      id: '3',
      title: 'Low Priority Topic',
      estimatedHours: 6,
      priority: 'LOW',
      completed: false
    }
  ]

  it('should create intensive study plan', () => {
    const generator = new DefaultStudyPlanGenerator()
    const plan = generator.generatePlan(mockTopics, StudyStrategyType.Intensive)
    
    expect(plan.strategy).toBe(StudyStrategyType.Intensive)
    expect(plan.topics).toHaveLength(3)
    expect(plan.sessions.length).toBeGreaterThan(0)
  })

  it('should create regular study plan', () => {
    const generator = new DefaultStudyPlanGenerator()
    const plan = generator.generatePlan(mockTopics, StudyStrategyType.Regular)
    
    expect(plan.strategy).toBe(StudyStrategyType.Regular)
    expect(plan.topics).toHaveLength(3)
  })

  it('should create light study plan', () => {
    const generator = new DefaultStudyPlanGenerator()
    const plan = generator.generatePlan(mockTopics, StudyStrategyType.Light)
    
    expect(plan.strategy).toBe(StudyStrategyType.Light)
    expect(plan.topics).toHaveLength(3)
  })

  it('should prioritize high priority topics first', () => {
    const strategy = new IntensiveStrategy()
    const sessions = strategy.distributeTopics(mockTopics, 10)
    
    const firstSession = sessions[0]
    const firstTopic = mockTopics.find(t => t.id === firstSession.topicId)
    
    expect(firstTopic?.priority).toBe('HIGH')
  })

  it('should calculate correct daily hours for intensive strategy', () => {
    const strategy = new IntensiveStrategy()
    expect(strategy.calculateDailyHours()).toBe(8)
  })

  it('should calculate correct daily hours for regular strategy', () => {
    const strategy = new RegularStrategy()
    expect(strategy.calculateDailyHours()).toBe(4)
  })

  it('should calculate correct daily hours for light strategy', () => {
    const strategy = new LightStrategy()
    expect(strategy.calculateDailyHours()).toBe(2)
  })

  it('should distribute topics across days', () => {
    const strategy = new RegularStrategy()
    const sessions = strategy.distributeTopics(mockTopics, 10)
    
    const uniqueDays = new Set(
      sessions.map(s => s.scheduledDate.toDateString())
    )
    
    expect(uniqueDays.size).toBeGreaterThan(1)
  })

  it('should respect max session duration', () => {
    const strategy = new IntensiveStrategy()
    const sessions = strategy.distributeTopics(mockTopics, 10)
    
    sessions.forEach(session => {
      expect(session.duration).toBeLessThanOrEqual(3)
    })
  })

  it('should create sessions for all topic hours', () => {
    const strategy = new RegularStrategy()
    const sessions = strategy.distributeTopics(mockTopics, 10)
    
    const totalSessionHours = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalTopicHours = mockTopics.reduce((sum, t) => sum + t.estimatedHours, 0)
    
    expect(totalSessionHours).toBe(totalTopicHours)
  })

  it('should generate plan with target date', () => {
    const generator = new DefaultStudyPlanGenerator()
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)
    
    const plan = generator.generatePlan(mockTopics, StudyStrategyType.Regular, 'test-user', targetDate)
    
    expect(plan.targetDate).toEqual(targetDate)
    expect(plan.userId).toBe('test-user')
  })
})
