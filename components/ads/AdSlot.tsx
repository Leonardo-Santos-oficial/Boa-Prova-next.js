'use client'

import { useEffect, useRef, useState } from 'react'
import { AdProvider, AdSlotConfig } from '@/types/ads'
import { trackAdEvent } from '@/lib/analytics'

interface AdSlotProps {
  config: AdSlotConfig
  provider: AdProvider
  className?: string
}

export function AdSlot({ config, provider, className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!config.lazyLoad) {
      setIsVisible(true)
      return
    }

    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          trackAdEvent('impression', config.id, config.position)
          observer.disconnect()
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [config.lazyLoad, config.id, config.position])

  useEffect(() => {
    if (!isVisible || isLoaded || !containerRef.current) return

    const loadAd = async () => {
      try {
        // Ensure container has dimensions before loading ad
        const container = containerRef.current
        if (!container) return

        // Wait for layout to be complete
        await new Promise(resolve => {
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            window.requestIdleCallback(resolve as IdleRequestCallback)
          } else {
            setTimeout(resolve, 300)
          }
        })
        
        const { width, height } = container.getBoundingClientRect()
        console.log(`AdSlot ${config.id}: Container dimensions before loading: ${width}x${height}`)
        
        if (width < 10 || height < 10) {
          console.error(`AdSlot ${config.id}: Container too small (${width}x${height}), skipping ad load`)
          return
        }

        await provider.initialize()
        provider.displayAd(config.id, container)
        setIsLoaded(true)
        trackAdEvent('loaded', config.id, config.position)
      } catch (error) {
        console.error('Failed to load ad:', error)
        trackAdEvent('error', config.id, config.position)
      }
    }

    loadAd()

    return () => {
      if (isLoaded) {
        provider.destroyAd(config.id)
      }
    }
  }, [isVisible, isLoaded, config.id, config.position, provider])

  const shouldRender = () => {
    if (typeof window === 'undefined') return true

    const viewportWidth = window.innerWidth

    if (config.minViewport && viewportWidth < config.minViewport) {
      return false
    }

    if (config.maxViewport && viewportWidth > config.maxViewport) {
      return false
    }

    return true
  }

  if (!shouldRender()) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className={`ad-slot ad-slot-${config.position} ${className}`}
      data-ad-id={config.id}
      style={{
        minHeight: config.sizes[0] ? `${config.sizes[0][1]}px` : '250px',
        minWidth: config.sizes[0] ? `${config.sizes[0][0]}px` : '300px',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {!isLoaded && (
        <div className="ad-placeholder" style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span className="text-sm text-gray-400">Advertisement</span>
        </div>
      )}
    </div>
  )
}
