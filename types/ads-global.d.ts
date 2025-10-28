declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
    ezstandalone?: {
      cmd?: Array<() => void>
      define?: (slotId: string) => void
      display?: (slotId: string) => void
    }
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, string | number | boolean>
    ) => void
  }
}

export {}
