import Card from '@/components/core/Card'

interface AdFormat {
  title: string
  dimensions: string
  description: string
}

const AD_FORMATS: AdFormat[] = [
  {
    title: 'Banner Superior',
    dimensions: '728x90 ou 970x90 pixels',
    description: 'Alta visibilidade no topo de todas as páginas'
  },
  {
    title: 'Sidebar',
    dimensions: '300x250 ou 300x600 pixels',
    description: 'Visível durante toda a leitura do artigo'
  },
  {
    title: 'In-Content',
    dimensions: '728x90 ou 300x250 pixels',
    description: 'Integrado naturalmente no conteúdo'
  }
]

export function AdFormatsSection() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Formatos de Anúncios Disponíveis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AD_FORMATS.map((format) => (
          <Card key={format.title} className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {format.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {format.dimensions}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {format.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
