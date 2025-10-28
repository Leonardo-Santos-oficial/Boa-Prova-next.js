import { AdProvider } from '@/types/ads'

export class AdSenseProvider implements AdProvider {
  readonly name = 'Google AdSense'
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = this.loadAdSenseScript()
    await this.initializationPromise
    this.isInitialized = true
  }

  displayAd(slotId: string, container: HTMLElement): void {
    if (!this.isInitialized) {
      console.warn('AdSense not initialized. Call initialize() first.')
      return
    }

    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
    if (!clientId) {
      console.error('NEXT_PUBLIC_ADSENSE_CLIENT not configured')
      return
    }

    // Validate container dimensions before creating ad
    const { width, height } = container.getBoundingClientRect()
    console.log(`AdSense: Attempting to display ad in slot ${slotId}. Container dimensions: ${width}x${height}`)
    
    if (width < 10 || height < 10) {
      console.warn(`AdSense: Container for slot ${slotId} has insufficient dimensions (width: ${width}, height: ${height}). Aborting.`)
      return
    }

    const adElement = document.createElement('ins')
    adElement.className = 'adsbygoogle'
    adElement.style.display = 'block'
    adElement.setAttribute('data-ad-client', clientId)
    adElement.setAttribute('data-ad-slot', slotId)
    adElement.setAttribute('data-ad-format', 'auto')
    adElement.setAttribute('data-full-width-responsive', 'true')

    container.appendChild(adElement)

    try {
      const windowWithAds = window as Window & {
        adsbygoogle?: Array<Record<string, unknown>>
      }
      windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || []
      windowWithAds.adsbygoogle.push({})
    } catch (error) {
      console.error('Failed to display AdSense ad:', error)
    }
  }

  destroyAd(slotId: string): void {
    const elements = document.querySelectorAll(`[data-ad-slot="${slotId}"]`)
    elements.forEach(el => el.remove())
  }

  private async loadAdSenseScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve()
        return
      }

      const existingScript = document.querySelector(
        'script[src*="adsbygoogle.js"]'
      )
      if (existingScript) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      script.async = true
      script.crossOrigin = 'anonymous'
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load AdSense script'))
      
      document.head.appendChild(script)
    })
  }
}
