import { StudyPlan } from './types'
import { StudyPlanRepository } from './StudyPlanRepository'

const STORAGE_KEY_PREFIX = 'study-plan'

export class LocalStorageStudyPlanRepository implements StudyPlanRepository {
  private buildKey(userId: string): string {
    return `${STORAGE_KEY_PREFIX}-${userId}`
  }

  async save(plan: StudyPlan): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('LocalStorage not available in server-side environment')
    }

    const key = this.buildKey(plan.userId)
    const serialized = JSON.stringify({
      ...plan,
      createdAt: plan.createdAt.toISOString(),
      targetDate: plan.targetDate?.toISOString(),
      sessions: plan.sessions.map(session => ({
        ...session,
        scheduledDate: session.scheduledDate.toISOString(),
        completedDate: session.completedDate?.toISOString()
      }))
    })

    localStorage.setItem(key, serialized)
  }

  async load(userId: string): Promise<StudyPlan | null> {
    if (typeof window === 'undefined') {
      return null
    }

    const key = this.buildKey(userId)
    const data = localStorage.getItem(key)

    if (!data) {
      return null
    }

    try {
      const parsed = JSON.parse(data)
      
      type SerializedSession = {
        id: string
        topicId: string
        duration: number
        completed: boolean
        scheduledDate: string
        completedDate?: string
      }
      
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        targetDate: parsed.targetDate ? new Date(parsed.targetDate) : undefined,
        sessions: (parsed.sessions as SerializedSession[]).map((session) => ({
          ...session,
          scheduledDate: new Date(session.scheduledDate),
          completedDate: session.completedDate ? new Date(session.completedDate) : undefined
        }))
      }
    } catch (error) {
      console.error('Failed to parse study plan from storage:', error)
      return null
    }
  }

  async delete(userId: string): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    const key = this.buildKey(userId)
    localStorage.removeItem(key)
  }

  async exists(userId: string): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false
    }

    const key = this.buildKey(userId)
    return localStorage.getItem(key) !== null
  }
}
