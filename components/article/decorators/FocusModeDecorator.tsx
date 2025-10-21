import React, { ReactElement } from 'react'
import { ArticleComponent, ArticleDecorator } from '../types'
import { ContentNode } from '@/types/wordpress'
import { useFocusMode } from '@/contexts/FocusModeContext'

export class FocusModeDecorator implements ArticleDecorator {
  constructor(public readonly wrappedArticle: ArticleComponent) {}

  getContent(): ContentNode {
    return this.wrappedArticle.getContent()
  }

  render(): ReactElement {
    return <FocusModeWrapper article={this.wrappedArticle} />
  }
}

function FocusModeWrapper({ article }: { article: ArticleComponent }) {
  const { isActive, toggle } = useFocusMode()

  return (
    <div className={isActive ? 'focus-mode-active' : ''}>
      <div className="mb-4 flex justify-end">
        <button
          onClick={toggle}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isActive ? 'Desativar modo foco' : 'Ativar modo foco'}
        >
          {isActive ? '👁️ Sair do Modo Foco' : '🎯 Modo Foco'}
        </button>
      </div>
      {article.render()}
    </div>
  )
}
