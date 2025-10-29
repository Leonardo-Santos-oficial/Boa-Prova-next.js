export function createMockIntersectionObserver() {
  const mockIntersectionObserver = jest.fn()
  
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  })

  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver
  
  return mockIntersectionObserver
}

export function triggerIntersection(
  callback: IntersectionObserverCallback,
  entries: Partial<IntersectionObserverEntry>[]
) {
  callback(entries as IntersectionObserverEntry[], {} as IntersectionObserver)
}

export function createIntersectionObserverEntry(
  isIntersecting: boolean,
  intersectionRatio: number = 1
): Partial<IntersectionObserverEntry> {
  return {
    isIntersecting,
    intersectionRatio,
    target: document.createElement('div'),
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: Date.now()
  }
}
