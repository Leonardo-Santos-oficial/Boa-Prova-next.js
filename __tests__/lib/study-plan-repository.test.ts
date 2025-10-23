import { InMemoryStudyPlanRepository } from '@/lib/study-tools/study-plan/InMemoryRepository'
import { StudyPlan, StudyStrategyType } from '@/lib/study-tools/study-plan/types'

describe('StudyPlanRepository', () => {
  let repository: InMemoryStudyPlanRepository

  beforeEach(() => {
    repository = new InMemoryStudyPlanRepository()
  })

  const createMockPlan = (userId: string = 'test-user'): StudyPlan => ({
    id: 'plan-1',
    userId,
    topics: [
      {
        id: 'topic-1',
        title: 'TypeScript Basics',
        estimatedHours: 10,
        priority: 'HIGH',
        completed: false
      }
    ],
    sessions: [
      {
        id: 'session-1',
        topicId: 'topic-1',
        duration: 2,
        completed: false,
        scheduledDate: new Date('2025-01-01')
      }
    ],
    strategy: StudyStrategyType.Regular,
    createdAt: new Date('2025-01-01'),
    targetDate: new Date('2025-02-01')
  })

  describe('save and load', () => {
    it('should save and load a study plan', async () => {
      const plan = createMockPlan()
      
      await repository.save(plan)
      const loaded = await repository.load(plan.userId)
      
      expect(loaded).not.toBeNull()
      expect(loaded?.id).toBe(plan.id)
      expect(loaded?.userId).toBe(plan.userId)
      expect(loaded?.topics).toHaveLength(1)
      expect(loaded?.sessions).toHaveLength(1)
    })

    it('should return null when plan does not exist', async () => {
      const loaded = await repository.load('non-existent-user')
      
      expect(loaded).toBeNull()
    })

    it('should overwrite existing plan', async () => {
      const plan1 = createMockPlan('user-1')
      const plan2 = { ...createMockPlan('user-1'), id: 'plan-2' }
      
      await repository.save(plan1)
      await repository.save(plan2)
      const loaded = await repository.load('user-1')
      
      expect(loaded?.id).toBe('plan-2')
    })
  })

  describe('delete', () => {
    it('should delete a study plan', async () => {
      const plan = createMockPlan()
      
      await repository.save(plan)
      await repository.delete(plan.userId)
      const loaded = await repository.load(plan.userId)
      
      expect(loaded).toBeNull()
    })

    it('should not throw when deleting non-existent plan', async () => {
      await expect(repository.delete('non-existent-user')).resolves.not.toThrow()
    })
  })

  describe('exists', () => {
    it('should return true when plan exists', async () => {
      const plan = createMockPlan()
      
      await repository.save(plan)
      const exists = await repository.exists(plan.userId)
      
      expect(exists).toBe(true)
    })

    it('should return false when plan does not exist', async () => {
      const exists = await repository.exists('non-existent-user')
      
      expect(exists).toBe(false)
    })
  })

  describe('isolation', () => {
    it('should isolate plans by userId', async () => {
      const plan1 = createMockPlan('user-1')
      const plan2 = createMockPlan('user-2')
      
      await repository.save(plan1)
      await repository.save(plan2)
      
      const loaded1 = await repository.load('user-1')
      const loaded2 = await repository.load('user-2')
      
      expect(loaded1?.userId).toBe('user-1')
      expect(loaded2?.userId).toBe('user-2')
    })
  })

  describe('data integrity', () => {
    it('should preserve all plan properties', async () => {
      const plan = createMockPlan()
      
      await repository.save(plan)
      const loaded = await repository.load(plan.userId)
      
      expect(loaded?.strategy).toBe(StudyStrategyType.Regular)
      expect(loaded?.topics[0].priority).toBe('HIGH')
      expect(loaded?.sessions[0].duration).toBe(2)
    })

    it('should create deep copy to prevent mutations', async () => {
      const plan = createMockPlan()
      
      await repository.save(plan)
      plan.topics[0].title = 'Modified Title'
      
      const loaded = await repository.load(plan.userId)
      expect(loaded?.topics[0].title).toBe('TypeScript Basics')
    })
  })
})
