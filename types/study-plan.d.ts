export interface StudyPlan {
  id: string
  userId: string
  items: StudyPlanItem[]
  createdAt: Date
  updatedAt: Date
}

export interface StudyPlanItem {
  id: string
  contentId: string
  title: string
  uri: string
  addedAt: Date
  progress: number
  completed: boolean
  notes?: string
  category?: string
}
