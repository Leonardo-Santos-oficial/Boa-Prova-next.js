import { CacheManager } from '../cache-manager'
import { InMemoryCacheStrategy, NoCacheStrategy } from '../cache-strategy'

describe('CacheManager', () => {
  describe('InMemoryCacheStrategy', () => {
    let cache: CacheManager<string>

    beforeEach(() => {
      cache = new CacheManager(new InMemoryCacheStrategy())
    })

    it('should cache fetched values', async () => {
      const fetchFn = jest.fn().mockResolvedValue('test-value')

      const result1 = await cache.getOrFetch('key1', fetchFn)
      const result2 = await cache.getOrFetch('key1', fetchFn)

      expect(result1).toBe('test-value')
      expect(result2).toBe('test-value')
      expect(fetchFn).toHaveBeenCalledTimes(1)
    })

    it('should fetch different keys separately', async () => {
      const fetchFn1 = jest.fn().mockResolvedValue('value1')
      const fetchFn2 = jest.fn().mockResolvedValue('value2')

      const result1 = await cache.getOrFetch('key1', fetchFn1)
      const result2 = await cache.getOrFetch('key2', fetchFn2)

      expect(result1).toBe('value1')
      expect(result2).toBe('value2')
      expect(fetchFn1).toHaveBeenCalledTimes(1)
      expect(fetchFn2).toHaveBeenCalledTimes(1)
    })

    it('should clear cache', async () => {
      const fetchFn = jest.fn().mockResolvedValue('test-value')

      await cache.getOrFetch('key1', fetchFn)
      cache.clear()
      await cache.getOrFetch('key1', fetchFn)

      expect(fetchFn).toHaveBeenCalledTimes(2)
    })

    it('should cache null values', async () => {
      const cacheWithNull = new CacheManager<string | null>(new InMemoryCacheStrategy())
      const fetchFn = jest.fn().mockResolvedValue(null)

      const result1 = await cacheWithNull.getOrFetch('key1', fetchFn)
      const result2 = await cacheWithNull.getOrFetch('key1', fetchFn)

      expect(result1).toBeNull()
      expect(result2).toBeNull()
      expect(fetchFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('NoCacheStrategy', () => {
    let cache: CacheManager<string>

    beforeEach(() => {
      cache = new CacheManager(new NoCacheStrategy())
    })

    it('should not cache values', async () => {
      const fetchFn = jest.fn().mockResolvedValue('test-value')

      await cache.getOrFetch('key1', fetchFn)
      await cache.getOrFetch('key1', fetchFn)

      expect(fetchFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('Strategy switching', () => {
    it('should allow strategy switching', async () => {
      const cache = new CacheManager(new InMemoryCacheStrategy<string>())
      const fetchFn = jest.fn().mockResolvedValue('test-value')

      await cache.getOrFetch('key1', fetchFn)
      expect(fetchFn).toHaveBeenCalledTimes(1)

      cache.setStrategy(new NoCacheStrategy())
      await cache.getOrFetch('key1', fetchFn)
      expect(fetchFn).toHaveBeenCalledTimes(2)
    })
  })
})
