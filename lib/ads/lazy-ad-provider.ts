import { AdProvider } from '@/types/ads'

export class LazyAdProvider implements AdProvider {
  readonly name: string
  private provider: AdProvider
  private initPromise: Promise<void> | null = null
  private initialized = false

  constructor(provider: AdProvider) {
    this.provider = provider
    this.name = `Lazy ${provider.name}`
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    if (!this.initPromise) {
      this.initPromise = this.provider.initialize().then(() => {
        this.initialized = true
      })
    }

    return this.initPromise
  }

  displayAd(slotId: string, container: HTMLElement): void {
    if (!this.initialized) {
      this.initialize().then(() => {
        this.provider.displayAd(slotId, container)
      }).catch(error => {
        console.error('Failed to initialize ad provider:', error)
      })
      return
    }

    this.provider.displayAd(slotId, container)
  }

  destroyAd(slotId: string): void {
    if (this.initialized) {
      this.provider.destroyAd(slotId)
    }
  }
}
