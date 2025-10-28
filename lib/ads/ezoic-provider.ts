import { AdProvider } from '@/types/ads'

export class EzoicProvider implements AdProvider {
  readonly name = 'Ezoic'
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = this.loadEzoicScript()
    await this.initializationPromise
    this.isInitialized = true
  }

  displayAd(slotId: string, container: HTMLElement): void {
    if (!this.isInitialized) {
      console.warn('Ezoic not initialized. Call initialize() first.')
      return
    }

    const placeholder = document.createElement('div')
    placeholder.id = slotId
    placeholder.className = 'ezoic-ad'
    container.appendChild(placeholder)

    try {
      interface EzoicStandalone {
        cmd?: Array<() => void>
        define?: (slotId: string) => void
        display?: (slotId: string) => void
      }

      const windowWithEzoic = window as Window & {
        ezstandalone?: EzoicStandalone
      }
      
      windowWithEzoic.ezstandalone = windowWithEzoic.ezstandalone || {
        cmd: [],
        define: () => {},
        display: () => {}
      }
      windowWithEzoic.ezstandalone.cmd = windowWithEzoic.ezstandalone.cmd || []
      windowWithEzoic.ezstandalone.cmd.push(() => {
        if (windowWithEzoic.ezstandalone?.define && windowWithEzoic.ezstandalone?.display) {
          windowWithEzoic.ezstandalone.define(slotId)
          windowWithEzoic.ezstandalone.display(slotId)
        }
      })
    } catch (error) {
      console.error('Failed to display Ezoic ad:', error)
    }
  }

  destroyAd(slotId: string): void {
    const element = document.getElementById(slotId)
    if (element) {
      element.remove()
    }
  }

  private async loadEzoicScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve()
        return
      }

      const existingScript = document.querySelector(
        'script[src*="ezoic.js"]'
      )
      if (existingScript) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = '//www.ezojs.com/ezoic/ezoic.js'
      script.async = true
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Ezoic script'))
      
      document.head.appendChild(script)
    })
  }
}
