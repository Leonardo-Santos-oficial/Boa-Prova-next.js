import { StudyPlan } from './types'
import { StudyPlanRepository } from './StudyPlanRepository'

export class InMemoryStudyPlanRepository implements StudyPlanRepository {
  private storage = new Map<string, StudyPlan>()

  async save(plan: StudyPlan): Promise<void> {
    this.storage.set(plan.userId, JSON.parse(JSON.stringify(plan)))
  }

  async load(userId: string): Promise<StudyPlan | null> {
    const plan = this.storage.get(userId)
    return plan ? JSON.parse(JSON.stringify(plan)) : null
  }

  async delete(userId: string): Promise<void> {
    this.storage.delete(userId)
  }

  async exists(userId: string): Promise<boolean> {
    return this.storage.has(userId)
  }

  clear(): void {
    this.storage.clear()
  }
}
