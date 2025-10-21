import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { wordpressAPI } from '@/lib/api/wordpress-facade'
import { ContentNode } from '@/types/wordpress'
import { BaseArticle } from '@/components/article/BaseArticle'
import { ArticleComponent } from '@/components/article/types'
import { FocusModeDecorator } from '@/components/article/decorators/FocusModeDecorator'
import { TableOfContentsDecorator } from '@/components/article/decorators/TableOfContentsDecorator'
import { StudyToolsDecorator } from '@/components/article/decorators/StudyToolsDecorator'
import { BreadcrumbsDecorator } from '@/components/article/decorators/BreadcrumbsDecorator'
import { RelatedPostsDecorator } from '@/components/article/decorators/RelatedPostsDecorator'
import { ContentPageRenderer } from '@/lib/rendering/ContentPageRenderer'

interface ContentPageProps {
  node: ContentNode
  breadcrumbs: Array<{ label: string; uri: string }>
  relatedPosts: Array<{
    id: string
    title: string
    uri: string
    excerpt?: string
  }>
}

const pageRenderer = new ContentPageRenderer()

export default function ContentPage({ node, breadcrumbs, relatedPosts }: ContentPageProps) {
  const isPost = node.__typename === 'Post'
  
  // Build article with Decorator pattern
  let article: ArticleComponent = new BaseArticle(node)
  article = new BreadcrumbsDecorator(article, breadcrumbs)
  
  // Only apply these decorators to Posts (blog articles), not Pages
  if (isPost) {
    article = new StudyToolsDecorator(article)
    article = new TableOfContentsDecorator(article)
    article = new FocusModeDecorator(article)
    article = new RelatedPostsDecorator(article, relatedPosts)
  }

  return (
    <>
      <Head>
        <title>{node.seo.title}</title>
        <meta name="description" content={node.seo.metaDesc} />
        {node.seo.canonical && <link rel="canonical" href={node.seo.canonical} />}
        
        <meta property="og:title" content={node.seo.opengraphTitle || node.seo.title} />
        <meta property="og:description" content={node.seo.opengraphDescription || node.seo.metaDesc} />
        {node.seo.opengraphImage && (
          <meta property="og:image" content={node.seo.opengraphImage.sourceUrl} />
        )}
        
        {node.seo.schema?.raw && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: node.seo.schema.raw }}
          />
        )}
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {article.render()}
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allUris = await wordpressAPI.getAllContentUris()
  
  const paths = allUris
    .filter((uri: string) => uri && uri !== '/')
    .map((uri: string) => ({
      params: {
        slug: uri.substring(1, uri.length - 1).split('/'),
      },
    }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<ContentPageProps> = async (context) => {
  return pageRenderer.render({
    slug: context.params?.slug as string[]
  })
}
