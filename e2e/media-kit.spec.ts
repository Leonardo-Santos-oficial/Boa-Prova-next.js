import { test, expect } from '@playwright/test'

test.describe('Media Kit Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/media-kit')
  })

  test('should display page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /anuncie no boa prova/i })).toBeVisible()
    await expect(page.getByText(/alcance milhares de estudantes/i)).toBeVisible()
  })

  test('should display statistics section', async ({ page }) => {
    await expect(page.getByText(/estatísticas do site/i)).toBeVisible()
    await expect(page.getByText(/pageviews\/mês/i)).toBeVisible()
    await expect(page.getByText(/usuários\/mês/i)).toBeVisible()
  })

  test('should display audience section with categories', async ({ page }) => {
    await expect(page.getByText(/nossa audiência/i)).toBeVisible()
    // "concursos públicos" is in the paragraph text, not a heading
    await expect(page.getByText(/concursos públicos/i).first()).toBeVisible()
  })

  test('should display ad formats section', async ({ page }) => {
    await expect(page.getByText(/formatos de anúncios disponíveis/i)).toBeVisible()
    // Use heading role to be more specific
    await expect(page.getByRole('heading', { name: /banner superior/i })).toBeVisible()
    await expect(page.getByText(/sidebar/i).first()).toBeVisible()
  })

  test('should display performance metrics', async ({ page }) => {
    await expect(page.getByText(/performance técnica/i)).toBeVisible()
    await expect(page.getByText(/pagespeed score/i)).toBeVisible()
  })

  test('should display contact form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /entre em contato/i })).toBeVisible()
    await expect(page.getByLabel(/nome completo/i)).toBeVisible()
    await expect(page.getByLabel(/email corporativo/i)).toBeVisible()
  })

  test('should validate contact form', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /enviar mensagem/i })
    await submitButton.click()

    await expect(page.getByText(/campo nome é obrigatório/i)).toBeVisible()
  })

  test('should allow form submission with valid data', async ({ page }) => {
    await page.getByLabel(/nome completo/i).fill('João Silva')
    await page.getByLabel(/email corporativo/i).fill('joao@empresa.com')
    await page.getByLabel(/empresa/i).fill('Empresa LTDA')
    await page.getByLabel(/tipo de anúncio/i).selectOption('banner-superior')
    await page.getByLabel(/mensagem/i).fill('Gostaria de anunciar no site com banners.')

    await page.getByRole('button', { name: /enviar mensagem/i }).click()

    await expect(page.getByText(/mensagem enviada com sucesso/i)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await expect(page.getByRole('heading', { name: /anuncie no boa prova/i })).toBeVisible()
    await expect(page.getByText(/estatísticas do site/i)).toBeVisible()
  })
})
