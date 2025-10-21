import { Post } from '@/types/wordpress'

export class MockContentDataSource {
  static getNodeByUri(uri: string): Post {
    return {
      __typename: 'Post',
      id: '1',
      title: `Exemplo: ${uri}`,
      content: `
        <h2>Este é um conteúdo de exemplo</h2>
        <p>Você está visualizando um conteúdo mockado porque o WordPress não está configurado.</p>
        <p>Para conectar ao WordPress real:</p>
        <ol>
          <li>Configure a URL do GraphQL no arquivo .env.local</li>
          <li>Certifique-se de que o plugin WPGraphQL está instalado</li>
          <li>Reinicie o servidor de desenvolvimento</li>
        </ol>
        <h3>Conteúdo de Exemplo</h3>
        <p>Este é um parágrafo com <strong>texto em negrito</strong> e <em>texto em itálico</em>.</p>
        <blockquote>Esta é uma citação de exemplo para demonstrar a tipografia do artigo.</blockquote>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      `,
      excerpt: 'Este é um conteúdo de exemplo para desenvolvimento',
      uri: `/${uri}/`,
      date: new Date().toISOString(),
      modified: new Date().toISOString(),
      author: {
        node: {
          name: 'Leonardo Santos',
          avatar: {
            url: 'https://via.placeholder.com/40'
          }
        }
      },
      categories: {
        nodes: [
          { name: 'Direito Constitucional', uri: '/direito-constitucional/', slug: 'direito-constitucional' },
          { name: 'Concursos', uri: '/concursos/', slug: 'concursos' }
        ]
      },
      tags: {
        nodes: [
          { name: 'Estudo', uri: '/tag/estudo/', slug: 'estudo' },
          { name: 'Aprovação', uri: '/tag/aprovacao/', slug: 'aprovacao' }
        ]
      },
      seo: {
        title: `${uri} - Boa Prova`,
        metaDesc: 'Conteúdo de exemplo para desenvolvimento',
        canonical: `https://boa-prova.com/${uri}/`
      }
    }
  }

  static getAllUris(): string[] {
    return [
      '/exemplo-post/',
      '/sobre/',
      '/direito-constitucional/principios-fundamentais/',
      '/concursos/como-estudar/'
    ]
  }

  static getRelatedPosts(_postId: string, limit: number = 3): Post[] {
    return Array.from({ length: limit }, (_, i) => ({
      __typename: 'Post' as const,
      id: `related-${i + 1}`,
      title: `Post Relacionado ${i + 1}`,
      content: '<p>Conteúdo do post relacionado</p>',
      excerpt: `Resumo do post relacionado ${i + 1}`,
      uri: `/post-relacionado-${i + 1}/`,
      date: new Date().toISOString(),
      modified: new Date().toISOString(),
      seo: {
        title: `Post Relacionado ${i + 1}`,
        metaDesc: `Descrição do post relacionado ${i + 1}`
      }
    }))
  }
}
