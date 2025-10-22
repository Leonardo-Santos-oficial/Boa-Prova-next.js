import React, { useState } from 'react'
import { QuizComponent } from './QuizComponent'
import { PomodoroComponent } from './PomodoroComponent'
import { StudyPlanComponent } from './StudyPlanComponent'

interface StudyToolsPanelProps {
  articleContent: string
}

type ActiveTool = 'none' | 'quiz' | 'pomodoro' | 'studyPlan'

export function StudyToolsPanel({ articleContent }: StudyToolsPanelProps) {
  const [activeTool, setActiveTool] = useState<ActiveTool>('none')
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const handleToolSelect = (tool: ActiveTool) => {
    setActiveTool(tool)
    setIsPanelOpen(true)
  }

  const handleClose = () => {
    setActiveTool('none')
    setIsPanelOpen(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {!isPanelOpen && (
          <>
            <button
              onClick={() => handleToolSelect('quiz')}
              className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
              aria-label="Abrir Quiz"
              title="Gerar Mini-Quiz"
            >
              🎯
            </button>
            <button
              onClick={() => handleToolSelect('pomodoro')}
              className="w-14 h-14 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110"
              aria-label="Abrir Pomodoro"
              title="Cronômetro Pomodoro"
            >
              ⏰
            </button>
            <button
              onClick={() => handleToolSelect('studyPlan')}
              className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110"
              aria-label="Abrir Plano de Estudos"
              title="Plano de Estudos"
            >
              📅
            </button>
          </>
        )}
      </div>

      {/* Side Panel */}
      {isPanelOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Ferramentas de Estudo</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                aria-label="Fechar painel"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              {activeTool === 'quiz' && (
                <QuizComponent content={articleContent} onClose={handleClose} />
              )}
              {activeTool === 'pomodoro' && <PomodoroComponent />}
              {activeTool === 'studyPlan' && <StudyPlanComponent />}
            </div>
          </div>
        </>
      )}
    </>
  )
}
