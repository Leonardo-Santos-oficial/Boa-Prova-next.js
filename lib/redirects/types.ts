export interface RedirectHandler {
  setNext(handler: RedirectHandler): RedirectHandler
  handle(source: string): RedirectResult | null
}

export interface RedirectResult {
  destination: string
  permanent: boolean
}
