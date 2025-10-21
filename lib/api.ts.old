import { GraphQLClient, gql } from 'graphql-request'
import { ContentNode } from '@/types/wordpress'

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

const USE_MOCK_DATA = !WORDPRESS_API_URL || WORDPRESS_API_URL.includes('example.com')

const client = WORDPRESS_API_URL && !USE_MOCK_DATA 
  ? new GraphQLClient(WORDPRESS_API_URL)
  : null

const GET_NODE_BY_URI = gql`
  query GetNodeByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Post {
        id
        title
        content
        excerpt
        uri
        date
        modified
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            uri
          }
        }
        tags {
          nodes {
            name
            uri
          }
        }
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          schema {
            raw
          }
        }
      }
      ... on Page {
        id
        title
        content
        uri
        date
        modified
        seo {
          title
          metaDesc
          canonical
        }
      }
    }
  }
`

const GET_ALL_URIS = gql`
  query GetAllUris {
    posts(first: 10000) {
      nodes {
        uri
      }
    }
    pages(first: 1000) {
      nodes {
        uri
      }
    }
  }
`

export const api = {
  async getNodeByUri(uri: string): Promise<ContentNode | null> {
    if (USE_MOCK_DATA || !client) {
      console.log('Using mock data for:', uri)
      return this.getMockNode(uri)
    }

    try {
      const data = await client.request<{ nodeByUri: ContentNode | null }>(
        GET_NODE_BY_URI,
        { uri: `/${uri}/` }
      )
      return data.nodeByUri
    } catch (error) {
      console.error(`Failed to fetch node for URI: ${uri}`, error)
      return null
    }
  },

  async getAllUris(): Promise<{ uri: string }[]> {
    if (USE_MOCK_DATA || !client) {
      console.log('Using mock URIs')
      return [
        { uri: '/exemplo-post/' },
        { uri: '/sobre/' }
      ]
    }

    try {
      const data = await client.request<{
        posts: { nodes: { uri: string }[] }
        pages: { nodes: { uri: string }[] }
      }>(GET_ALL_URIS)
      
      return [
        ...data.posts.nodes,
        ...data.pages.nodes,
      ]
    } catch (error) {
      console.error('Failed to fetch all URIs', error)
      return []
    }
  },

  getMockNode(uri: string): ContentNode {
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
          { name: 'Direito Constitucional', uri: '/direito-constitucional/' },
          { name: 'Concursos', uri: '/concursos/' }
        ]
      },
      tags: {
        nodes: [
          { name: 'Estudo', uri: '/tag/estudo/' },
          { name: 'Aprovação', uri: '/tag/aprovacao/' }
        ]
      },
      seo: {
        title: `${uri} - Boa Prova`,
        metaDesc: 'Conteúdo de exemplo para desenvolvimento',
        canonical: `https://boa-prova.com/${uri}/`
      }
    }
  },

  async getMediaKitStats(): Promise<{
    monthlyPageviews: number
    monthlyUsers: number
    avgSessionDuration: string
    topCategories: Array<{ name: string; percentage: number }>
  }> {
    return {
      monthlyPageviews: 150000,
      monthlyUsers: 45000,
      avgSessionDuration: '4:32',
      topCategories: [
        { name: 'Direito Constitucional', percentage: 35 },
        { name: 'Língua Portuguesa', percentage: 28 },
        { name: 'Raciocínio Lógico', percentage: 22 },
      ]
    }
  }
}
