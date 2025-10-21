import { RedirectChain } from './RedirectChain'

export function getRedirects(): Array<{
  source: string
  destination: string
  permanent: boolean
}> {
  const chain = new RedirectChain()

  return [
    {
      source: '/category/:slug*',
      destination: '/:slug*',
      permanent: true
    },
    {
      source: '/:year(\\d{4})/:month(\\d{2})/:slug*',
      destination: '/:slug*',
      permanent: true
    },
    {
      source: '/:path*/',
      destination: '/:path*',
      permanent: true
    }
  ]
}

export function processRedirect(url: string): string | null {
  const chain = new RedirectChain()
  const result = chain.process(url)
  return result ? result.destination : null
}

export { RedirectChain } from './RedirectChain'
export { CategoryRedirectHandler } from './handlers/CategoryRedirectHandler'
export { DateArchiveRedirectHandler } from './handlers/DateArchiveRedirectHandler'
export { TrailingSlashHandler } from './handlers/TrailingSlashHandler'
