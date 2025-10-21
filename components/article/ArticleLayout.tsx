import { ReactNode } from 'react'
import Card from '@/components/core/Card'
import ArticleHeader from './ArticleHeader'
import ArticleContent from './ArticleContent'
import ArticleFooter from './ArticleFooter'
import { ContentNode, Post } from '@/types/wordpress'

interface BaseArticleLayoutProps {
  node: ContentNode
  children?: ReactNode
}

export function BaseArticleLayout({ node, children }: BaseArticleLayoutProps) {
  const isPost = node.__typename === 'Post'
  const postNode = isPost ? (node as Post) : undefined

  return (
    <article className="max-w-4xl mx-auto">
      <Card>
        <ArticleHeader
          title={node.title}
          date={node.date}
          author={postNode?.author}
          categories={postNode?.categories?.nodes}
        />

        <ArticleContent content={node.content} />

        {children}

        <ArticleFooter tags={postNode?.tags?.nodes} />
      </Card>
    </article>
  )
}

interface ArticleDecoratorProps {
  node: ContentNode
  children: ReactNode
}

export function WithTableOfContents({ node, children }: ArticleDecoratorProps) {
  const headings = extractHeadings(node.content)

  return (
    <BaseArticleLayout node={node}>
      {headings.length > 0 && (
        <aside className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Índice
          </h3>
          <nav>
            <ul className="space-y-2">
              {headings.map((heading, index) => (
                <li 
                  key={index}
                  className={`${heading.level === 'h2' ? 'ml-0' : 'ml-4'}`}
                >
                  <a 
                    href={`#${heading.id}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
      {children}
    </BaseArticleLayout>
  )
}

interface WithRelatedPostsProps extends ArticleDecoratorProps {
  relatedPosts: ContentNode[]
}

export function WithRelatedPosts({ node, relatedPosts, children }: WithRelatedPostsProps) {
  return (
    <BaseArticleLayout node={node}>
      {children}
      
      {relatedPosts.length > 0 && (
        <aside className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Posts Relacionados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((post) => (
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
    </BaseArticleLayout>
  )
}

function extractHeadings(content: string): Array<{ id: string; text: string; level: string }> {
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
