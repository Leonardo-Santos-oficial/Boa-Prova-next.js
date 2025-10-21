import React, { ReactElement } from 'react'
import { ArticleComponent, ArticleDecorator } from '../types'
import { ContentNode } from '@/types/wordpress'

export class TableOfContentsDecorator implements ArticleDecorator {
  constructor(public readonly wrappedArticle: ArticleComponent) {}

  getContent(): ContentNode {
    return this.wrappedArticle.getContent()
  }

  render(): ReactElement {
    const content = this.getContent()
    const headings = this.extractHeadings(content.content)

    return (
      <div>
        {headings.length > 0 && (
          <aside className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Índice
            </h3>
            <nav aria-label="Table of Contents">
              <ul className="space-y-2">
                {headings.map((heading, index) => (
                  <li 
                    key={index}
                    className={`${heading.level === 'h2' ? 'ml-0' : 'ml-4'}`}
                  >
                    <a 
                      href={`#${heading.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors text-sm"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
        
        {this.wrappedArticle.render()}
      </div>
    )
  }

  private extractHeadings(content: string): Array<{ id: string; text: string; level: string }> {
    const headingRegex = /<(h[2-3])[^>]*>(.*?)<\/\1>/gi
    const headings: Array<{ id: string; text: string; level: string }> = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1]
      const text = match[2].replace(/<[^>]*>/g, '')
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      
      headings.push({ id, text, level })
    }

    return headings
  }
}
