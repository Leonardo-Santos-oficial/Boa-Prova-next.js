# Testing Guide

## 📋 Overview

Este projeto utiliza uma suite completa de testes:

- **Jest**: Testes unitários e de integração
- **React Testing Library**: Testes de componentes
- **Playwright**: Testes E2E
- **GitHub Actions**: CI/CD automatizado

## 🧪 Tipos de Testes

### Unitários

Testam funções, classes e componentes isoladamente.

**Localização**: `__tests__/`

**Executar**:
```bash
npm test                 # Todos os testes
npm test -- Button       # Testes específicos
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura
```

**Exemplo**:
```typescript
describe('MediaKitService', () => {
  it('should return valid stats', () => {
    const stats = MediaKitService.getStats()
    expect(stats.monthlyPageviews).toBeGreaterThan(0)
  })
})
```

### E2E (End-to-End)

Testam jornadas completas do usuário.

**Localização**: `e2e/`

**Executar**:
```bash
npm run test:e2e          # Headless
npm run test:e2e:ui       # UI mode
npm run test:e2e:debug    # Debug mode
```

**Exemplo**:
```typescript
test('should submit contact form', async ({ page }) => {
  await page.goto('/media-kit')
  await page.getByLabel(/nome/i).fill('João Silva')
  await page.getByRole('button', { name: /enviar/i }).click()
  await expect(page.getByText(/sucesso/i)).toBeVisible()
})
```

## 🛠️ Helpers & Fixtures

### Builders (Pattern: Builder)

Constroem objetos complexos de teste:

```typescript
import { MediaKitFixtureBuilder } from '@/__tests__/helpers'

const stats = new MediaKitFixtureBuilder()
  .withPageviews(1000000)
  .withUsers(300000)
  .withCategory('Test', 50)
  .build()
```

### Fixtures

Dados mockados prontos:

```typescript
import { mockMediaKitStats } from '@/__tests__/fixtures'

const stats = mockMediaKitStats
```

### Storage Mocks

Mock de localStorage/sessionStorage:

```typescript
import { mockLocalStorage } from '@/__tests__/helpers'

const storage = mockLocalStorage()
storage.setItem('key', 'value')
expect(storage.getItem('key')).toBe('value')
```

### IntersectionObserver Mock

Mock para testes de lazy loading:

```typescript
import { 
  createMockIntersectionObserver,
  createIntersectionObserverEntry 
} from '@/__tests__/helpers'

const observer = createMockIntersectionObserver()
const entry = createIntersectionObserverEntry(true, 1)
```

## 📁 Estrutura

```
__tests__/
  components/
    core/
      Button.test.tsx
      Card.test.tsx
    media-kit/
      ContactForm.test.tsx
  lib/
    media-kit/
      validation-strategy.test.ts
  helpers/
    test-builders.ts        # Builder Pattern
    storage-mock.ts         # Storage mocks
    async-utils.ts          # Async helpers
  fixtures/
    media-kit-fixtures.ts   # Mock data

e2e/
  media-kit.spec.ts
  navigation.spec.ts
  pages/
    HomePage.ts            # Page Object Pattern
    NavigationPage.ts
```

## 🎯 Padrões Aplicados

### Builder Pattern

Para construir objetos de teste complexos:

```typescript
export class ContactFormDataBuilder {
  private data: ContactFormData = { ... }

  withName(name: string): this {
    this.data.name = name
    return this
  }

  build(): ContactFormData {
    return { ...this.data }
  }
}
```

**Benefícios**:
- ✅ SRP: Cada builder tem uma responsabilidade
- ✅ DRY: Reutilização de lógica de construção
- ✅ Fluent API: Método chaining legível

### Page Object Pattern (E2E)

Encapsula interações com páginas:

```typescript
export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/')
  }

  async clickArticle(title: string) {
    await this.page.getByRole('link', { name: title }).click()
  }
}
```

**Benefícios**:
- ✅ SRP: Cada Page Object representa uma página
- ✅ DRY: Reutilização de interações
- ✅ Manutenção: Mudanças na UI afetam apenas Page Objects

## 📊 Cobertura de Código

**Meta**: 80% de cobertura mínima

**Verificar cobertura**:
```bash
npm run test:coverage
```

**Relatório HTML**: `coverage/lcov-report/index.html`

## 🔧 Configuração

### Jest (`jest.config.ts`)

```typescript
const config: Config = {
  preset: 'next',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts'
  ]
}
```

### Playwright (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' }
  ]
})
```

## 🚀 CI/CD

GitHub Actions executa automaticamente:

1. **Lint**: Verifica código
2. **Unit Tests**: Testes unitários + cobertura
3. **Build**: Verifica build de produção
4. **E2E Tests**: Testes end-to-end

**Ver resultados**: GitHub Actions tab

## ✅ Boas Práticas

### Clean Code

- ✅ **Nomes significativos**: `shouldSubmitFormWithValidData`
- ✅ **Arrange-Act-Assert**: Estrutura clara
- ✅ **One assertion per test**: Foco em um comportamento
- ✅ **DRY**: Helpers e fixtures reutilizáveis

### SOLID

- ✅ **SRP**: Cada teste valida uma única coisa
- ✅ **OCP**: Builders extensíveis sem modificar
- ✅ **DIP**: Testes dependem de abstrações (interfaces)

### Exemplo Completo

```typescript
/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ContactForm } from '@/components/media-kit/ContactForm'
import { ContactFormDataBuilder } from '@/__tests__/helpers'

describe('ContactForm', () => {
  it('should submit with valid data', async () => {
    // Arrange
    const validData = new ContactFormDataBuilder().buildValid()
    render(<ContactForm />)

    // Act
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: validData.name }
    })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    // Assert
    await screen.findByText(/sucesso/i)
  })
})
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Atualizado**: 2025-10-28  
**Cobertura Atual**: 282 testes passando
