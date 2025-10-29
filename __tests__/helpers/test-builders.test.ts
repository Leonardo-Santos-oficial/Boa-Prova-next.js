/**
 * @jest-environment jsdom
 */

import { 
  MediaKitFixtureBuilder, 
  ContactFormDataBuilder,
  AdSlotConfigBuilder 
} from '@/__tests__/helpers/test-builders'

describe('Test Builders', () => {
  describe('MediaKitFixtureBuilder', () => {
    it('should build default stats', () => {
      const stats = new MediaKitFixtureBuilder().build()

      expect(stats.monthlyPageviews).toBe(500000)
      expect(stats.monthlyUsers).toBe(150000)
      expect(stats.topCategories).toEqual([])
    })

    it('should build custom stats', () => {
      const stats = new MediaKitFixtureBuilder()
        .withPageviews(1000000)
        .withUsers(300000)
        .withCategory('Test Category', 50)
        .build()

      expect(stats.monthlyPageviews).toBe(1000000)
      expect(stats.monthlyUsers).toBe(300000)
      expect(stats.topCategories).toHaveLength(1)
      expect(stats.topCategories[0]).toEqual({
        name: 'Test Category',
        percentage: 50
      })
    })

    it('should support method chaining', () => {
      const builder = new MediaKitFixtureBuilder()
      const result = builder.withPageviews(100).withUsers(50)

      expect(result).toBe(builder)
    })
  })

  describe('ContactFormDataBuilder', () => {
    it('should build valid form data', () => {
      const data = new ContactFormDataBuilder().buildValid()

      expect(data.name).toBeTruthy()
      expect(data.email).toContain('@')
      expect(data.company).toBeTruthy()
      expect(data.adType).toBeTruthy()
      expect(data.message.length).toBeGreaterThanOrEqual(10)
    })

    it('should build custom form data', () => {
      const data = new ContactFormDataBuilder()
        .withName('Custom Name')
        .withEmail('custom@test.com')
        .build()

      expect(data.name).toBe('Custom Name')
      expect(data.email).toBe('custom@test.com')
    })

    it('should support method chaining', () => {
      const builder = new ContactFormDataBuilder()
      const result = builder.withName('Test').withEmail('test@test.com')

      expect(result).toBe(builder)
    })
  })

  describe('AdSlotConfigBuilder', () => {
    it('should build leaderboard config', () => {
      const config = new AdSlotConfigBuilder().buildLeaderboard()

      expect(config.id).toBe('header-leaderboard')
      expect(config.sizes).toEqual([[728, 90]])
      expect(config.position).toBe('header')
      expect(config.lazyLoad).toBe(true)
    })

    it('should build sidebar config', () => {
      const config = new AdSlotConfigBuilder().buildSidebar()

      expect(config.id).toBe('sidebar-rectangle')
      expect(config.sizes).toEqual([[300, 250], [300, 600]])
      expect(config.position).toBe('sidebar')
    })

    it('should build custom config', () => {
      const config = new AdSlotConfigBuilder()
        .withId('custom-slot')
        .withSizes([320, 50], [320, 100])
        .withPosition('footer')
        .withLazyLoad(false)
        .build()

      expect(config.id).toBe('custom-slot')
      expect(config.sizes).toEqual([[320, 50], [320, 100]])
      expect(config.position).toBe('footer')
      expect(config.lazyLoad).toBe(false)
    })
  })
})
