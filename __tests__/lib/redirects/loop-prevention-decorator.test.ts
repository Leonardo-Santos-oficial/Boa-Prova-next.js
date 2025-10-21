import { LoopPreventionDecorator } from '../../../lib/redirects/loop-prevention-decorator'
import { RedirectHandler, RedirectRequest, RedirectResult } from '../../../lib/redirects/redirect-chain'

class MockRedirectHandler extends RedirectHandler {
  private mockResult: RedirectResult | null

  constructor(mockResult: RedirectResult | null = null) {
    super()
    this.mockResult = mockResult
  }

  setMockResult(result: RedirectResult | null): void {
    this.mockResult = result
  }

  protected async process(_request: RedirectRequest): Promise<RedirectResult | null> {
    return this.mockResult
  }
}

describe('LoopPreventionDecorator', () => {
  describe('SameDestinationRule', () => {
    it('should prevent redirect when destination equals path', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/exemplo-post',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ path: '/exemplo-post' })

      expect(result).toBeNull()
    })

    it('should allow redirect when destination differs from path', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/novo-post',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ path: '/antigo-post' })

      expect(result).toEqual({
        destination: '/novo-post',
        permanent: true
      })
    })
  })

  describe('InfiniteLoopRule', () => {
    it('should prevent redirect when normalized paths match', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/exemplo-post/',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ path: '/exemplo-post' })

      expect(result).toBeNull()
    })

    it('should prevent redirect with multiple trailing slashes', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/exemplo-post///',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ path: '/exemplo-post/' })

      expect(result).toBeNull()
    })

    it('should be case-insensitive', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/EXEMPLO-POST',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ path: '/exemplo-post' })

      expect(result).toBeNull()
    })

    it('should allow redirect when normalized paths differ', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/categoria/direito/',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ path: '/categoria/direito-constitucional' })

      expect(result).toEqual({
        destination: '/categoria/direito/',
        permanent: true
      })
    })
  })

  describe('Handler returns null', () => {
    it('should return null when wrapped handler returns null', async () => {
      const mockHandler = new MockRedirectHandler(null)
      const decorator = new LoopPreventionDecorator(mockHandler)
      
      const result = await decorator.handle({ path: '/exemplo-post' })

      expect(result).toBeNull()
    })
  })

  describe('Real-world scenarios', () => {
    it('should allow legacy date redirects', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/principios-fundamentais/',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ 
        path: '/2023/01/15/principios-fundamentais' 
      })

      expect(result).toEqual({
        destination: '/principios-fundamentais/',
        permanent: true
      })
    })

    it('should allow category redirects', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/direito-constitucional/',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ 
        path: '/categoria/direito-constitucional' 
      })

      expect(result).toEqual({
        destination: '/direito-constitucional/',
        permanent: true
      })
    })

    it('should allow tag redirects', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/assunto/concursos/',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ 
        path: '/tag/concursos' 
      })

      expect(result).toEqual({
        destination: '/assunto/concursos/',
        permanent: true
      })
    })

    it('should allow query parameter redirects', async () => {
      const mockHandler = new MockRedirectHandler({
        destination: '/post/123/',
        permanent: true
      })

      const decorator = new LoopPreventionDecorator(mockHandler)
      const result = await decorator.handle({ 
        path: '/',
        query: { p: '123' }
      })

      expect(result).toEqual({
        destination: '/post/123/',
        permanent: true
      })
    })
  })
})
