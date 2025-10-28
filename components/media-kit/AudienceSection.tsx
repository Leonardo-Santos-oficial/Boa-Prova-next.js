import Card from '@/components/core/Card'
import { MediaKitStats } from '@/types/media-kit'

interface AudienceSectionProps {
  stats: MediaKitStats
}

export function AudienceSection({ stats }: AudienceSectionProps) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Nossa Audiência
      </h2>
      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Categorias Mais Acessadas
        </h3>
        <div className="space-y-4">
          {stats.topCategories.map((category) => (
            <div key={category.name}>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">
                  {category.name}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {category.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}
