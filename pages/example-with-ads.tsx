import { AdSlot } from '@/components/ads/AdSlot'
import { AdProviderFactory } from '@/lib/ads/ad-provider-factory'
import { AdSlotConfig } from '@/types/ads'

export default function ExampleArticleWithAds() {
  const factory = AdProviderFactory
  const provider = factory.create('adsense', false) // Disable lazy loading for testing

  // Simple test ad configuration
  const testAdConfig: AdSlotConfig = {
    id: 'test-ad-001',
    sizes: [[300, 250]],
    position: 'in-content',
    lazyLoad: false
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Exemplo de Artigo com Monetização
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Este é um exemplo de como integrar anúncios em páginas de artigo
            </p>
          </header>

            <div className="prose dark:prose-invert max-w-none my-8">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Test Ad Slot */}
            <div className="my-8">
              <AdSlot 
                config={testAdConfig}
                provider={provider}
              />
            </div>

            <div className="prose dark:prose-invert max-w-none my-8">
              <h2>Seção 2</h2>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse 
                cillum dolore eu fugiat nulla pariatur.
              </p>
              <p>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa 
                qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-4 space-y-6">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-4">Conteúdo Relacionado</h3>
                <ul className="space-y-2">
                  <li>Artigo relacionado 1</li>
                  <li>Artigo relacionado 2</li>
                  <li>Artigo relacionado 3</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
  )
}
