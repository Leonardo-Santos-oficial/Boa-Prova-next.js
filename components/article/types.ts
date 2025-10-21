import { ReactElement } from 'react'
import { ContentNode } from '@/types/wordpress'

export interface ArticleComponent {
  render(): ReactElement
  getContent(): ContentNode
}

export interface ArticleDecorator extends ArticleComponent {
  readonly wrappedArticle: ArticleComponent
}
