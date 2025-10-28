import { AdProvider } from '@/types/ads'
import { AdSenseProvider } from './adsense-provider'
import { EzoicProvider } from './ezoic-provider'
import { LazyAdProvider } from './lazy-ad-provider'

type ProviderType = 'adsense' | 'ezoic'

export class AdProviderFactory {
  private static instance: AdProvider | null = null

  static create(type: ProviderType = 'adsense', useLazyLoading = true): AdProvider {
    if (this.instance) {
      return this.instance
    }

    const baseProvider = this.createBaseProvider(type)
    this.instance = useLazyLoading ? new LazyAdProvider(baseProvider) : baseProvider

    return this.instance!
  }

  private static createBaseProvider(type: ProviderType): AdProvider {
    switch (type) {
      case 'adsense':
        return new AdSenseProvider()
      case 'ezoic':
        return new EzoicProvider()
      default:
        throw new Error(`Unknown provider type: ${type}`)
    }
  }

  static reset(): void {
    this.instance = null
  }
}
