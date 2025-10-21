import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { wordpressAPI } from '@/lib/api/wordpress-facade'
import { ContentNode } from '@/types/wordpress'
import { BaseArticleLayout } from '@/components/article/ArticleLayout'
import FocusModeToggle from '@/components/study-tools/FocusModeToggle'
import { ContentPageRenderer } from '@/lib/rendering/ContentPageRenderer'

interface ContentPageProps {
  node: ContentNode
}

const pageRenderer = new ContentPageRenderer()

export default function ContentPage({ node }: ContentPageProps) {
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

      <div className="mb-6 flex justify-end max-w-4xl mx-auto">
        <FocusModeToggle />
      </div>

      <BaseArticleLayout node={node} />
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
