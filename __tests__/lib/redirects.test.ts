import { CategoryRedirectHandler } from '@/lib/redirects/handlers/CategoryRedirectHandler'
import { DateArchiveRedirectHandler } from '@/lib/redirects/handlers/DateArchiveRedirectHandler'
import { TrailingSlashHandler } from '@/lib/redirects/handlers/TrailingSlashHandler'
import { RedirectChain } from '@/lib/redirects/RedirectChain'

describe('Redirect Handlers - Chain of Responsibility', () => {
  describe('CategoryRedirectHandler', () => {
    it('should redirect /category/slug to /slug', () => {
      const handler = new CategoryRedirectHandler()
      const result = handler.handle('/category/concursos')

      expect(result).toEqual({
        destination: '/concursos',
        permanent: true
      })
    })

    it('should redirect nested category paths', () => {
      const handler = new CategoryRedirectHandler()
      const result = handler.handle('/category/direito-constitucional')

      expect(result).toEqual({
        destination: '/direito-constitucional',
        permanent: true
      })
    })

    it('should return null for non-category URLs', () => {
      const handler = new CategoryRedirectHandler()
      const result = handler.handle('/concursos')

      expect(result).toBeNull()
    })

    it('should return null for root URL', () => {
      const handler = new CategoryRedirectHandler()
      const result = handler.handle('/')

      expect(result).toBeNull()
    })
  })

  describe('DateArchiveRedirectHandler', () => {
    it('should redirect /YYYY/MM/slug to /slug', () => {
      const handler = new DateArchiveRedirectHandler()
      const result = handler.handle('/2024/01/exemplo-post')

      expect(result).toEqual({
        destination: '/exemplo-post',
        permanent: true
      })
    })

    it('should handle different years and months', () => {
      const handler = new DateArchiveRedirectHandler()
      const result = handler.handle('/2023/12/artigo-antigo')

      expect(result).toEqual({
        destination: '/artigo-antigo',
        permanent: true
      })
    })

    it('should return null for non-date-archive URLs', () => {
      const handler = new DateArchiveRedirectHandler()
      const result = handler.handle('/concursos/como-estudar')

      expect(result).toBeNull()
    })

    it('should return null for malformed date patterns', () => {
      const handler = new DateArchiveRedirectHandler()
      const result = handler.handle('/24/01/post')

      expect(result).toBeNull()
    })
  })

  describe('TrailingSlashHandler', () => {
    it('should remove trailing slash from URLs', () => {
      const handler = new TrailingSlashHandler()
      const result = handler.handle('/concursos/')

      expect(result).toEqual({
        destination: '/concursos',
        permanent: true
      })
    })

    it('should handle nested paths with trailing slash', () => {
      const handler = new TrailingSlashHandler()
      const result = handler.handle('/direito/constitucional/')

      expect(result).toEqual({
        destination: '/direito/constitucional',
        permanent: true
      })
    })

    it('should not redirect root URL', () => {
      const handler = new TrailingSlashHandler()
      const result = handler.handle('/')

      expect(result).toBeNull()
    })

    it('should return null for URLs without trailing slash', () => {
      const handler = new TrailingSlashHandler()
      const result = handler.handle('/concursos')

      expect(result).toBeNull()
    })
  })

  describe('RedirectChain - Integration', () => {
    let chain: RedirectChain

    beforeEach(() => {
      chain = new RedirectChain()
    })

    it('should process category redirects through chain', () => {
      const result = chain.process('/category/concursos')

      expect(result).toEqual({
        destination: '/concursos',
        permanent: true
      })
    })

    it('should process date archive redirects through chain', () => {
      const result = chain.process('/2024/01/exemplo-post')

      expect(result).toEqual({
        destination: '/exemplo-post',
        permanent: true
      })
    })

    it('should process trailing slash redirects through chain', () => {
      const result = chain.process('/concursos/')

      expect(result).toEqual({
        destination: '/concursos',
        permanent: true
      })
    })

    it('should return null for URLs needing no redirect', () => {
      const result = chain.process('/concursos')

      expect(result).toBeNull()
    })

    it('should process multiple redirects in batch', () => {
      const sources = [
        '/category/concursos',
        '/2024/01/post',
        '/exemplo/',
        '/normal-url'
      ]

      const redirects = chain.getAllRedirects(sources)

      expect(redirects).toHaveLength(3)
      expect(redirects[0]).toEqual({
        source: '/category/concursos',
        destination: '/concursos',
        permanent: true
      })
      expect(redirects[1]).toEqual({
        source: '/2024/01/post',
        destination: '/post',
        permanent: true
      })
      expect(redirects[2]).toEqual({
        source: '/exemplo/',
        destination: '/exemplo',
        permanent: true
      })
    })

    it('should handle chain order correctly - category before date', () => {
      const result = chain.process('/category/2024')

      expect(result).toEqual({
        destination: '/2024',
        permanent: true
      })
    })

    it('should handle complex nested paths', () => {
      const result = chain.process('/category/direito-constitucional/principios')

      expect(result).toEqual({
        destination: '/direito-constitucional/principios',
        permanent: true
      })
    })
  })
})
