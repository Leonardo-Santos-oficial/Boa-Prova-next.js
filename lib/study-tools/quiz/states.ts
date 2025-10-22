import { QuizState, QuizContext } from './types'

export class NotStartedState implements QuizState {
  getName(): string {
    return 'NOT_STARTED'
  }

  start(context: QuizContext): void {
    context.setState(new InProgressState())
    context.setCurrentQuestionIndex(0)
  }

  answer(): void {
    throw new Error('Cannot answer questions before starting quiz')
  }

  complete(): void {
    throw new Error('Cannot complete quiz before starting')
  }

  review(): void {
    throw new Error('Cannot review quiz before starting')
  }

  canAnswer(): boolean {
    return false
  }

  canComplete(): boolean {
    return false
  }
}

export class InProgressState implements QuizState {
  getName(): string {
    return 'IN_PROGRESS'
  }

  start(): void {
    throw new Error('Quiz already started')
  }

  answer(context: QuizContext, questionId: string, answerIndex: number): void {
    context.recordAnswer(questionId, answerIndex)
    
    const currentIndex = context.getCurrentQuestionIndex()
    const totalQuestions = context.getQuiz().questions.length
    
    if (currentIndex < totalQuestions - 1) {
      context.setCurrentQuestionIndex(currentIndex + 1)
    }
  }

  complete(context: QuizContext): void {
    const answers = context.getAnswers()
    const totalQuestions = context.getQuiz().questions.length
    
    if (answers.size === totalQuestions) {
      context.setState(new CompletedState())
    } else {
      throw new Error('Cannot complete quiz with unanswered questions')
    }
  }

  review(): void {
    throw new Error('Cannot review quiz while in progress')
  }

  canAnswer(): boolean {
    return true
  }

  canComplete(): boolean {
    return true
  }
}

export class CompletedState implements QuizState {
  getName(): string {
    return 'COMPLETED'
  }

  start(): void {
    throw new Error('Cannot restart completed quiz')
  }

  answer(): void {
    throw new Error('Cannot answer completed quiz')
  }

  complete(): void {
    throw new Error('Quiz already completed')
  }

  review(context: QuizContext): void {
    context.setState(new ReviewingState())
    context.setCurrentQuestionIndex(0)
  }

  canAnswer(): boolean {
    return false
  }

  canComplete(): boolean {
    return false
  }
}

export class ReviewingState implements QuizState {
  getName(): string {
    return 'REVIEWING'
  }

  start(): void {
    throw new Error('Cannot start while reviewing')
  }

  answer(): void {
    throw new Error('Cannot change answers while reviewing')
  }

  complete(): void {
    throw new Error('Quiz already completed')
  }

  review(): void {
    // Already reviewing
  }

  canAnswer(): boolean {
    return false
  }

  canComplete(): boolean {
    return false
  }
}
