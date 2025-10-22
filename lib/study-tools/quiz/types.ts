export interface Question {
  id: string
  text: string
  type: QuestionType
  options: string[]
  correctAnswer: number
  explanation?: string
}

export enum QuestionType {
  MultipleChoice = 'MULTIPLE_CHOICE',
  TrueFalse = 'TRUE_FALSE',
  FillInTheBlank = 'FILL_IN_THE_BLANK'
}

export interface QuizData {
  id: string
  title: string
  questions: Question[]
  createdAt: Date
}

export interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  answeredQuestions: Map<string, number>
  startedAt: Date
  completedAt?: Date
}

export interface QuizState {
  getName(): string
  start(context: QuizContext): void
  answer(context: QuizContext, questionId: string, answerIndex: number): void
  complete(context: QuizContext): void
  review(context: QuizContext): void
  canAnswer(): boolean
  canComplete(): boolean
}

export interface QuizContext {
  setState(state: QuizState): void
  getQuiz(): QuizData
  getCurrentQuestionIndex(): number
  setCurrentQuestionIndex(index: number): void
  recordAnswer(questionId: string, answerIndex: number): void
  getAnswers(): Map<string, number>
  calculateScore(): number
}

export interface QuestionGenerationStrategy {
  generate(content: string, count: number): Promise<Question[]>
  supports(type: QuestionType): boolean
}
