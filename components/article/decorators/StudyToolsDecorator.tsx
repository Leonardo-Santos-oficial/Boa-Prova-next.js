import React, { ReactElement, useState, useEffect } from 'react'
import { ArticleComponent, ArticleDecorator } from '../types'
import { ContentNode } from '@/types/wordpress'

export class StudyToolsDecorator implements ArticleDecorator {
  constructor(public readonly wrappedArticle: ArticleComponent) {}

  getContent(): ContentNode {
    return this.wrappedArticle.getContent()
  }

  render(): ReactElement {
    return <StudyToolsWrapper wrappedArticle={this.wrappedArticle} />
  }
}

function StudyToolsWrapper({ wrappedArticle }: { wrappedArticle: ArticleComponent }) {
  const [readingTime, setReadingTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [highlights, setHighlights] = useState<Set<string>>(new Set())

  // Calculate reading time (200 words per minute)
  useEffect(() => {
    const content = wrappedArticle.getContent()
    const text = content.content || ''
    const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length
    setReadingTime(Math.ceil(words / 200))
  }, [wrappedArticle])

  // Reading timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isReading) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isReading])

  // Auto-start reading timer when article is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsReading(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const article = document.querySelector('article')
    if (article) {
      observer.observe(article)
    }

    return () => observer.disconnect()
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    if (text && text.length > 0) {
      setHighlights((prev) => new Set([...prev, text]))
    }
  }

  return (
    <div onMouseUp={handleTextSelection}>
      {/* Study Tools Panel */}
      <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-lg border border-blue-200 dark:border-gray-600">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tempo de leitura: ~{readingTime} min
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tempo lendo: {formatTime(elapsedTime)}
              </span>
            </div>

            {highlights.size > 0 && (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {highlights.size} {highlights.size === 1 ? 'destaque' : 'destaques'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setHighlights(new Set())}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            disabled={highlights.size === 0}
          >
            Limpar destaques
          </button>
        </div>
      </div>

      {/* Wrapped Article */}
      {wrappedArticle.render()}

      {/* Highlights Panel */}
      {highlights.size > 0 && (
        <aside className="mt-8 p-6 bg-yellow-50 dark:bg-gray-800 rounded-lg border-l-4 border-yellow-400">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Seus Destaques
          </h3>
          <ul className="space-y-2">
            {Array.from(highlights).map((text, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-yellow-400"
              >
                &ldquo;{text}&rdquo;
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  )
}
