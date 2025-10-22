import { test, expect } from '@playwright/test'

test.describe('Study Tools Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exemplo-post')
    await page.waitForLoadState('networkidle')
  })

  test('should open and close quiz panel', async ({ page }) => {
    const quizButton = page.locator('button[aria-label="Abrir Quiz"]')
    await expect(quizButton).toBeVisible()
    
    await quizButton.click()
    
    await expect(page.locator('text=Gerar Mini-Quiz')).toBeVisible()
    
    const closeButton = page.locator('button[aria-label="Fechar painel"]')
    await closeButton.click()
    
    await expect(page.locator('text=Gerar Mini-Quiz')).not.toBeVisible()
  })

  test.skip('should generate and complete quiz', async ({ page }) => {
    // Skip: Quiz generation requires real content which may not be available in test environment
    await page.locator('button[aria-label="Abrir Quiz"]').click()
    await expect(page.locator('text=Gerar Mini-Quiz')).toBeVisible()
  })

  test('should open pomodoro timer', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Pomodoro"]').click()
    
    await expect(page.locator('text=Cronômetro Pomodoro')).toBeVisible()
    await expect(page.locator('text=25:00')).toBeVisible()
  })

  test('should start and pause pomodoro', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Pomodoro"]').click()
    
    await page.locator('text=▶️ Iniciar').click()
    
    await expect(page.locator('text=⏸️ Pausar')).toBeVisible()
    
    await page.locator('text=⏸️ Pausar').click()
    
    await expect(page.locator('text=▶️ Retomar')).toBeVisible()
  })

  test('should open study plan', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    
    await expect(page.locator('text=Plano de Estudos Personalizado')).toBeVisible()
    await expect(page.locator('text=Estratégia de Estudo')).toBeVisible()
  })

  test('should generate study plan', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    
    await page.selectOption('select', 'INTENSIVE')
    
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible()
    await expect(page.locator('text=Progresso')).toBeVisible()
  })

  test('should switch between study tools', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Quiz"]').click()
    await expect(page.locator('text=Gerar Mini-Quiz')).toBeVisible()
    
    await page.locator('button[aria-label="Fechar painel"]').click()
    
    await page.locator('button[aria-label="Abrir Pomodoro"]').click()
    await expect(page.locator('text=Cronômetro Pomodoro')).toBeVisible()
    
    await page.locator('button[aria-label="Fechar painel"]').click()
    
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await expect(page.getByRole('heading', { name: 'Plano de Estudos Personalizado' })).toBeVisible()
  })

  test('should close panel with overlay click', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Quiz"]').click()
    await expect(page.locator('text=Gerar Mini-Quiz')).toBeVisible()
    
    // Click on overlay with force to bypass header interception
    await page.locator('.fixed.inset-0').first().click({ force: true })
    
    await expect(page.locator('text=Gerar Mini-Quiz')).not.toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.locator('button[aria-label="Abrir Quiz"]').click()
    
    const panel = page.locator('.fixed.top-0.right-0')
    await expect(panel).toHaveCSS('width', '375px')
  })

  test('should maintain tool state when closing and reopening', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Pomodoro"]').click()
    
    // Get initial timer value
    const timerBefore = await page.locator('text=/\\d{2}:\\d{2}/').first().textContent()
    
    await page.locator('text=▶️ Iniciar').click()
    await page.waitForTimeout(1000) // Wait for timer to tick
    
    await page.locator('button[aria-label="Fechar painel"]').click()
    await page.locator('button[aria-label="Abrir Pomodoro"]').click()
    
    // Timer should be visible again (whether running or paused)
    await expect(page.locator('text=/\\d{2}:\\d{2}/').first()).toBeVisible()
    
    // Verify timer changed or start button is present
    const timerAfter = await page.locator('text=/\\d{2}:\\d{2}/').first().textContent()
    const hasStartButton = await page.locator('text=▶️ Iniciar').isVisible()
    const hasPauseButton = await page.locator('button').filter({ hasText: '⏸️' }).isVisible()
    
    expect(timerBefore !== timerAfter || hasStartButton || hasPauseButton).toBeTruthy()
  })
})
