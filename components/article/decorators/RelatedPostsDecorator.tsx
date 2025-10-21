import React, { ReactElement } from 'react'
import { ArticleComponent, ArticleDecorator } from '../types'
import { ContentNode } from '@/types/wordpress'

interface RelatedPost {
  id: string
  title: string
  uri: string
  excerpt?: string
}

export class RelatedPostsDecorator implements ArticleDecorator {
  constructor(
    public readonly wrappedArticle: ArticleComponent,
    private readonly relatedPosts: RelatedPost[]
  ) {}

  getContent(): ContentNode {
    return this.wrappedArticle.getContent()
  }

  render(): ReactElement {
    return (
      <div>
        {this.wrappedArticle.render()}
        
        {this.relatedPosts.length > 0 && (
          <aside className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Posts Relacionados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {this.relatedPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.uri}
                  className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {post.excerpt.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </aside>
        )}
      </div>
    )
  }
}
