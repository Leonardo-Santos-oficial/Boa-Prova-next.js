import { Question, QuestionType, QuestionGenerationStrategy } from './types'

export class MultipleChoiceStrategy implements QuestionGenerationStrategy {
  supports(type: QuestionType): boolean {
    return type === QuestionType.MultipleChoice
  }

  async generate(content: string, count: number): Promise<Question[]> {
    const questions: Question[] = []
    
    const paragraphs = content
      .replace(/<[^>]*>/g, '')
      .split(/\n\n/)
      .filter(p => p.trim().length > 50)

    for (let i = 0; i < Math.min(count, paragraphs.length); i++) {
      const paragraph = paragraphs[i]
      const sentences = paragraph.split(/[.!?]/).filter(s => s.trim().length > 20)
      
      if (sentences.length > 0) {
        const factSentence = sentences[0].trim()
        
        questions.push({
          id: `mcq-${Date.now()}-${i}`,
          text: `Qual das alternativas melhor representa o conceito apresentado: "${factSentence.substring(0, 100)}..."?`,
          type: QuestionType.MultipleChoice,
          options: [
            factSentence,
            'Alternativa gerada automaticamente A',
            'Alternativa gerada automaticamente B',
            'Alternativa gerada automaticamente C'
          ],
          correctAnswer: 0,
          explanation: 'Esta informação está presente no texto original.'
        })
      }
    }

    return questions
  }
}

export class TrueFalseStrategy implements QuestionGenerationStrategy {
  supports(type: QuestionType): boolean {
    return type === QuestionType.TrueFalse
  }

  async generate(content: string, count: number): Promise<Question[]> {
    const questions: Question[] = []
    
    const sentences = content
      .replace(/<[^>]*>/g, '')
      .split(/[.!?]/)
      .filter(s => s.trim().length > 30)

    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i].trim()
      
      questions.push({
        id: `tf-${Date.now()}-${i}`,
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

export class QuestionGenerator {
  private strategies: Map<QuestionType, QuestionGenerationStrategy> = new Map()

  constructor() {
    this.registerStrategy(new MultipleChoiceStrategy())
    this.registerStrategy(new TrueFalseStrategy())
  }

  registerStrategy(strategy: QuestionGenerationStrategy): void {
    if (strategy.supports(QuestionType.MultipleChoice)) {
      this.strategies.set(QuestionType.MultipleChoice, strategy)
    }
    if (strategy.supports(QuestionType.TrueFalse)) {
      this.strategies.set(QuestionType.TrueFalse, strategy)
    }
  }

  async generateQuestions(
    content: string,
    type: QuestionType,
    count: number = 5
  ): Promise<Question[]> {
    const strategy = this.strategies.get(type)
    
    if (!strategy) {
      throw new Error(`No strategy found for question type: ${type}`)
    }

    return strategy.generate(content, count)
  }

  async generateMixedQuiz(content: string, totalQuestions: number = 10): Promise<Question[]> {
    const mcqCount = Math.ceil(totalQuestions * 0.6)
    const tfCount = totalQuestions - mcqCount

    const mcqQuestions = await this.generateQuestions(content, QuestionType.MultipleChoice, mcqCount)
    const tfQuestions = await this.generateQuestions(content, QuestionType.TrueFalse, tfCount)

    return [...mcqQuestions, ...tfQuestions].sort(() => Math.random() - 0.5)
  }
}
