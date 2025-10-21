import { ContentPageRenderer } from '../ContentPageRenderer'
import { ContentNode } from '@/types/wordpress'
import { wordpressAPI } from '@/lib/api/wordpress-facade'

jest.mock('@/lib/api/wordpress-facade', () => ({
  wordpressAPI: {
    getContentByUri: jest.fn(),
  },
}))

describe('ContentPageRenderer', () => {
  let renderer: ContentPageRenderer
  const mockGetContentByUri = wordpressAPI.getContentByUri as jest.MockedFunction<
    typeof wordpressAPI.getContentByUri
  >

  beforeEach(() => {
    renderer = new ContentPageRenderer()
    jest.clearAllMocks()
  })

  describe('fetchData', () => {
    it('should fetch content by URI', async () => {
      const mockNode: ContentNode = {
        __typename: 'Post',
        id: '1',
        title: 'Test Post',
        content: '<p>Content</p>',
        uri: '/test-post/',
        date: '2024-01-01T00:00:00Z',
        modified: '2024-01-01T00:00:00Z',
        seo: {
          title: 'Test',
          metaDesc: 'Description',
        },
      }

      mockGetContentByUri.mockResolvedValueOnce(mockNode)

      const result = await renderer.render({ slug: ['test-post'] })

      expect(mockGetContentByUri).toHaveBeenCalledWith('test-post')
      expect(result).toEqual({
        props: { node: mockNode },
        revalidate: 3600,
      })
    })

    it('should ignore system URIs', async () => {
      const result = await renderer.render({ slug: ['_next', 'static'] })

      expect(mockGetContentByUri).not.toHaveBeenCalled()
      expect(result).toEqual({ notFound: true })
    })

    it('should ignore favicon.ico', async () => {
      const result = await renderer.render({ slug: ['favicon.ico'] })

      expect(mockGetContentByUri).not.toHaveBeenCalled()
      expect(result).toEqual({ notFound: true })
    })
  })

  describe('validateData', () => {
    it('should return notFound when data is null', async () => {
      mockGetContentByUri.mockResolvedValueOnce(null)

      const result = await renderer.render({ slug: ['nonexistent'] })

      expect(result).toEqual({ notFound: true })
    })

    it('should validate required fields', async () => {
      const invalidNode = {
        __typename: 'Post',
        id: '1',
      } as unknown as ContentNode

      mockGetContentByUri.mockResolvedValueOnce(invalidNode)

      const result = await renderer.render({ slug: ['invalid'] })

      expect(result).toEqual({ notFound: true })
    })
  })

  describe('render (Template Method)', () => {
    it('should execute full rendering pipeline', async () => {
      const mockNode: ContentNode = {
        __typename: 'Post',
        id: '1',
        title: 'Complete Post',
        content: '<p>Full content</p>',
        uri: '/complete-post/',
        date: '2024-01-01T00:00:00Z',
        modified: '2024-01-01T00:00:00Z',
        seo: {
          title: 'Complete',
          metaDesc: 'Description',
        },
      }

      mockGetContentByUri.mockResolvedValueOnce(mockNode)

      const result = await renderer.render({ slug: ['complete-post'] })

      expect(result).toEqual({
        props: { node: mockNode },
        revalidate: 3600,
      })
    })

    it('should handle errors gracefully', async () => {
      mockGetContentByUri.mockRejectedValueOnce(new Error('Network error'))

      const result = await renderer.render({ slug: ['error-post'] })

      expect(result).toEqual({ notFound: true })
    })
  })

  describe('ISR configuration', () => {
    it('should use default revalidate time of 3600s', async () => {
      const mockNode: ContentNode = {
        __typename: 'Post',
        id: '1',
        title: 'Test',
        content: '<p>Content</p>',
        uri: '/test/',
        date: '2024-01-01T00:00:00Z',
        modified: '2024-01-01T00:00:00Z',
        seo: { title: 'Test', metaDesc: 'Desc' },
      }

      mockGetContentByUri.mockResolvedValueOnce(mockNode)

      const result = await renderer.render({ slug: ['test'] })

      expect(result).toHaveProperty('revalidate', 3600)
    })

    it('should allow custom revalidate time', async () => {
      const customRenderer = new ContentPageRenderer({ revalidate: 1800 })
      
      const mockNode: ContentNode = {
        __typename: 'Post',
        id: '1',
        title: 'Test',
        content: '<p>Content</p>',
        uri: '/test/',
        date: '2024-01-01T00:00:00Z',
        modified: '2024-01-01T00:00:00Z',
        seo: { title: 'Test', metaDesc: 'Desc' },
      }

      mockGetContentByUri.mockResolvedValueOnce(mockNode)

      const result = await customRenderer.render({ slug: ['test'] })

      expect(result).toHaveProperty('revalidate', 1800)
    })
  })
})
