export interface CacheStrategy<T> {
  get(key: string): T | undefined
  set(key: string, value: T): void
  clear(): void
  has(key: string): boolean
}

export class InMemoryCacheStrategy<T> implements CacheStrategy<T> {
  private cache: Map<string, T> = new Map()

  get(key: string): T | undefined {
    return this.cache.get(key)
  }

  set(key: string, value: T): void {
    this.cache.set(key, value)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }
}

export class NoCacheStrategy<T> implements CacheStrategy<T> {
  get(_key: string): T | undefined {
    return undefined
  }

  set(_key: string, _value: T): void {
    // No-op
  }

  clear(): void {
    // No-op
  }

  has(_key: string): boolean {
    return false
  }
}
