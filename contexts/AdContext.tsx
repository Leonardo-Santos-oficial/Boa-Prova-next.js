'use client'

import { createContext, useContext, PropsWithChildren, useState, useCallback } from 'react'
import { AdProviderFactory } from '@/lib/ads/ad-provider-factory'
import { AdProvider } from '@/types/ads'

interface AdContextState {
  provider: AdProvider | null
  isInitialized: boolean
  initializeProvider: (type: 'adsense' | 'ezoic', useLazyLoading?: boolean) => void
  destroyProvider: () => void
}

const AdContext = createContext<AdContextState | null>(null)

export function AdContextProvider({ children }: PropsWithChildren) {
  const [provider, setProvider] = useState<AdProvider | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const initializeProvider = useCallback(
    (type: 'adsense' | 'ezoic' = 'adsense', useLazyLoading = true) => {
      if (isInitialized) return

      const newProvider = AdProviderFactory.create(type, useLazyLoading)
      setProvider(newProvider)
      setIsInitialized(true)
    },
    [isInitialized]
  )

  const destroyProvider = useCallback(() => {
    setProvider(null)
    setIsInitialized(false)
    AdProviderFactory.reset()
  }, [])

  const contextValue: AdContextState = {
    provider,
    isInitialized,
    initializeProvider,
    destroyProvider
  }

  return (
    <AdContext.Provider value={contextValue}>
      {children}
    </AdContext.Provider>
  )
}

export function useAdContext(): AdContextState {
  const context = useContext(AdContext)
  if (!context) {
    throw new Error('useAdContext must be used within AdContextProvider')
  }
  return context
}
