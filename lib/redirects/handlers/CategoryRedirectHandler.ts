import { AbstractRedirectHandler } from '../AbstractRedirectHandler'
import { RedirectResult } from '../types'

export class CategoryRedirectHandler extends AbstractRedirectHandler {
  handle(source: string): RedirectResult | null {
    const categoryPattern = /^\/category\/(.+)$/
    const match = source.match(categoryPattern)

    if (match) {
      const slug = match[1]
      return {
        destination: `/${slug}`,
        permanent: true
      }
    }

    return super.handle(source)
  }
}
