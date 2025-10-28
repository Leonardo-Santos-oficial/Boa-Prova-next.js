'use client'

import { AdSlot } from './AdSlot'
import { AdProviderFactory } from '@/lib/ads/ad-provider-factory'
import { AdSlotConfig } from '@/types/ads'
import { useMemo } from 'react'

interface ResponsiveAdProps {
  desktopSlot: AdSlotConfig
  mobileSlot: AdSlotConfig
  providerType?: 'adsense' | 'ezoic'
}

export function ResponsiveAd({ 
  desktopSlot, 
  mobileSlot, 
  providerType = 'adsense' 
}: ResponsiveAdProps) {
  const provider = useMemo(() => {
    return AdProviderFactory.create(providerType, true)
  }, [providerType])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const activeSlot = isMobile ? mobileSlot : desktopSlot

  return <AdSlot config={activeSlot} provider={provider} />
}
