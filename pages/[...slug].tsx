import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { api } from '@/lib/api'
import { ContentNode } from '@/types/wordpress'
import Card from '@/components/core/Card'
import FocusModeToggle from '@/components/study-tools/FocusModeToggle'

interface ContentPageProps {
  node: ContentNode
}

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

      <article className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(node.date).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          <FocusModeToggle />
        </div>

        <Card>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {node.title}
            </h1>
            
            {node.author && (
              <div className="flex items-center space-x-3">
                {node.author.node.avatar && (
                  <Image 
                    src={node.author.node.avatar.url} 
                    alt={node.author.node.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span className="text-gray-600 dark:text-gray-400">
                  Por {node.author.node.name}
                </span>
              </div>
            )}

            {node.categories && node.categories.nodes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {node.categories.nodes.map((category) => (
                  <span 
                    key={category.uri}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div 
            className="prose dark:prose-dark max-w-none"
            dangerouslySetInnerHTML={{ __html: node.content }} 
          />

          {node.tags && node.tags.nodes.length > 0 && (
            <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {node.tags.nodes.map((tag) => (
                  <span 
                    key={tag.uri}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </Card>
      </article>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allUris = await api.getAllUris()
  
  const paths = allUris
    .filter(({ uri }) => uri && uri !== '/')
    .map(({ uri }) => ({
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
  const slug = (context.params?.slug as string[]) || []
  const uri = slug.join('/')
  
  // Ignorar rotas internas do Next.js
  if (uri.startsWith('_next') || uri.includes('.') || uri === 'favicon.ico') {
    return {
      notFound: true,
    }
  }
  
  const node = await api.getNodeByUri(uri)

  if (!node) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      node,
    },
    revalidate: 3600,
  }
}
