export interface AdSlotConfig {
  id: string
  sizes: [number, number][]
  position: AdPosition
  lazyLoad: boolean
  minViewport?: number
  maxViewport?: number
}

export type AdPosition = 
  | 'header'
  | 'sidebar'
  | 'in-content'
  | 'footer'

export interface AdProvider {
  name: string
  initialize(): Promise<void>
  displayAd(slotId: string, container: HTMLElement): void
  destroyAd(slotId: string): void
}
