import { ContentRepository } from '../content-repository'
import { IGraphQLClient } from '../../graphql/graphql-client'
import { ContentNode } from '@/types/wordpress'
import { contentCache, urisCache } from '@/lib/cache/cache-manager'

describe('ContentRepository', () => {
  beforeEach(() => {
    contentCache.clear()
    urisCache.clear()
  })

  describe('with mock data', () => {
    let repository: ContentRepository

    beforeEach(() => {
      const mockClient = {} as IGraphQLClient
      repository = new ContentRepository(mockClient, true)
    })

    it('should return mock content for any URI', async () => {
      const uri = 'test-post'
      const result = await repository.getByUri(uri)

      expect(result).not.toBeNull()
      expect(result?.title).toContain('test-post')
      expect(result?.__typename).toBe('Post')
    })

    it('should return list of mock URIs', async () => {
      const uris = await repository.getAllUris()

      expect(Array.isArray(uris)).toBe(true)
      expect(uris.length).toBeGreaterThan(0)
      expect(uris[0]).toMatch(/^\/.*\/$/)
    })

    it('should normalize URIs correctly', async () => {
      const testCases = [
        'test-post',
        '/test-post',
        'test-post/',
        '/test-post/',
      ]

      for (const uri of testCases) {
        const result = await repository.getByUri(uri)
        expect(result).not.toBeNull()
      }
    })
  })

  describe('with real GraphQL client', () => {
    let repository: ContentRepository
    let mockClient: jest.Mocked<IGraphQLClient>

    beforeEach(() => {
      mockClient = {
        request: jest.fn(),
      } as jest.Mocked<IGraphQLClient>

      repository = new ContentRepository(mockClient, false)
    })

    it('should call GraphQL client with normalized URI', async () => {
      const mockNode: ContentNode = {
        __typename: 'Post',
        id: '1',
        title: 'Test Post',
        content: '<p>Content</p>',
        uri: '/test-post/',
        date: new Date().toISOString(),
        modified: new Date().toISOString(),
        seo: {
          title: 'Test',
          metaDesc: 'Description',
        },
      }

      mockClient.request.mockResolvedValueOnce({ nodeByUri: mockNode })

      const result = await repository.getByUri('test-post')

      expect(mockClient.request).toHaveBeenCalledWith(
        expect.any(String),
        { uri: '/test-post/' }
      )
      expect(result).toEqual(mockNode)
    })

    it('should handle GraphQL errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockClient.request.mockRejectedValueOnce(new Error('GraphQL Error'))

      const result = await repository.getByUri('test-post')

      expect(result).toBeNull()
      consoleSpy.mockRestore()
    })
  })
})
