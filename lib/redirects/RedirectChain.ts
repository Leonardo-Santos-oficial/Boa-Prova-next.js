import { RedirectHandler, RedirectResult } from './types'
import { CategoryRedirectHandler } from './handlers/CategoryRedirectHandler'
import { DateArchiveRedirectHandler } from './handlers/DateArchiveRedirectHandler'
import { TrailingSlashHandler } from './handlers/TrailingSlashHandler'

export class RedirectChain {
  private readonly chain: RedirectHandler

  constructor() {
    const categoryHandler = new CategoryRedirectHandler()
    const dateArchiveHandler = new DateArchiveRedirectHandler()
    const trailingSlashHandler = new TrailingSlashHandler()

    categoryHandler
      .setNext(dateArchiveHandler)
      .setNext(trailingSlashHandler)

    this.chain = categoryHandler
  }

  process(source: string): RedirectResult | null {
    return this.chain.handle(source)
  }

  getAllRedirects(sources: string[]): Array<{ source: string; destination: string; permanent: boolean }> {
    const redirects: Array<{ source: string; destination: string; permanent: boolean }> = []

    for (const source of sources) {
      const result = this.process(source)
      if (result) {
        redirects.push({
          source,
          destination: result.destination,
          permanent: result.permanent
        })
      }
    }

    return redirects
  }
}
