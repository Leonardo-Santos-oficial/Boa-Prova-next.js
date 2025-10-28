import Layout from '@/components/layout/Layout'
import { ResponsiveAd } from '@/components/ads/ResponsiveAd'
import { AdSlotConfig } from '@/types/ads'

const desktopSlot: AdSlotConfig = {
  id: 'header-leaderboard-desktop',
  sizes: [[728, 90]],
  position: 'header',
  lazyLoad: true,
  minViewport: 768
}

const mobileSlot: AdSlotConfig = {
  id: 'header-leaderboard-mobile',
  sizes: [[320, 100]],
  position: 'header',
  lazyLoad: true,
  maxViewport: 767
}

export default function ResponsiveAdDemo() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Exemplo: ResponsiveAd Component
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            🎯 Header Ad (Responsivo)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Este componente exibe automaticamente:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-600 dark:text-gray-400">
            <li>Desktop: Leaderboard 728x90</li>
            <li>Mobile: Mobile Banner 320x100</li>
          </ul>

          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
            <ResponsiveAd
              desktopSlot={desktopSlot}
              mobileSlot={mobileSlot}
              providerType="adsense"
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📊 Benefícios</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">✅ Automático</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detecta automaticamente o device do usuário
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">⚡ Performance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Lazy loading integrado para melhor LCP
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">📱 Mobile-First</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Otimizado para experiência mobile
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">🎨 Zero CLS</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Espaço reservado para evitar layout shift
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">💻 Exemplo de Código</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">{`import { ResponsiveAd } from '@/components/ads/ResponsiveAd'

<ResponsiveAd
  desktopSlot={{
    id: 'header-leaderboard-desktop',
    sizes: [[728, 90]],
    position: 'header',
    lazyLoad: true,
    minViewport: 768
  }}
  mobileSlot={{
    id: 'header-leaderboard-mobile',
    sizes: [[320, 100]],
    position: 'header',
    lazyLoad: true,
    maxViewport: 767
  }}
  providerType="adsense"
/>`}</code>
          </pre>
        </section>
      </div>
    </Layout>
  )
}
