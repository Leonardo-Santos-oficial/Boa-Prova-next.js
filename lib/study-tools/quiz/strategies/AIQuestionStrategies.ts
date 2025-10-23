import { Question, QuestionDraft, QuestionType, QuestionGenerationStrategy } from '../types'
import { QuizAIClient } from '../ai/QuizAIClient'
import { createQuestionId } from '../utils'

const AI_MULTIPLE_CHOICE_PREFIX = 'ai-mcq'
const AI_TRUE_FALSE_PREFIX = 'ai-tf'

abstract class BaseAIQuestionStrategy implements QuestionGenerationStrategy {
  constructor(protected readonly aiClient: QuizAIClient) {}

  abstract supports(type: QuestionType): boolean
  protected abstract getType(): QuestionType
  protected abstract getPrefix(): string

  isAvailable(): boolean {
    return this.aiClient.canGenerate()
  }

  async generate(content: string, count: number): Promise<Question[]> {
    const type = this.getType()
    const drafts = await this.aiClient.generate(content, type, count)
    return drafts.map((draft, index) => this.toQuestion(draft, index, type))
  }

  private toQuestion(draft: QuestionDraft, index: number, type: QuestionType): Question {
    return {
      id: createQuestionId(this.getPrefix(), index),
      text: draft.text,
      options: draft.options,
      correctAnswer: draft.correctAnswer,
      explanation: draft.explanation,
      type
    }
  }
}

export class AIMultipleChoiceStrategy extends BaseAIQuestionStrategy {
  supports(type: QuestionType): boolean {
    return type === QuestionType.MultipleChoice
  }

  protected getType(): QuestionType {
    return QuestionType.MultipleChoice
  }

  protected getPrefix(): string {
    return AI_MULTIPLE_CHOICE_PREFIX
  }
}

export class AITrueFalseStrategy extends BaseAIQuestionStrategy {
  supports(type: QuestionType): boolean {
    return type === QuestionType.TrueFalse
  }

  protected getType(): QuestionType {
    return QuestionType.TrueFalse
  }

  protected getPrefix(): string {
    return AI_TRUE_FALSE_PREFIX
  }
}
