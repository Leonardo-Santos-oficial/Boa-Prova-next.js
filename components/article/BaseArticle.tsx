import React, { ReactElement } from 'react'
import { ArticleComponent } from './types'
import { ContentNode, Post } from '@/types/wordpress'
import Card from '@/components/core/Card'
import ArticleHeader from './ArticleHeader'
import ArticleContent from './ArticleContent'
import ArticleFooter from './ArticleFooter'

export class BaseArticle implements ArticleComponent {
  constructor(private readonly content: ContentNode) {}

  getContent(): ContentNode {
    return this.content
  }

  render(): ReactElement {
    const isPost = this.content.__typename === 'Post'
    const postNode = isPost ? (this.content as Post) : undefined

    return (
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <Card>
          <ArticleHeader
            title={this.content.title}
            date={this.content.date}
            author={postNode?.author}
            categories={postNode?.categories?.nodes}
          />

          <ArticleContent content={this.content.content} />

          <ArticleFooter tags={postNode?.tags?.nodes} />
        </Card>
      </article>
    )
  }
}
