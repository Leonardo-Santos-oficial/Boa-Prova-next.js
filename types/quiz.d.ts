export interface Quiz {
  id: string
  title: string
  questions: QuizQuestion[]
  createdAt: Date
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  correctAnswerId: string
  explanation?: string
}

export interface QuizOption {
  id: string
  text: string
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  answeredQuestions: Map<string, string>
}

export interface QuizOptions {
  questionCount: number
  difficulty: 'easy' | 'medium' | 'hard'
}
