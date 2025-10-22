import { test, expect } from '@playwright/test'

test.describe('Study Tools Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mock-post')
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

  test('should generate and complete quiz', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Quiz"]').click()
    
    await page.locator('text=🎯 Gerar Quiz').click()
    
    await page.waitForSelector('text=Quiz Pronto!', { timeout: 10000 })
    
    await page.locator('text=🚀 Começar Quiz').click()
    
    await expect(page.locator('text=Questão 1')).toBeVisible()
    
    const firstOption = page.locator('button').filter({ hasText: /^(?!.*Questão)/ }).first()
    await firstOption.click()
    
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Quiz Concluído!')).toBeVisible({ timeout: 15000 })
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
    await expect(page.locator('text=Plano de Estudos')).toBeVisible()
  })

  test('should close panel with overlay click', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Quiz"]').click()
    await expect(page.locator('text=Gerar Mini-Quiz')).toBeVisible()
    
    await page.locator('.fixed.inset-0.bg-black\\/50').click({ position: { x: 10, y: 10 } })
    
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
    await page.locator('text=▶️ Iniciar').click()
    
    await page.locator('button[aria-label="Fechar painel"]').click()
    
    await page.locator('button[aria-label="Abrir Pomodoro"]').click()
    
    await expect(page.locator('text=⏸️ Pausar')).toBeVisible()
  })
})
