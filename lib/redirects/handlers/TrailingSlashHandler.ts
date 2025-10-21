import { AbstractRedirectHandler } from '../AbstractRedirectHandler'
import { RedirectResult } from '../types'

export class TrailingSlashHandler extends AbstractRedirectHandler {
  handle(source: string): RedirectResult | null {
    if (source !== '/' && source.endsWith('/')) {
      return {
        destination: source.slice(0, -1),
        permanent: true
      }
    }

    return super.handle(source)
  }
}
