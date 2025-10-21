// Facade Pattern: Interface simplificada para todo o sistema de conteúdo
import { ContentNode } from '@/types/wordpress'
import { ContentRepository } from '@/lib/repositories/content-repository'
import { GraphQLClientAdapter } from '@/lib/graphql/graphql-client'

class WordPressAPIFacade {
  private repository: ContentRepository

  constructor() {
    const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || ''
    const useMockData = !endpoint || endpoint.includes('example.com')

    if (useMockData) {
      this.repository = new ContentRepository({} as GraphQLClientAdapter, true)
    } else {
      const client = new GraphQLClientAdapter(endpoint)
      this.repository = new ContentRepository(client, false)
    }
  }

  async getContentByUri(uri: string): Promise<ContentNode | null> {
    return this.repository.getByUri(uri)
  }

  async getAllContentUris(): Promise<string[]> {
    return this.repository.getAllUris()
  }

  async getRelatedContent(postId: string, limit?: number): Promise<ContentNode[]> {
    return this.repository.getRelatedPosts(postId, limit)
  }
}

export const wordpressAPI = new WordPressAPIFacade()
