import { MediaKitStats } from '@/types/media-kit'

export class MediaKitService {
  static getStats(): MediaKitStats {
    return {
      monthlyPageviews: 500000,
      monthlyUsers: 150000,
      avgSessionDuration: '4:32',
      bounceRate: '42%',
      topCategories: [
        { name: 'Concursos Públicos', percentage: 45 },
        { name: 'Direito', percentage: 25 },
        { name: 'Português', percentage: 15 },
        { name: 'Matemática', percentage: 10 },
        { name: 'Atualidades', percentage: 5 }
      ]
    }
  }

  static async getStatsAsync(): Promise<MediaKitStats> {
    return this.getStats()
  }
}
