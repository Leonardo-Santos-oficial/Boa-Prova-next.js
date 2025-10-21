import { RedirectHandler, RedirectRequest, RedirectResult } from './redirect-chain'

interface ValidationRule {
  validate(request: RedirectRequest, result: RedirectResult): boolean
}

class SameDestinationRule implements ValidationRule {
  validate(request: RedirectRequest, result: RedirectResult): boolean {
    return request.path !== result.destination
  }
}

class InfiniteLoopRule implements ValidationRule {
  validate(request: RedirectRequest, result: RedirectResult): boolean {
    const normalizedPath = this.normalizePath(request.path)
    const normalizedDestination = this.normalizePath(result.destination)
    
    return normalizedPath !== normalizedDestination
  }

  private normalizePath(path: string): string {
    return path.replace(/\/+$/, '').toLowerCase()
  }
}

export class LoopPreventionDecorator extends RedirectHandler {
  private readonly wrappedHandler: RedirectHandler
  private readonly validationRules: ValidationRule[]

  constructor(handler: RedirectHandler) {
    super()
    this.wrappedHandler = handler
    this.validationRules = [
      new SameDestinationRule(),
      new InfiniteLoopRule()
    ]
  }

  protected async process(request: RedirectRequest): Promise<RedirectResult | null> {
    const result = await this.wrappedHandler.handle(request)
    
    if (!result) {
      return null
    }

    if (this.isValidRedirect(request, result)) {
      return result
    }

    return null
  }

  private isValidRedirect(request: RedirectRequest, result: RedirectResult): boolean {
    return this.validationRules.every(rule => rule.validate(request, result))
  }
}
