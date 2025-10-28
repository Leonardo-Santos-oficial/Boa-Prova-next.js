import { MediaKitService } from '@/lib/media-kit/media-kit-service'

describe('MediaKitService', () => {
  describe('getStats', () => {
    it('should return valid stats object', () => {
      const stats = MediaKitService.getStats()

      expect(stats).toBeDefined()
      expect(stats.monthlyPageviews).toBeGreaterThan(0)
      expect(stats.monthlyUsers).toBeGreaterThan(0)
      expect(stats.avgSessionDuration).toBeTruthy()
      expect(stats.bounceRate).toBeTruthy()
      expect(stats.topCategories).toHaveLength(5)
    })

    it('should have correct data types', () => {
      const stats = MediaKitService.getStats()

      expect(typeof stats.monthlyPageviews).toBe('number')
      expect(typeof stats.monthlyUsers).toBe('number')
      expect(typeof stats.avgSessionDuration).toBe('string')
      expect(typeof stats.bounceRate).toBe('string')
      expect(Array.isArray(stats.topCategories)).toBe(true)
    })

    it('should have valid top categories structure', () => {
      const stats = MediaKitService.getStats()

      stats.topCategories.forEach((category) => {
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('percentage')
        expect(typeof category.name).toBe('string')
        expect(typeof category.percentage).toBe('number')
        expect(category.percentage).toBeGreaterThanOrEqual(0)
        expect(category.percentage).toBeLessThanOrEqual(100)
      })
    })

    it('should have categories summing to 100%', () => {
      const stats = MediaKitService.getStats()

      const total = stats.topCategories.reduce(
        (sum, cat) => sum + cat.percentage,
        0
      )

      expect(total).toBe(100)
    })
  })

  describe('getStatsAsync', () => {
    it('should return stats asynchronously', async () => {
      const stats = await MediaKitService.getStatsAsync()

      expect(stats).toBeDefined()
      expect(stats.monthlyPageviews).toBeGreaterThan(0)
    })

    it('should return same data as getStats', async () => {
      const syncStats = MediaKitService.getStats()
      const asyncStats = await MediaKitService.getStatsAsync()

      expect(asyncStats).toEqual(syncStats)
    })
  })
})
