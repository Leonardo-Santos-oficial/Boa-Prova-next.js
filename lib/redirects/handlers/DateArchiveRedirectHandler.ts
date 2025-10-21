import { AbstractRedirectHandler } from '../AbstractRedirectHandler'
import { RedirectResult } from '../types'

export class DateArchiveRedirectHandler extends AbstractRedirectHandler {
  handle(source: string): RedirectResult | null {
    const dateArchivePattern = /^\/(\d{4})\/(\d{2})\/(.+)$/
    const match = source.match(dateArchivePattern)

    if (match) {
      const slug = match[3]
      return {
        destination: `/${slug}`,
        permanent: true
      }
    }

    return super.handle(source)
  }
}
