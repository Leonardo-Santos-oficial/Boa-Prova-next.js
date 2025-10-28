/**
 * @jest-environment jsdom
 */

import { AdSenseProvider } from '@/lib/ads/adsense-provider'
import { EzoicProvider } from '@/lib/ads/ezoic-provider'
import { LazyAdProvider } from '@/lib/ads/lazy-ad-provider'

describe('AdSenseProvider', () => {
  let provider: AdSenseProvider

  beforeEach(() => {
    provider = new AdSenseProvider()
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  it('should have correct name', () => {
    expect(provider.name).toBe('Google AdSense')
  })

  it('should not display ad if not initialized', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    const container = document.createElement('div')
    
    provider.displayAd('test-slot', container)
    
    expect(consoleSpy).toHaveBeenCalledWith('AdSense not initialized. Call initialize() first.')
    consoleSpy.mockRestore()
  })

  it('should not display ad if client ID not configured', () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    
    const container = document.createElement('div')
    provider.displayAd('test-slot-123', container)
    
    expect(consoleSpy).toHaveBeenCalledWith('AdSense not initialized. Call initialize() first.')
    consoleSpy.mockRestore()
  })

  it('should destroy ad by slot id', () => {
    const container = document.createElement('div')
    const adElement = document.createElement('ins')
    adElement.setAttribute('data-ad-slot', 'test-slot-123')
    container.appendChild(adElement)
    document.body.appendChild(container)

    expect(document.querySelector('[data-ad-slot="test-slot-123"]')).toBeTruthy()

    provider.destroyAd('test-slot-123')
    
    expect(document.querySelector('[data-ad-slot="test-slot-123"]')).toBeFalsy()
  })
})

describe('EzoicProvider', () => {
  let provider: EzoicProvider

  beforeEach(() => {
    provider = new EzoicProvider()
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  it('should have correct name', () => {
    expect(provider.name).toBe('Ezoic')
  })

  it('should not display ad if not initialized', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    const container = document.createElement('div')
    
    provider.displayAd('test-slot', container)
    
    expect(consoleSpy).toHaveBeenCalledWith('Ezoic not initialized. Call initialize() first.')
    consoleSpy.mockRestore()
  })

  it('should destroy ad by id', () => {
    const placeholder = document.createElement('div')
    placeholder.id = 'ezoic-slot-123'
    document.body.appendChild(placeholder)

    expect(document.getElementById('ezoic-slot-123')).toBeTruthy()

    provider.destroyAd('ezoic-slot-123')
    
    expect(document.getElementById('ezoic-slot-123')).toBeFalsy()
  })
})

describe('LazyAdProvider', () => {
  let mockProvider: jest.Mocked<AdSenseProvider>
  let lazyProvider: LazyAdProvider

  beforeEach(() => {
    mockProvider = {
      name: 'Mock Provider',
      initialize: jest.fn().mockResolvedValue(undefined),
      displayAd: jest.fn(),
      destroyAd: jest.fn()
    } as unknown as jest.Mocked<AdSenseProvider>

    lazyProvider = new LazyAdProvider(mockProvider)
  })

  it('should have lazy prefix in name', () => {
    expect(lazyProvider.name).toBe('Lazy Mock Provider')
  })

  it('should not initialize immediately', () => {
    expect(mockProvider.initialize).not.toHaveBeenCalled()
  })

  it('should initialize on first displayAd call', async () => {
    const container = document.createElement('div')
    
    lazyProvider.displayAd('test-slot', container)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(mockProvider.initialize).toHaveBeenCalledTimes(1)
    expect(mockProvider.displayAd).toHaveBeenCalledWith('test-slot', container)
  })

  it('should initialize only once for multiple ads', async () => {
    const container1 = document.createElement('div')
    const container2 = document.createElement('div')
    
    await lazyProvider.initialize()
    lazyProvider.displayAd('slot1', container1)
    lazyProvider.displayAd('slot2', container2)
    
    expect(mockProvider.initialize).toHaveBeenCalledTimes(1)
    expect(mockProvider.displayAd).toHaveBeenCalledTimes(2)
  })

  it('should forward destroyAd after initialization', async () => {
    await lazyProvider.initialize()
    lazyProvider.destroyAd('test-slot')
    
    expect(mockProvider.destroyAd).toHaveBeenCalledWith('test-slot')
  })

  it('should not destroy ad if not initialized', () => {
    lazyProvider.destroyAd('test-slot')
    
    expect(mockProvider.destroyAd).not.toHaveBeenCalled()
  })
})
