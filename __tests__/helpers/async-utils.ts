interface WaitForOptions {
  timeout?: number
  interval?: number
}

export async function waitFor(
  callback: () => boolean | Promise<boolean>,
  options: WaitForOptions = {}
): Promise<void> {
  const { timeout = 5000, interval = 50 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const result = await callback()
    if (result) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }

  throw new Error(`Timeout waiting for condition after ${timeout}ms`)
}

export function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve))
}

export async function nextTick(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 0))
}
