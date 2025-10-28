import { AdSlotConfig } from '@/types/ads'

export const adSlotConfigs: Record<string, AdSlotConfig> = {
  headerBanner: {
    id: 'header-banner-001',
    sizes: [[728, 90], [970, 90]],
    position: 'header',
    lazyLoad: false,
    minViewport: 768
  },

  sidebarTop: {
    id: 'sidebar-top-001',
    sizes: [[300, 250], [300, 600]],
    position: 'sidebar',
    lazyLoad: true,
    minViewport: 1024
  },

  sidebarBottom: {
    id: 'sidebar-bottom-001',
    sizes: [[300, 250]],
    position: 'sidebar',
    lazyLoad: true,
    minViewport: 1024
  },

  inContentTop: {
    id: 'in-content-top-001',
    sizes: [[728, 90], [300, 250]],
    position: 'in-content',
    lazyLoad: true
  },

  inContentMiddle: {
    id: 'in-content-middle-001',
    sizes: [[728, 90], [300, 250]],
    position: 'in-content',
    lazyLoad: true
  },

  inContentBottom: {
    id: 'in-content-bottom-001',
    sizes: [[728, 90], [300, 250]],
    position: 'in-content',
    lazyLoad: true
  },

  footerBanner: {
    id: 'footer-banner-001',
    sizes: [[728, 90], [320, 50]],
    position: 'footer',
    lazyLoad: true
  },

  mobileBanner: {
    id: 'mobile-banner-001',
    sizes: [[320, 50], [320, 100]],
    position: 'header',
    lazyLoad: false,
    maxViewport: 767
  }
}

export function getArticleAdSlots(): AdSlotConfig[] {
  return [
    adSlotConfigs.headerBanner,
    adSlotConfigs.mobileBanner,
    adSlotConfigs.sidebarTop,
    adSlotConfigs.inContentTop,
    adSlotConfigs.inContentMiddle,
    adSlotConfigs.sidebarBottom,
    adSlotConfigs.inContentBottom,
    adSlotConfigs.footerBanner
  ]
}

export function getHomePageAdSlots(): AdSlotConfig[] {
  return [
    adSlotConfigs.headerBanner,
    adSlotConfigs.mobileBanner,
    adSlotConfigs.sidebarTop,
    adSlotConfigs.footerBanner
  ]
}
