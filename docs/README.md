# Sistema de Redirects - Chain of Responsibility

## Arquitetura

Este módulo implementa redirects 301 usando o padrão **Chain of Responsibility**, permitindo adicionar novas regras de redirecionamento sem modificar código existente (OCP).

## Estrutura

```
lib/redirects/
├── types.ts                          # Interfaces (ISP)
├── AbstractRedirectHandler.ts        # Classe base abstrata
├── RedirectChain.ts                  # Builder da chain
├── index.ts                          # Facade para Next.js
└── handlers/
    ├── CategoryRedirectHandler.ts    # /category/* → /*
    ├── DateArchiveRedirectHandler.ts # /YYYY/MM/* → /*
    └── TrailingSlashHandler.ts       # Remove trailing slashes
```

## Migração WordPress → Next.js

### Contexto
- **Antigo:** `boa-prova.com` (WordPress)
- **Novo CMS:** `cms.boa-prova.com` (WordPress headless)
- **Novo Site:** `boa-prova.com` (Next.js - este projeto)

### Redirects Implementados

1. **Category URLs:**
   - `/category/concursos` → `/concursos`
   - `/category/direito-constitucional` → `/direito-constitucional`

2. **Date Archives:**
   - `/2024/01/exemplo-post` → `/exemplo-post`
   - `/2023/12/artigo-antigo` → `/artigo-antigo`

3. **Trailing Slashes:**
   - `/concursos/` → `/concursos`
   - `/sobre/` → `/sobre`

## Como Adicionar Novos Handlers

```typescript
import { AbstractRedirectHandler } from '../AbstractRedirectHandler'
import { RedirectResult } from '../types'

export class CustomRedirectHandler extends AbstractRedirectHandler {
  handle(source: string): RedirectResult | null {
    // Sua lógica aqui
    if (shouldRedirect(source)) {
      return {
        destination: '/nova-url',
        permanent: true
      }
    }
    
    return super.handle(source) // Passa para próximo handler
  }
}
```

Adicione ao `RedirectChain.ts`:
```typescript
const customHandler = new CustomRedirectHandler()
categoryHandler
  .setNext(customHandler)
  .setNext(dateArchiveHandler)
```

## Princípios SOLID Aplicados

- **SRP:** Cada handler tem uma responsabilidade única
- **OCP:** Novos handlers adicionados sem modificar existentes
- **LSP:** Todos handlers são substituíveis pela interface
- **ISP:** Interface mínima (setNext, handle)
- **DIP:** Dependemos de RedirectHandler abstrato, não de implementações concretas

## Testes

```bash
npm test redirects
```

35 testes cobrem:
- Cada handler individualmente
- Composição da chain
- Integração com Next.js

## Uso no Next.js

O `next.config.ts` usa automaticamente via:
```typescript
import { getRedirects } from './lib/redirects'

async redirects() {
  return getRedirects()
}
```
