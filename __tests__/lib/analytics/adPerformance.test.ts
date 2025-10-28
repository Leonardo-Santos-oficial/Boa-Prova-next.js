/**
 * @jest-environment jsdom
 */

import { adPerformanceTracker } from '@/lib/analytics/adPerformance'

describe('AdPerformanceTracker', () => {
  beforeEach(() => {
    adPerformanceTracker.clear()
    jest.clearAllMocks()
  })

  describe('startTracking', () => {
    it('should initialize metrics for a slot', () => {
      adPerformanceTracker.startTracking('test-slot-001', 'sidebar')

      const metrics = adPerformanceTracker.getMetrics('test-slot-001')
      expect(metrics).toBeDefined()
      expect(metrics?.slotId).toBe('test-slot-001')
      expect(metrics?.position).toBe('sidebar')
      expect(metrics?.isViewable).toBe(false)
    })

    it('should track impression time', () => {
      const beforeTime = Date.now()
      adPerformanceTracker.startTracking('test-slot-002', 'header')
      const afterTime = Date.now()

      const metrics = adPerformanceTracker.getMetrics('test-slot-002')
      expect(metrics?.impressionTime).toBeGreaterThanOrEqual(beforeTime)
      expect(metrics?.impressionTime).toBeLessThanOrEqual(afterTime)
    })
  })

  describe('recordLoadTime', () => {
    it('should calculate load time correctly', async () => {
      adPerformanceTracker.startTracking('test-slot-003', 'footer')

      await new Promise(resolve => setTimeout(resolve, 100))

      adPerformanceTracker.recordLoadTime('test-slot-003')

      const metrics = adPerformanceTracker.getMetrics('test-slot-003')
      expect(metrics?.loadTime).toBeGreaterThanOrEqual(100)
    })

    it('should not error for non-existent slot', () => {
      expect(() => {
        adPerformanceTracker.recordLoadTime('non-existent')
      }).not.toThrow()
    })
  })

  describe('getAllMetrics', () => {
    it('should return all tracked metrics', () => {
      adPerformanceTracker.startTracking('slot-1', 'header')
      adPerformanceTracker.startTracking('slot-2', 'sidebar')
      adPerformanceTracker.startTracking('slot-3', 'footer')

      const allMetrics = adPerformanceTracker.getAllMetrics()
      expect(allMetrics).toHaveLength(3)
    })

    it('should return empty array when no metrics', () => {
      const allMetrics = adPerformanceTracker.getAllMetrics()
      expect(allMetrics).toEqual([])
    })
  })

  describe('getViewabilityRate', () => {
    it('should calculate viewability rate correctly', () => {
      adPerformanceTracker.startTracking('slot-1', 'header')
      adPerformanceTracker.startTracking('slot-2', 'sidebar')
      adPerformanceTracker.startTracking('slot-3', 'footer')

      const metrics1 = adPerformanceTracker.getMetrics('slot-1')
      const metrics2 = adPerformanceTracker.getMetrics('slot-2')
      
      if (metrics1) metrics1.isViewable = true
      if (metrics2) metrics2.isViewable = true

      const rate = adPerformanceTracker.getViewabilityRate()
      expect(rate).toBeCloseTo(0.667, 2)
    })

    it('should return 0 when no ads tracked', () => {
      const rate = adPerformanceTracker.getViewabilityRate()
      expect(rate).toBe(0)
    })
  })

  describe('getAverageLoadTime', () => {
    it('should calculate average load time', () => {
      adPerformanceTracker.startTracking('slot-1', 'header')
      adPerformanceTracker.startTracking('slot-2', 'sidebar')

      const metrics1 = adPerformanceTracker.getMetrics('slot-1')
      const metrics2 = adPerformanceTracker.getMetrics('slot-2')

      if (metrics1) metrics1.loadTime = 100
      if (metrics2) metrics2.loadTime = 200

      const avgLoadTime = adPerformanceTracker.getAverageLoadTime()
      expect(avgLoadTime).toBe(150)
    })

    it('should return 0 when no ads tracked', () => {
      const avgLoadTime = adPerformanceTracker.getAverageLoadTime()
      expect(avgLoadTime).toBe(0)
    })
  })

  describe('getAverageViewabilityDuration', () => {
    it('should calculate average viewability duration for viewable ads', () => {
      adPerformanceTracker.startTracking('slot-1', 'header')
      adPerformanceTracker.startTracking('slot-2', 'sidebar')
      adPerformanceTracker.startTracking('slot-3', 'footer')

      const metrics1 = adPerformanceTracker.getMetrics('slot-1')
      const metrics2 = adPerformanceTracker.getMetrics('slot-2')
      const metrics3 = adPerformanceTracker.getMetrics('slot-3')

      if (metrics1) {
        metrics1.isViewable = true
        metrics1.viewabilityDuration = 3000
      }
      if (metrics2) {
        metrics2.isViewable = true
        metrics2.viewabilityDuration = 5000
      }
      if (metrics3) {
        metrics3.isViewable = false
      }

      const avgDuration = adPerformanceTracker.getAverageViewabilityDuration()
      expect(avgDuration).toBe(4000)
    })

    it('should return 0 when no viewable ads', () => {
      adPerformanceTracker.startTracking('slot-1', 'header')
      
      const avgDuration = adPerformanceTracker.getAverageViewabilityDuration()
      expect(avgDuration).toBe(0)
    })
  })

  describe('clear', () => {
    it('should clear all metrics', () => {
      adPerformanceTracker.startTracking('slot-1', 'header')
      adPerformanceTracker.startTracking('slot-2', 'sidebar')

      expect(adPerformanceTracker.getAllMetrics()).toHaveLength(2)

      adPerformanceTracker.clear()

      expect(adPerformanceTracker.getAllMetrics()).toHaveLength(0)
    })
  })
})
