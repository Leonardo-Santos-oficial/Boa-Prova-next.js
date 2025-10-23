import React, { useState, useEffect, useMemo } from 'react'
import {
  StudyPlan,
  StudyTopic,
  StudyStrategyType
} from '@/lib/study-tools/study-plan/types'
import { DefaultStudyPlanGenerator } from '@/lib/study-tools/study-plan/StudyPlanGenerator'
import { StudyPlanOriginator, StudyPlanCaretaker } from '@/lib/study-tools/study-plan/StudyPlanMemento'
import { StudyPlanRepository } from '@/lib/study-tools/study-plan/StudyPlanRepository'
import { LocalStorageStudyPlanRepository } from '@/lib/study-tools/study-plan/LocalStorageRepository'

const DEFAULT_USER_ID = 'guest-user'

export function StudyPlanComponent() {
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [originator, setOriginator] = useState<StudyPlanOriginator | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Criar repository e caretaker apenas uma vez, no cliente
  const repository = useMemo<StudyPlanRepository>(() => {
    if (typeof window !== 'undefined') {
      return new LocalStorageStudyPlanRepository()
    }
    // Retorna um mock durante SSR
    return {
      save: async () => {},
      load: async () => null,
      delete: async () => {},
      exists: async () => false
    } as StudyPlanRepository
  }, [])

  const caretaker = useMemo(() => new StudyPlanCaretaker(), [])

  const [topics] = useState<StudyTopic[]>([
    {
      id: 'topic-1',
      title: 'Introdução ao Tema',
      estimatedHours: 4,
      priority: 'HIGH',
      completed: false
    },
    {
      id: 'topic-2',
      title: 'Conceitos Intermediários',
      estimatedHours: 6,
      priority: 'MEDIUM',
      completed: false
    },
    {
      id: 'topic-3',
      title: 'Prática e Exercícios',
      estimatedHours: 5,
      priority: 'HIGH',
      completed: false
    }
  ])

  const [strategy, setStrategy] = useState<StudyStrategyType>(StudyStrategyType.Regular)

  // Marcar quando o componente está montado no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Só carregar no cliente
    if (!isMounted) return

    const loadPlan = async () => {
      setIsLoading(true)
      try {
        const savedPlan = await repository.load(DEFAULT_USER_ID)
        if (savedPlan) {
          setPlan(savedPlan)
          const planOriginator = new StudyPlanOriginator(savedPlan)
          setOriginator(planOriginator)
          caretaker.save(savedPlan)
        }
      } catch (error) {
        console.error('Failed to load study plan:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPlan()
  }, [isMounted, repository, caretaker])

  const savePlan = async (planToSave: StudyPlan) => {
    try {
      await repository.save(planToSave)
    } catch (error) {
      console.error('Failed to save study plan:', error)
      throw error
    }
  }

  const handleGeneratePlan = async () => {
    const generator = new DefaultStudyPlanGenerator()
    const newPlan = generator.generatePlan(topics, strategy, DEFAULT_USER_ID)
    
    setPlan(newPlan)
    const planOriginator = new StudyPlanOriginator(newPlan)
    setOriginator(planOriginator)
    caretaker.save(newPlan)
    await savePlan(newPlan)
  }

  const handleCompleteSession = async (sessionId: string) => {
    if (!originator || !plan) return

    originator.completeSession(sessionId)
    const updatedPlan = originator.getPlan()
    caretaker.save(updatedPlan)
    setPlan({ ...updatedPlan })
    await savePlan(updatedPlan)
  }

  const handleRestoreHistory = async (index: number) => {
    if (!originator) return

    const state = caretaker.restore(index)
    if (state) {
      originator.restoreFromMemento(state)
      const restoredPlan = originator.getPlan()
      setPlan({ ...restoredPlan })
      setShowHistory(false)
      await savePlan(restoredPlan)
    }
  }

  const handleDeletePlan = async () => {
    if (!plan || !window.confirm('Tem certeza que deseja excluir este plano?')) return

    try {
      await repository.delete(DEFAULT_USER_ID)
      setPlan(null)
      setOriginator(null)
      caretaker.clear()
    } catch (error) {
      console.error('Failed to delete study plan:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Plano de Estudos Personalizado</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Estratégia de Estudo:
          </label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as StudyStrategyType)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
          >
            <option value={StudyStrategyType.Light}>Leve (2h/dia)</option>
            <option value={StudyStrategyType.Regular}>Regular (4h/dia)</option>
            <option value={StudyStrategyType.Intensive}>Intensivo (8h/dia)</option>
          </select>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Tópicos a Estudar:</h4>
          <ul className="space-y-2">
            {topics.map((topic) => (
              <li
                key={topic.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{topic.title}</span>
                  <span className="text-sm text-gray-500">
                    {topic.estimatedHours}h
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Prioridade: {topic.priority}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleGeneratePlan}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📅 Gerar Plano de Estudos
        </button>
      </div>
    )
  }

  const progress = originator?.getProgress()

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Meu Plano de Estudos</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            📜 Histórico
          </button>
          <button
            onClick={handleDeletePlan}
            className="text-sm px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40"
          >
            🗑️ Excluir
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-2">Histórico de Versões:</h4>
          <ul className="space-y-2">
            {caretaker.getHistory().map((memento, index) => (
              <li key={index}>
                <button
                  onClick={() => handleRestoreHistory(index)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {memento.timestamp.toLocaleString()} - {memento.state.completedSessions} sessões
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {progress && (
        <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso</span>
              <span className="font-bold">{progress.percentageComplete}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress.percentageComplete}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mt-3">
            <div>
              <div className="text-gray-600 dark:text-gray-400">Sessões</div>
              <div className="font-bold">
                {progress.completedSessions}/{progress.totalSessions}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Horas</div>
              <div className="font-bold">
                {progress.hoursStudied.toFixed(1)}/{progress.totalHours.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {plan.sessions.slice(0, 10).map((session) => {
          const topic = plan.topics.find((t) => t.id === session.topicId)
          if (!topic) return null

          return (
            <div
              key={session.id}
              className={`p-3 rounded-lg border-2 ${
                session.completed
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{topic.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {session.scheduledDate.toLocaleDateString()} • {session.duration}h
                  </div>
                </div>
                {!session.completed && (
                  <button
                    onClick={() => handleCompleteSession(session.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    ✓ Concluir
                  </button>
                )}
                {session.completed && (
                  <span className="text-green-600 dark:text-green-400">✅</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {plan.sessions.length > 10 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Mostrando 10 de {plan.sessions.length} sessões
        </div>
      )}

      <button
        onClick={() => {
          setPlan(null)
          setOriginator(null)
          caretaker.clear()
        }}
        className="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        🔄 Novo Plano
      </button>
    </div>
  )
}
