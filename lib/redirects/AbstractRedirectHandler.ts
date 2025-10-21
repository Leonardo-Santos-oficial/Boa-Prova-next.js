import { RedirectHandler, RedirectResult } from './types'

export abstract class AbstractRedirectHandler implements RedirectHandler {
  private nextHandler?: RedirectHandler

  setNext(handler: RedirectHandler): RedirectHandler {
    this.nextHandler = handler
    return handler
  }

  handle(source: string): RedirectResult | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(source)
    }
    return null
  }

  protected passToNext(source: string): RedirectResult | null {
    return this.handle(source)
  }
}
