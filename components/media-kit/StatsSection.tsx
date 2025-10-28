import Card from '@/components/core/Card'
import { MediaKitStats } from '@/types/media-kit'

interface StatsSectionProps {
  stats: MediaKitStats
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statCards = [
    {
      value: `${(stats.monthlyPageviews / 1000).toFixed(0)}K`,
      label: 'Pageviews/Mês',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      value: `${(stats.monthlyUsers / 1000).toFixed(0)}K`,
      label: 'Usuários/Mês',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      value: stats.avgSessionDuration,
      label: 'Tempo Médio',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      value: stats.bounceRate,
      label: 'Taxa de Rejeição',
      color: 'text-blue-600 dark:text-blue-400'
    }
  ]

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Estatísticas do Site
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="text-center p-6">
            <div className={`text-4xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
