import {
  createRedirectChain,
  OldCategoryRedirectHandler,
  LegacyDateRedirectHandler,
} from '../redirect-chain'

describe('Redirect Chain', () => {
  describe('OldCategoryRedirectHandler', () => {
    it('should redirect old category URLs', async () => {
      const handler = new OldCategoryRedirectHandler()
      const result = await handler.handle({
        path: '/categoria/direito-constitucional',
      })

      expect(result).toEqual({
        destination: '/direito-constitucional/',
        permanent: true,
      })
    })

    it('should return null for non-matching paths', async () => {
      const handler = new OldCategoryRedirectHandler()
      const result = await handler.handle({
        path: '/about',
      })

      expect(result).toBeNull()
    })
  })

  describe('LegacyDateRedirectHandler', () => {
    it('should redirect legacy date-based URLs', async () => {
      const handler = new LegacyDateRedirectHandler()
      const result = await handler.handle({
        path: '/2024/01/15/meu-post',
      })

      expect(result).toEqual({
        destination: '/meu-post/',
        permanent: true,
      })
    })
  })

  describe('Full redirect chain', () => {
    it('should process through multiple handlers', async () => {
      const chain = createRedirectChain()

      const result = await chain.handle({
        path: '/2024/01/01/test-post',
      })

      expect(result).toEqual({
        destination: '/test-post/',
        permanent: true,
      })
    })

    it('should handle query parameter redirects', async () => {
      const chain = createRedirectChain()

      const result = await chain.handle({
        path: '/index.php',
        query: { p: '123' },
      })

      expect(result).toEqual({
        destination: '/post/123/',
        permanent: true,
      })
    })
  })
})
