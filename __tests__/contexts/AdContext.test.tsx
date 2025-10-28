/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { AdContextProvider, useAdContext } from '@/contexts/AdContext'
import { AdProviderFactory } from '@/lib/ads/ad-provider-factory'

describe('AdContext', () => {
  afterEach(() => {
    jest.clearAllMocks()
    AdProviderFactory.reset()
  })

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAdContext())
    }).toThrow('useAdContext must be used within AdContextProvider')
  })

  it('should initialize with null provider', () => {
    const { result } = renderHook(() => useAdContext(), {
      wrapper: AdContextProvider
    })

    expect(result.current.provider).toBeNull()
    expect(result.current.isInitialized).toBe(false)
  })

  it('should initialize adsense provider', () => {
    const { result } = renderHook(() => useAdContext(), {
      wrapper: AdContextProvider
    })

    act(() => {
      result.current.initializeProvider('adsense', false)
    })

    expect(result.current.provider).not.toBeNull()
    expect(result.current.isInitialized).toBe(true)
    expect(result.current.provider?.name).toContain('AdSense')
  })

  it('should initialize ezoic provider', () => {
    const { result } = renderHook(() => useAdContext(), {
      wrapper: AdContextProvider
    })

    act(() => {
      result.current.initializeProvider('ezoic', false)
    })

    expect(result.current.provider).not.toBeNull()
    expect(result.current.provider?.name).toContain('Ezoic')
  })

  it('should not reinitialize if already initialized', () => {
    const { result } = renderHook(() => useAdContext(), {
      wrapper: AdContextProvider
    })

    act(() => {
      result.current.initializeProvider('adsense')
    })

    const firstProvider = result.current.provider

    act(() => {
      result.current.initializeProvider('ezoic')
    })

    expect(result.current.provider).toBe(firstProvider)
  })

  it('should destroy provider', () => {
    const { result } = renderHook(() => useAdContext(), {
      wrapper: AdContextProvider
    })

    act(() => {
      result.current.initializeProvider('adsense')
    })

    expect(result.current.isInitialized).toBe(true)

    act(() => {
      result.current.destroyProvider()
    })

    expect(result.current.provider).toBeNull()
    expect(result.current.isInitialized).toBe(false)
  })

  it('should allow reinitialization after destroy', () => {
    const { result } = renderHook(() => useAdContext(), {
      wrapper: AdContextProvider
    })

    act(() => {
      result.current.initializeProvider('adsense')
    })

    act(() => {
      result.current.destroyProvider()
    })

    act(() => {
      result.current.initializeProvider('ezoic')
    })

    expect(result.current.isInitialized).toBe(true)
    expect(result.current.provider?.name).toContain('Ezoic')
  })
})
