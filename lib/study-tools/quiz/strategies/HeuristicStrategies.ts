import { Question, QuestionGenerationStrategy, QuestionType } from '../types'
import { createQuestionId } from '../utils'

const HEURISTIC_MULTIPLE_CHOICE_PREFIX = 'mcq'
const HEURISTIC_TRUE_FALSE_PREFIX = 'tf'

function stripHtml(content: string): string {
  return content.replace(/<[^>]*>/g, ' ')
}

export class MultipleChoiceStrategy implements QuestionGenerationStrategy {
  supports(type: QuestionType): boolean {
    return type === QuestionType.MultipleChoice
  }

  isAvailable(): boolean {
    return true
  }

  async generate(content: string, count: number): Promise<Question[]> {
    const questions: Question[] = []
    const plainText = stripHtml(content)

    const paragraphs = plainText
      .split(/\n\n/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 50)

    for (let index = 0; index < Math.min(count, paragraphs.length); index++) {
      const paragraph = paragraphs[index]
      const sentences = paragraph
        .split(/[.!?]/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 20)

      if (sentences.length === 0) {
        continue
      }

      const factSentence = sentences[0]
      const fallbackOptions = this.buildFallbackOptions(factSentence)

      questions.push({
        id: createQuestionId(HEURISTIC_MULTIPLE_CHOICE_PREFIX, index),
        text: `Qual das alternativas melhor representa o conceito apresentado: "${factSentence.substring(0, 100)}..."?`,
        type: QuestionType.MultipleChoice,
        options: fallbackOptions,
        correctAnswer: 0,
        explanation: 'Esta informação está presente no texto original.'
      })
    }

    return questions
  }

  private buildFallbackOptions(correctOption: string): string[] {
    const baseOption = correctOption.trim()

    if (baseOption.length === 0) {
      return ['Informação não encontrada', 'Alternativa A', 'Alternativa B', 'Alternativa C']
    }

    return [
      baseOption,
      'Alternativa gerada automaticamente A',
      'Alternativa gerada automaticamente B',
      'Alternativa gerada automaticamente C'
    ]
  }
}

export class TrueFalseStrategy implements QuestionGenerationStrategy {
  supports(type: QuestionType): boolean {
    return type === QuestionType.TrueFalse
  }

  isAvailable(): boolean {
    return true
  }

  async generate(content: string, count: number): Promise<Question[]> {
    const questions: Question[] = []
    const sentences = stripHtml(content)
      .split(/[.!?]/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 30)

    for (let index = 0; index < Math.min(count, sentences.length); index++) {
      const sentence = sentences[index]

      questions.push({
        id: createQuestionId(HEURISTIC_TRUE_FALSE_PREFIX, index),
        text: sentence,
        type: QuestionType.TrueFalse,
        options: ['Verdadeiro', 'Falso'],
        correctAnswer: 0,
        explanation: 'Esta afirmação é verdadeira conforme o texto.'
      })
    }

    return questions
  }
}
