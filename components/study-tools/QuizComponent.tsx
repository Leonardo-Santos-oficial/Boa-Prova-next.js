import React, { useState, useEffect } from 'react'
import { Quiz } from '@/lib/study-tools/quiz/Quiz'
import { QuizData, Question } from '@/lib/study-tools/quiz/types'
import { QuestionGenerator } from '@/lib/study-tools/quiz/QuestionGenerator'

interface QuizComponentProps {
  content: string
  onClose: () => void
}

export function QuizComponent({ content, onClose }: QuizComponentProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const generateQuiz = async () => {
    setIsGenerating(true)
    setErrorMessage(null)
    try {
      const generator = new QuestionGenerator()
      const questions = await generator.generateMixedQuiz(content, 5)

      const quizData: QuizData = {
        id: `quiz-${Date.now()}`,
        title: 'Quiz do Artigo',
        questions,
        createdAt: new Date()
      }

      const newQuiz = new Quiz(quizData)
      setQuiz(newQuiz)
    } catch (error) {
      console.error('Failed to generate quiz:', error)
      setErrorMessage('Não foi possível gerar o quiz automaticamente. Tente novamente mais tarde.')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (!quiz) {
      setCurrentQuestion(null)
    }
  }, [quiz])

  const handleStart = () => {
    if (!quiz) return
    if (quiz.getState().getName() !== 'NOT_STARTED') {
      return
    }
    quiz.start()
    setCurrentQuestion(quiz.getCurrentQuestion() ?? null)
  }

  const handleAnswer = (answerIndex: number) => {
    if (!quiz || !currentQuestion) return

    setSelectedAnswer(answerIndex)
    quiz.answerQuestion(currentQuestion.id, answerIndex)

    setTimeout(() => {
      const nextQuestion = quiz.getCurrentQuestion()
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion)
        setSelectedAnswer(null)
      } else {
        setCurrentQuestion(null)
        handleComplete()
      }
    }, 800)
  }

  const handleComplete = () => {
    if (!quiz) return
    
    try {
      if (quiz.getState().canComplete()) {
        quiz.complete()
      }
      setScore(quiz.calculateScore())
    } catch (error) {
      console.error('Cannot complete quiz:', error)
    }
  }

  const handleReview = () => {
    if (!quiz) return
    quiz.review()
  setCurrentQuestion(quiz.getCurrentQuestion() ?? null)
    setScore(null)
  }

  const handleReset = () => {
    if (!quiz) return
    quiz.reset()
    setCurrentQuestion(null)
    setSelectedAnswer(null)
    setScore(null)
  }

  if (!quiz) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Gerar Mini-Quiz</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Teste seus conhecimentos sobre este conteúdo com um quiz gerado automaticamente.
        </p>
        {errorMessage && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="flex space-x-3">
          <button
            onClick={generateQuiz}
            disabled={isGenerating}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? 'Gerando...' : '🎯 Gerar Quiz'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  const stateName = quiz.getState().getName()

  if (stateName === 'NOT_STARTED') {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Quiz Pronto!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {quiz.getQuiz().questions.length} questões geradas. Boa sorte!
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            🚀 Começar Quiz
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  if (score !== null) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Quiz Concluído!</h3>
        <div className="mb-6 text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">{score}%</div>
          <p className="text-gray-600 dark:text-gray-400">
            {quiz.getAnswers().size} de {quiz.getQuiz().questions.length} questões
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReview}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📝 Ver Respostas
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            🔄 Novo Quiz
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  const userAnswer = quiz.getUserAnswer(currentQuestion.id)
  const isReviewing = stateName === 'REVIEWING'
  const questionIndex = quiz.getCurrentQuestionIndex()
  const totalQuestions = quiz.getQuiz().questions.length

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Questão {questionIndex + 1} de {totalQuestions}
        </h3>
        {isReviewing && (
          <span className="text-sm text-gray-500">Modo Revisão</span>
        )}
      </div>

      <p className="text-lg mb-6">{currentQuestion.text}</p>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = isReviewing ? userAnswer === index : selectedAnswer === index
          const isCorrect = index === currentQuestion.correctAnswer
          const showCorrect = isReviewing && isCorrect
          const showWrong = isReviewing && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => !isReviewing && handleAnswer(index)}
              disabled={isReviewing}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                showCorrect
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : showWrong
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              {option}
              {showCorrect && <span className="ml-2">✅</span>}
              {showWrong && <span className="ml-2">❌</span>}
            </button>
          )
        })}
      </div>

      {isReviewing && currentQuestion.explanation && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-semibold mb-1">Explicação:</p>
          <p className="text-sm">{currentQuestion.explanation}</p>
        </div>
      )}

      {isReviewing && (
        <div className="flex space-x-3">
          {questionIndex > 0 && (
            <button
              onClick={() => {
                quiz.setCurrentQuestionIndex(questionIndex - 1)
                setCurrentQuestion(quiz.getCurrentQuestion() ?? null)
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              ← Anterior
            </button>
          )}
          {questionIndex < totalQuestions - 1 && (
            <button
              onClick={() => {
                quiz.setCurrentQuestionIndex(questionIndex + 1)
                setCurrentQuestion(quiz.getCurrentQuestion() ?? null)
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              Próxima →
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Fechar Revisão
          </button>
        </div>
      )}
    </div>
  )
}
