import { Quiz } from '@/lib/study-tools/quiz/Quiz'
import { QuizData, QuestionType } from '@/lib/study-tools/quiz/types'

describe('Quiz State Pattern', () => {
  const mockQuizData: QuizData = {
    id: 'test-quiz',
    title: 'Test Quiz',
    questions: [
      {
        id: 'q1',
        text: 'Question 1',
        type: QuestionType.MultipleChoice,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        text: 'Question 2',
        type: QuestionType.TrueFalse,
        options: ['True', 'False'],
        correctAnswer: 1
      }
    ],
    createdAt: new Date()
  }

  it('should start in NOT_STARTED state', () => {
    const quiz = new Quiz(mockQuizData)
    expect(quiz.getState().getName()).toBe('NOT_STARTED')
  })

  it('should transition to IN_PROGRESS when started', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    expect(quiz.getState().getName()).toBe('IN_PROGRESS')
  })

  it('should not allow answering before starting', () => {
    const quiz = new Quiz(mockQuizData)
    expect(() => quiz.answerQuestion('q1', 0)).toThrow()
  })

  it('should record answers in IN_PROGRESS state', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    
    quiz.answerQuestion('q1', 0)
    expect(quiz.isAnswered('q1')).toBe(true)
    expect(quiz.getUserAnswer('q1')).toBe(0)
  })

  it('should move to next question after answering', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    
    expect(quiz.getCurrentQuestionIndex()).toBe(0)
    quiz.answerQuestion('q1', 0)
    expect(quiz.getCurrentQuestionIndex()).toBe(1)
  })

  it('should transition to COMPLETED when all questions answered', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    
    quiz.answerQuestion('q1', 0)
    quiz.answerQuestion('q2', 1)
    quiz.complete()
    
    expect(quiz.getState().getName()).toBe('COMPLETED')
  })

  it('should not allow completing with unanswered questions', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    
    quiz.answerQuestion('q1', 0)
    expect(() => quiz.complete()).toThrow()
  })

  it('should calculate score correctly', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    
    quiz.answerQuestion('q1', 0)
    quiz.answerQuestion('q2', 1)
    quiz.complete()
    
    expect(quiz.calculateScore()).toBe(100)
  })

  it('should calculate partial score correctly', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    
    quiz.answerQuestion('q1', 0)
    quiz.answerQuestion('q2', 0)
    quiz.complete()
    
    expect(quiz.calculateScore()).toBe(50)
  })

  it('should allow reviewing after completion', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    
    quiz.answerQuestion('q1', 0)
    quiz.answerQuestion('q2', 1)
    quiz.complete()
    quiz.review()
    
    expect(quiz.getState().getName()).toBe('REVIEWING')
  })

  it('should not allow answering in REVIEWING state', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    
    quiz.answerQuestion('q1', 0)
    quiz.answerQuestion('q2', 1)
    quiz.complete()
    quiz.review()
    
    expect(() => quiz.answerQuestion('q1', 1)).toThrow()
  })

  it('should reset quiz to initial state', () => {
    const quiz = new Quiz(mockQuizData)
    quiz.start()
    quiz.answerQuestion('q1', 0)
    
    quiz.reset()
    
    expect(quiz.getState().getName()).toBe('NOT_STARTED')
    expect(quiz.getCurrentQuestionIndex()).toBe(0)
    expect(quiz.getAnswers().size).toBe(0)
  })
})
