import { ContentNode, AllUrisResponse } from '@/types/wordpress'
import { IGraphQLClient } from '@/lib/graphql/graphql-client'
import { GET_NODE_BY_URI, GET_ALL_URIS } from '@/lib/graphql/queries'
import { MockContentDataSource } from '@/lib/data-sources/mock-content'

// DIP: Dependemos de abstração (interface), não de implementação concreta
export interface IContentRepository {
  getByUri(uri: string): Promise<ContentNode | null>
  getAllUris(): Promise<string[]>
  getRelatedPosts(postId: string, limit?: number): Promise<ContentNode[]>
}

// SRP: Responsabilidade única - gerenciar acesso a dados de conteúdo
export class ContentRepository implements IContentRepository {
  constructor(
    private readonly graphqlClient: IGraphQLClient,
    private readonly useMockData: boolean = false
  ) {}

  async getByUri(uri: string): Promise<ContentNode | null> {
    if (this.useMockData) {
      return MockContentDataSource.getNodeByUri(uri)
    }

    try {
      const normalizedUri = this.normalizeUri(uri)
      const data = await this.graphqlClient.request<{ nodeByUri: ContentNode | null }>(
        GET_NODE_BY_URI,
        { uri: normalizedUri }
      )
      return data.nodeByUri
    } catch (error) {
      console.error(`ContentRepository: Failed to fetch node for URI: ${uri}`, error)
      return null
    }
  }

  async getAllUris(): Promise<string[]> {
    if (this.useMockData) {
      return MockContentDataSource.getAllUris()
    }

    try {
      const data = await this.graphqlClient.request<AllUrisResponse>(GET_ALL_URIS)
      
      const allUris = [
        ...data.posts.nodes.map((node: { uri: string }) => node.uri),
        ...data.pages.nodes.map((node: { uri: string }) => node.uri),
      ]

      return allUris
    } catch (error) {
      console.error('ContentRepository: Failed to fetch all URIs', error)
      return []
    }
  }

  async getRelatedPosts(postId: string, limit: number = 3): Promise<ContentNode[]> {
    if (this.useMockData) {
      return MockContentDataSource.getRelatedPosts(postId, limit)
    }

    return []
  }

  private normalizeUri(uri: string): string {
    const cleanUri = uri.startsWith('/') ? uri : `/${uri}`
    return cleanUri.endsWith('/') ? cleanUri : `${cleanUri}/`
  }
}
