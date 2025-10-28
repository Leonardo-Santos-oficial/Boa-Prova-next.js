import Card from '@/components/core/Card'
import Button from '@/components/core/Button'

interface MediaKitStats {
  monthlyPageviews: number
  monthlyUsers: number
  avgSessionDuration: string
  bounceRate: string
  topCategories: Array<{ name: string; percentage: number }>
}

export default function MediaKitPage() {
  const stats: MediaKitStats = {
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Anuncie no Boa Prova
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Alcance milhares de estudantes focados em concursos públicos e vestibulares
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Estatísticas do Site
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {(stats.monthlyPageviews / 1000).toFixed(0)}K
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Pageviews/Mês
              </div>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {(stats.monthlyUsers / 1000).toFixed(0)}K
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Usuários/Mês
              </div>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.avgSessionDuration}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Tempo Médio
              </div>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.bounceRate}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Taxa de Rejeição
              </div>
            </Card>
          </div>
        </section>

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
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Formatos de Anúncios Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Banner Superior
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                728x90 ou 970x90 pixels
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Alta visibilidade no topo de todas as páginas
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Sidebar
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                300x250 ou 300x600 pixels
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Visível durante toda a leitura do artigo
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                In-Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                728x90 ou 300x250 pixels
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Integrado naturalmente no conteúdo
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Performance Técnica
          </h2>
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  95+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  PageSpeed Score
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  &lt; 0.1
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  CLS (Cumulative Layout Shift)
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  &lt; 2.5s
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  LCP (Largest Contentful Paint)
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Entre em Contato
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Interessado em anunciar no Boa Prova? Entre em contato para discutir 
            oportunidades de parceria e valores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = 'mailto:contato@boa-prova.com'}
              className="px-8 py-3"
            >
              Enviar E-mail
            </Button>
            <Button
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              className="px-8 py-3 bg-green-600 hover:bg-green-700"
            >
              WhatsApp
            </Button>
          </div>
        </section>
      </div>
  )
}
