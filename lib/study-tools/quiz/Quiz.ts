import { QuizState, QuizContext, QuizData, Question } from './types'
import { NotStartedState } from './states'

export class Quiz implements QuizContext {
  private state: QuizState
  private currentQuestionIndex: number = 0
  private answers: Map<string, number> = new Map()

  constructor(private readonly quiz: QuizData) {
    this.state = new NotStartedState()
  }

  setState(state: QuizState): void {
    this.state = state
  }

  getState(): QuizState {
    return this.state
  }

  getQuiz(): QuizData {
    return this.quiz
  }

  getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex
  }

  setCurrentQuestionIndex(index: number): void {
    this.currentQuestionIndex = index
  }

  recordAnswer(questionId: string, answerIndex: number): void {
    this.answers.set(questionId, answerIndex)
  }

  getAnswers(): Map<string, number> {
    return new Map(this.answers)
  }

  calculateScore(): number {
    let correct = 0
    
    this.quiz.questions.forEach((question) => {
      const userAnswer = this.answers.get(question.id)
      if (userAnswer === question.correctAnswer) {
        correct++
      }
    })

    return Math.round((correct / this.quiz.questions.length) * 100)
  }

  start(): void {
    this.state.start(this)
  }

  answerQuestion(questionId: string, answerIndex: number): void {
    this.state.answer(this, questionId, answerIndex)
  }

  complete(): void {
    this.state.complete(this)
  }

  review(): void {
    this.state.review(this)
  }

  getCurrentQuestion(): Question | undefined {
    return this.quiz.questions[this.currentQuestionIndex]
  }

  isAnswered(questionId: string): boolean {
    return this.answers.has(questionId)
  }

  getUserAnswer(questionId: string): number | undefined {
    return this.answers.get(questionId)
  }

  reset(): void {
    this.state = new NotStartedState()
    this.currentQuestionIndex = 0
    this.answers.clear()
  }
}
