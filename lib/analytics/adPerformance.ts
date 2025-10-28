import { analytics } from '../analytics'

interface AdPerformanceMetrics {
  slotId: string
  position: string
  impressionTime: number
  loadTime: number
  viewabilityDuration: number
  isViewable: boolean
}

class AdPerformanceTracker {
  private metrics: Map<string, AdPerformanceMetrics> = new Map()
  private viewabilityObservers: Map<string, IntersectionObserver> = new Map()

  startTracking(slotId: string, position: string): void {
    this.metrics.set(slotId, {
      slotId,
      position,
      impressionTime: Date.now(),
      loadTime: 0,
      viewabilityDuration: 0,
      isViewable: false
    })
  }

  recordLoadTime(slotId: string): void {
    const metric = this.metrics.get(slotId)
    if (metric) {
      metric.loadTime = Date.now() - metric.impressionTime
    }
  }

  trackViewability(
    slotId: string, 
    container: HTMLElement,
    threshold = 0.5
  ): void {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const metric = this.metrics.get(slotId)
          if (!metric) return

          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            metric.isViewable = true
            const viewStartTime = Date.now()

            const checkInterval = setInterval(() => {
              if (entry.target.isConnected && entry.isIntersecting) {
                metric.viewabilityDuration = Date.now() - viewStartTime
              } else {
                clearInterval(checkInterval)
              }
            }, 1000)
          }
        })
      },
      { threshold }
    )

    observer.observe(container)
    this.viewabilityObservers.set(slotId, observer)
  }

  stopTracking(slotId: string): void {
    const observer = this.viewabilityObservers.get(slotId)
    if (observer) {
      observer.disconnect()
      this.viewabilityObservers.delete(slotId)
    }
  }

  getMetrics(slotId: string): AdPerformanceMetrics | undefined {
    return this.metrics.get(slotId)
  }

  getAllMetrics(): AdPerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }

  getViewabilityRate(): number {
    const allMetrics = this.getAllMetrics()
    if (allMetrics.length === 0) return 0

    const viewableCount = allMetrics.filter(m => m.isViewable).length
    return viewableCount / allMetrics.length
  }

  getAverageLoadTime(): number {
    const allMetrics = this.getAllMetrics()
    if (allMetrics.length === 0) return 0

    const totalLoadTime = allMetrics.reduce((sum, m) => sum + m.loadTime, 0)
    return totalLoadTime / allMetrics.length
  }

  getAverageViewabilityDuration(): number {
    const viewableMetrics = this.getAllMetrics().filter(m => m.isViewable)
    if (viewableMetrics.length === 0) return 0

    const totalDuration = viewableMetrics.reduce(
      (sum, m) => sum + m.viewabilityDuration, 
      0
    )
    return totalDuration / viewableMetrics.length
  }

  reportToAnalytics(): void {
    const report = {
      totalAds: this.getAllMetrics().length,
      viewabilityRate: this.getViewabilityRate(),
      avgLoadTime: this.getAverageLoadTime(),
      avgViewabilityDuration: this.getAverageViewabilityDuration()
    }

    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log('[Ad Performance Report]', report)
      
      analytics.trackStudyToolUsage('Quiz', 'completed', {
        adMetrics: report
      })
    }
  }

  clear(): void {
    this.viewabilityObservers.forEach(observer => observer.disconnect())
    this.viewabilityObservers.clear()
    this.metrics.clear()
  }
}

export const adPerformanceTracker = new AdPerformanceTracker()
