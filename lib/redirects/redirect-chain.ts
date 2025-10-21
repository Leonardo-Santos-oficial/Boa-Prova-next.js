// Chain of Responsibility Pattern para sistema de redirecionamento

export interface RedirectRequest {
  path: string
  query?: Record<string, string | string[]>
}

export interface RedirectResult {
  destination: string
  permanent: boolean
}

export abstract class RedirectHandler {
  protected nextHandler: RedirectHandler | null = null

  setNext(handler: RedirectHandler): RedirectHandler {
    this.nextHandler = handler
    return handler
  }

  async handle(request: RedirectRequest): Promise<RedirectResult | null> {
    const result = await this.process(request)
    
    if (result) {
      return result
    }

    if (this.nextHandler) {
      return this.nextHandler.handle(request)
    }

    return null
  }

  protected abstract process(request: RedirectRequest): Promise<RedirectResult | null>
}

export class OldCategoryRedirectHandler extends RedirectHandler {
  protected async process(request: RedirectRequest): Promise<RedirectResult | null> {
    const oldCategoryPattern = /^\/categoria\/(.+)$/
    const match = request.path.match(oldCategoryPattern)
    
    if (match) {
      const categorySlug = match[1]
      return {
        destination: `/${categorySlug}/`,
        permanent: true
      }
    }
    
    return null
  }
}

export class OldTagRedirectHandler extends RedirectHandler {
  protected async process(request: RedirectRequest): Promise<RedirectResult | null> {
    const oldTagPattern = /^\/tag\/(.+)$/
    const match = request.path.match(oldTagPattern)
    
    if (match) {
      const tagSlug = match[1]
      return {
        destination: `/assunto/${tagSlug}/`,
        permanent: true
      }
    }
    
    return null
  }
}

export class QueryParameterRedirectHandler extends RedirectHandler {
  protected async process(request: RedirectRequest): Promise<RedirectResult | null> {
    if (request.query?.p) {
      const postId = Array.isArray(request.query.p) ? request.query.p[0] : request.query.p
      return {
        destination: `/post/${postId}/`,
        permanent: true
      }
    }
    
    return null
  }
}

export class TrailingSlashRedirectHandler extends RedirectHandler {
  protected async process(request: RedirectRequest): Promise<RedirectResult | null> {
    if (!request.path.endsWith('/') && !request.path.includes('.')) {
      return {
        destination: `${request.path}/`,
        permanent: true
      }
    }
    
    return null
  }
}

export class LegacyDateRedirectHandler extends RedirectHandler {
  protected async process(request: RedirectRequest): Promise<RedirectResult | null> {
    const datePattern = /^\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/
    const match = request.path.match(datePattern)
    
    if (match) {
      const slug = match[4]
      return {
        destination: `/${slug}/`,
        permanent: true
      }
    }
    
    return null
  }
}

export function createRedirectChain(): RedirectHandler {
  const queryParamHandler = new QueryParameterRedirectHandler()
  const legacyDateHandler = new LegacyDateRedirectHandler()
  const oldCategoryHandler = new OldCategoryRedirectHandler()
  const oldTagHandler = new OldTagRedirectHandler()
  const trailingSlashHandler = new TrailingSlashRedirectHandler()

  queryParamHandler
    .setNext(legacyDateHandler)
    .setNext(oldCategoryHandler)
    .setNext(oldTagHandler)
    .setNext(trailingSlashHandler)

  return queryParamHandler
}
