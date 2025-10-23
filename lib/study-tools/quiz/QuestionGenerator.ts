import { Question, QuestionType, QuestionGenerationStrategy } from './types'
import { QuizAIClient } from './ai/QuizAIClient'
import { OpenAIQuizClient } from './ai/OpenAIQuizClient'
import { AIMultipleChoiceStrategy, AITrueFalseStrategy } from './strategies/AIQuestionStrategies'
import { MultipleChoiceStrategy, TrueFalseStrategy } from './strategies/HeuristicStrategies'

const REGISTERABLE_TYPES: QuestionType[] = [
  QuestionType.MultipleChoice,
  QuestionType.TrueFalse,
  QuestionType.FillInTheBlank
]

export class QuestionGenerator {
  private readonly strategies = new Map<QuestionType, QuestionGenerationStrategy[]>()

  constructor(
    customStrategies?: QuestionGenerationStrategy[],
    aiClient?: QuizAIClient
  ) {
    const strategies = customStrategies ?? this.buildDefaultStrategies(aiClient)
    strategies.forEach(strategy => this.registerStrategy(strategy))
  }

  registerStrategy(strategy: QuestionGenerationStrategy): void {
    REGISTERABLE_TYPES.forEach(type => {
      if (!strategy.supports(type)) {
        return
      }

      const registered = this.strategies.get(type) ?? []
      this.strategies.set(type, [...registered, strategy])
    })
  }

  async generateQuestions(
    content: string,
    type: QuestionType,
    count: number = 5
  ): Promise<Question[]> {
    const strategies = this.strategies.get(type) ?? []

    if (strategies.length === 0) {
      throw new Error(`No strategy found for question type: ${type}`)
    }

    const errors: unknown[] = []

    for (const strategy of strategies) {
      if (!strategy.isAvailable()) {
        continue
      }

      try {
        const questions = await strategy.generate(content, count)
        if (questions.length > 0) {
          return questions.slice(0, count)
        }
      } catch (error) {
        errors.push(error)
      }
    }

    if (errors.length > 0) {
      console.warn(`All strategies failed for question type ${type}`, errors)
    }

    throw new Error(`No available strategy succeeded for question type: ${type}`)
  }

  async generateMixedQuiz(content: string, totalQuestions: number = 10): Promise<Question[]> {
    const mcqCount = Math.ceil(totalQuestions * 0.6)
    const tfCount = Math.max(totalQuestions - mcqCount, 0)

    const mcqQuestions = await this.generateQuestions(content, QuestionType.MultipleChoice, mcqCount)
    const tfQuestions = tfCount > 0
      ? await this.generateQuestions(content, QuestionType.TrueFalse, tfCount)
      : []

    const combined = [...mcqQuestions, ...tfQuestions]

    if (combined.length === 0) {
      throw new Error('Failed to generate quiz questions')
    }

    return combined.sort(() => Math.random() - 0.5)
  }

  private buildDefaultStrategies(aiClient?: QuizAIClient): QuestionGenerationStrategy[] {
    const client = aiClient ?? new OpenAIQuizClient()

    return [
      new AIMultipleChoiceStrategy(client),
      new AITrueFalseStrategy(client),
      new MultipleChoiceStrategy(),
      new TrueFalseStrategy()
    ]
  }
}
