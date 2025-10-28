import { analytics, trackAdEvent } from '@/lib/analytics'

describe('Analytics - Ad Tracking', () => {
  beforeEach(() => {
    analytics.clearAdEvents()
  })

  it('should track ad impression event', () => {
    trackAdEvent('impression', 'ad-123', 'sidebar')

    const events = analytics.getAdEvents()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('impression')
    expect(events[0].adId).toBe('ad-123')
    expect(events[0].position).toBe('sidebar')
  })

  it('should track ad loaded event', () => {
    trackAdEvent('loaded', 'ad-456', 'header')

    const events = analytics.getAdEvents()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('loaded')
  })

  it('should track ad error event', () => {
    trackAdEvent('error', 'ad-789', 'footer', { error: 'Network timeout' })

    const events = analytics.getAdEvents()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('error')
    expect(events[0].metadata?.error).toBe('Network timeout')
  })

  it('should calculate ad metrics correctly', () => {
    trackAdEvent('impression', 'ad-1', 'sidebar')
    trackAdEvent('loaded', 'ad-1', 'sidebar')
    trackAdEvent('impression', 'ad-2', 'header')
    trackAdEvent('error', 'ad-2', 'header')
    trackAdEvent('impression', 'ad-3', 'footer')
    trackAdEvent('loaded', 'ad-3', 'footer')

    const metrics = analytics.getAdMetrics()
    
    expect(metrics.totalImpressions).toBe(3)
    expect(metrics.totalLoaded).toBe(2)
    expect(metrics.totalErrors).toBe(1)
    expect(metrics.errorRate).toBeCloseTo(0.333, 2)
  })

  it('should handle zero impressions', () => {
    const metrics = analytics.getAdMetrics()
    
    expect(metrics.totalImpressions).toBe(0)
    expect(metrics.errorRate).toBe(0)
  })

  it('should clear ad events', () => {
    trackAdEvent('impression', 'ad-1', 'sidebar')
    trackAdEvent('loaded', 'ad-2', 'header')
    
    expect(analytics.getAdEvents()).toHaveLength(2)
    
    analytics.clearAdEvents()
    
    expect(analytics.getAdEvents()).toHaveLength(0)
  })

  it('should track events with timestamp', () => {
    const beforeTime = Date.now()
    trackAdEvent('impression', 'ad-1', 'sidebar')
    const afterTime = Date.now()

    const events = analytics.getAdEvents()
    expect(events[0].timestamp).toBeGreaterThanOrEqual(beforeTime)
    expect(events[0].timestamp).toBeLessThanOrEqual(afterTime)
  })
})
