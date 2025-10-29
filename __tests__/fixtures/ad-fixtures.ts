import { AdSlotConfig } from '@/types/ads'

export const mockAdSlotConfigs: Record<string, AdSlotConfig> = {
  headerLeaderboard: {
    id: 'header-leaderboard-001',
    sizes: [[728, 90], [970, 90]],
    position: 'header',
    lazyLoad: true,
    minViewport: 768
  },
  sidebarRectangle: {
    id: 'sidebar-rectangle-001',
    sizes: [[300, 250], [300, 600]],
    position: 'sidebar',
    lazyLoad: true
  },
  inContentRectangle: {
    id: 'content-rectangle-001',
    sizes: [[300, 250], [336, 280]],
    position: 'in-content',
    lazyLoad: true
  },
  mobileLeaderboard: {
    id: 'mobile-leaderboard-001',
    sizes: [[320, 100], [320, 50]],
    position: 'header',
    lazyLoad: true,
    maxViewport: 767
  }
}
