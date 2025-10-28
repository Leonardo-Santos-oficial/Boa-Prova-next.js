'use client'

import { AdSlot } from './AdSlot'
import { AdSlotConfig } from '@/types/ads'
import { AdProviderFactory } from '@/lib/ads/ad-provider-factory'
import { useMemo } from 'react'

interface AdManagerProps {
  slots: AdSlotConfig[]
  providerType?: 'adsense' | 'ezoic'
}

export function AdManager({ slots, providerType = 'adsense' }: AdManagerProps) {
  const provider = useMemo(() => {
    return AdProviderFactory.create(providerType, true)
  }, [providerType])

  return (
    <>
      {slots.map((slot) => (
        <AdSlot key={slot.id} config={slot} provider={provider} />
      ))}
    </>
  )
}
