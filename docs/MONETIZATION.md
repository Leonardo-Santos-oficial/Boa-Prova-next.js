# Sistema de Monetização - Epic 3

## Visão Geral

Sistema completo de gestão de anúncios implementado com os padrões **Strategy** e **Proxy**, seguindo os princípios **SOLID** e **Clean Code**.

## Arquitetura

### Padrões de Design Aplicados

#### 1. Strategy Pattern
Permite alternar entre diferentes provedores de anúncios (AdSense, Ezoic) sem modificar o código cliente.

```typescript
interface AdProvider {
  name: string
  initialize(): Promise<void>
  displayAd(slotId: string, container: HTMLElement): void
  destroyAd(slotId: string): void
}
```

#### 2. Proxy Pattern (Lazy Loading)
Implementado através do `LazyAdProvider`, que adia a inicialização do provider até que seja realmente necessário, otimizando a performance inicial.

### Princípios SOLID

- **SRP (Single Responsibility Principle)**: Cada provider gerencia apenas sua integração específica
- **OCP (Open/Closed Principle)**: Sistema aberto para novos providers sem modificar código existente
- **LSP (Liskov Substitution Principle)**: Qualquer AdProvider pode substituir outro
- **ISP (Interface Segregation Principle)**: Interface minimalista com métodos essenciais
- **DIP (Dependency Inversion Principle)**: Componentes dependem de abstrações (AdProvider)

## Estrutura de Arquivos

```
lib/ads/
├── ad-provider-factory.ts      # Factory para criar providers
├── adsense-provider.ts         # Implementação Google AdSense
├── ezoic-provider.ts           # Implementação Ezoic
├── lazy-ad-provider.ts         # Proxy com lazy loading
└── ad-slots-config.ts          # Configurações de slots

components/ads/
├── AdSlot.tsx                  # Componente individual de anúncio
└── AdManager.tsx               # Gerenciador de múltiplos ads

types/
└── ads.d.ts                    # Interfaces TypeScript
```

## Uso

### 1. Configurar Variáveis de Ambiente

```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX
```

### 2. Adicionar Ads em uma Página

```tsx
import { AdManager } from '@/components/ads/AdManager'
import { getArticleAdSlots } from '@/lib/ads/ad-slots-config'

export default function ArticlePage() {
  return (
    <Layout>
      <AdManager 
        slots={getArticleAdSlots()} 
        providerType="adsense" 
      />
      <ArticleContent />
    </Layout>
  )
}
```

### 3. Adicionar um Slot Individual

```tsx
import { AdSlot } from '@/components/ads/AdSlot'
import { AdProviderFactory } from '@/lib/ads/ad-provider-factory'

const provider = AdProviderFactory.create('adsense')

<AdSlot
  config={{
    id: 'custom-slot-001',
    sizes: [[728, 90]],
    position: 'header',
    lazyLoad: true
  }}
  provider={provider}
/>
```

## Otimizações para Core Web Vitals

### CLS (Cumulative Layout Shift) < 0.1

1. **Espaço Reservado**: Cada slot reserva altura mínima antes de carregar
2. **Lazy Loading**: Ads fora da viewport não impactam layout inicial
3. **Placeholder**: Indicador visual enquanto o anúncio carrega

### LCP (Largest Contentful Paint) < 2.5s

1. **Inicialização Adiada**: Scripts carregam apenas quando necessário
2. **Intersection Observer**: Detecção eficiente de visibilidade
3. **Priorização**: Anúncios acima da dobra não usam lazy load

## Analytics

O sistema rastreia automaticamente:

- **Impressions**: Quando o ad entra na viewport
- **Loaded**: Quando o ad é carregado com sucesso
- **Errors**: Falhas no carregamento
- **Viewability**: Tempo de visualização

```typescript
import { trackAdEvent } from '@/lib/analytics'

// Rastreamento automático
trackAdEvent('impression', 'ad-123', 'sidebar')

// Métricas agregadas
const metrics = analytics.getAdMetrics()
console.log(metrics.errorRate) // Taxa de erro
```

## Media Kit

Página estática para anunciantes em `/media-kit`:

- Estatísticas de tráfego
- Perfil da audiência
- Formatos disponíveis
- Métricas de performance
- Formulário de contato

## Testes

### Unit Tests
```bash
npm test -- lib/ads
```

### E2E Tests
```bash
npm run test:e2e -- monetization.spec.ts
```

## Adicionando Novo Provider

1. Criar classe que implemente `AdProvider`:

```typescript
export class CustomProvider implements AdProvider {
  readonly name = 'Custom Provider'
  
  async initialize(): Promise<void> {
    // Carregar scripts
  }
  
  displayAd(slotId: string, container: HTMLElement): void {
    // Exibir anúncio
  }
  
  destroyAd(slotId: string): void {
    // Limpar anúncio
  }
}
```

2. Adicionar ao factory:

```typescript
case 'custom':
  return new CustomProvider()
```

## Métricas de Sucesso

- ✅ CLS < 0.1
- ✅ LCP < 2.5s
- ✅ Lazy loading funcional
- ✅ Suporte a múltiplos providers
- ✅ Analytics integrado
- ✅ Media Kit completo

## Próximos Passos

1. Integrar com Google Analytics 4
2. A/B testing de posições
3. Revenue optimization automática
4. Dashboard de métricas
