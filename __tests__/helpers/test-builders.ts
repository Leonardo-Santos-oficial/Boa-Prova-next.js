import { ContactFormData } from '@/types/media-kit'
import { MediaKitStats } from '@/types/media-kit'
import { AdSlotConfig } from '@/types/ads'

export class MediaKitFixtureBuilder {
  private stats: MediaKitStats = {
    monthlyPageviews: 500000,
    monthlyUsers: 150000,
    avgSessionDuration: '4:32',
    bounceRate: '42%',
    topCategories: []
  }

  withPageviews(pageviews: number): this {
    this.stats.monthlyPageviews = pageviews
    return this
  }

  withUsers(users: number): this {
    this.stats.monthlyUsers = users
    return this
  }

  withCategory(name: string, percentage: number): this {
    this.stats.topCategories.push({ name, percentage })
    return this
  }

  build(): MediaKitStats {
    return { ...this.stats }
  }
}

export class ContactFormDataBuilder {
  private data: ContactFormData = {
    name: '',
    email: '',
    company: '',
    adType: '',
    message: ''
  }

  withName(name: string): this {
    this.data.name = name
    return this
  }

  withEmail(email: string): this {
    this.data.email = email
    return this
  }

  withCompany(company: string): this {
    this.data.company = company
    return this
  }

  withAdType(adType: string): this {
    this.data.adType = adType
    return this
  }

  withMessage(message: string): this {
    this.data.message = message
    return this
  }

  buildValid(): ContactFormData {
    return {
      name: 'João Silva',
      email: 'joao@empresa.com',
      company: 'Empresa LTDA',
      adType: 'banner-superior',
      message: 'Gostaria de anunciar no site.'
    }
  }

  build(): ContactFormData {
    return { ...this.data }
  }
}

export class AdSlotConfigBuilder {
  private config: AdSlotConfig = {
    id: '',
    sizes: [],
    position: 'header',
    lazyLoad: true
  }

  withId(id: string): this {
    this.config.id = id
    return this
  }

  withSizes(...sizes: [number, number][]): this {
    this.config.sizes = sizes
    return this
  }

  withPosition(position: AdSlotConfig['position']): this {
    this.config.position = position
    return this
  }

  withLazyLoad(lazyLoad: boolean): this {
    this.config.lazyLoad = lazyLoad
    return this
  }

  buildLeaderboard(): AdSlotConfig {
    return {
      id: 'header-leaderboard',
      sizes: [[728, 90]],
      position: 'header',
      lazyLoad: true
    }
  }

  buildSidebar(): AdSlotConfig {
    return {
      id: 'sidebar-rectangle',
      sizes: [[300, 250], [300, 600]],
      position: 'sidebar',
      lazyLoad: true
    }
  }

  build(): AdSlotConfig {
    return { ...this.config }
  }
}
