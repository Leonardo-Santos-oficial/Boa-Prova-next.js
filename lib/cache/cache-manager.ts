import { CacheStrategy, InMemoryCacheStrategy } from './cache-strategy'

export class CacheManager<T> {
  constructor(private strategy: CacheStrategy<T>) {}

  async getOrFetch(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cached = this.strategy.get(key)
    if (cached !== undefined) {
      return cached
    }

    const value = await fetchFn()
    this.strategy.set(key, value)
    return value
  }

  setStrategy(strategy: CacheStrategy<T>): void {
    this.strategy = strategy
  }

  clear(): void {
    this.strategy.clear()
  }
}

export const contentCache = new CacheManager<ContentNode | null>(new InMemoryCacheStrategy())
export const urisCache = new CacheManager<string[]>(new InMemoryCacheStrategy())

import { ContentNode } from '@/types/wordpress'
