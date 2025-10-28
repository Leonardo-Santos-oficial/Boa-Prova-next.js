import Card from '@/components/core/Card'

interface PerformanceMetric {
  value: string
  label: string
  color: string
}

const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    value: '95+',
    label: 'PageSpeed Score',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    value: '< 0.1',
    label: 'CLS (Cumulative Layout Shift)',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    value: '< 2.5s',
    label: 'LCP (Largest Contentful Paint)',
    color: 'text-green-600 dark:text-green-400'
  }
]

export function PerformanceSection() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Performance Técnica
      </h2>
      <Card className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {PERFORMANCE_METRICS.map((metric) => (
            <div key={metric.label}>
              <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                {metric.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}
