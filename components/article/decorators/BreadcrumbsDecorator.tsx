import React, { ReactElement } from 'react'
import { ArticleComponent, ArticleDecorator } from '../types'
import { ContentNode } from '@/types/wordpress'

interface BreadcrumbItem {
  label: string
  uri: string
}

export class BreadcrumbsDecorator implements ArticleDecorator {
  constructor(
    public readonly wrappedArticle: ArticleComponent,
    private readonly breadcrumbs: BreadcrumbItem[]
  ) {}

  getContent(): ContentNode {
    return this.wrappedArticle.getContent()
  }

  render(): ReactElement {
    return (
      <div>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            {this.breadcrumbs.map((item, index) => {
              const isLast = index === this.breadcrumbs.length - 1
              
              return (
                <li key={item.uri} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2" aria-hidden="true">
                      /
                    </span>
                  )}
                  {isLast ? (
                    <span 
                      className="font-medium text-gray-900 dark:text-gray-100"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <a
                      href={item.uri}
                      className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
        
        {this.wrappedArticle.render()}
      </div>
    )
  }
}
