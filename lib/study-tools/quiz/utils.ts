const cryptoApi = typeof globalThis !== 'undefined' ? (globalThis as { crypto?: Crypto }).crypto : undefined

export function createQuestionId(prefix: string, index: number): string {
  const uuid = cryptoApi && 'randomUUID' in cryptoApi
    ? cryptoApi.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return `${prefix}-${index}-${uuid}`
}
