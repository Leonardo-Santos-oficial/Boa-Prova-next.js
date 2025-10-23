import { QuestionDraft, QuestionType } from '../types'

export interface QuizAIClient {
  canGenerate(): boolean
  generate(content: string, type: QuestionType, count: number): Promise<QuestionDraft[]>
}
