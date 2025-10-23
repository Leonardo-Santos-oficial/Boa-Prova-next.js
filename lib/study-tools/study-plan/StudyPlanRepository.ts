import { StudyPlan } from './types'

export interface StudyPlanRepository {
  save(plan: StudyPlan): Promise<void>
  load(userId: string): Promise<StudyPlan | null>
  delete(userId: string): Promise<void>
  exists(userId: string): Promise<boolean>
}
