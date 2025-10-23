import { test, expect } from '@playwright/test'

test.describe('Study Plan Repository & Persistence', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/exemplo-post')
    await page.waitForLoadState('networkidle')
  })

  test('should persist study plan and reload it', async ({ page }) => {
    // Gerar plano
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.waitForTimeout(500)
    
    await page.selectOption('select', 'REGULAR')
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
    
    // Fechar painel
    await page.locator('button[aria-label="Fechar painel"]').click()
    
    // Recarregar página
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Abrir painel novamente - se persistiu, deve mostrar o plano
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.waitForTimeout(500)
    
    // Verificar se o plano ainda existe (não mostra botão de gerar novamente)
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 5000 })
  })

  test('should load existing plan on mount', async ({ page }) => {
    // Primeiro, gerar um plano
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.waitForTimeout(500)
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
    
    await page.locator('button[aria-label="Fechar painel"]').click()
    
    // Recarregar a página
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Abrir o painel - deve carregar o plano existente
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    
    await page.waitForTimeout(500)
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Progresso')).toBeVisible()
  })

  test('should complete session and persist progress', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
    
    const initialProgress = await page.locator('text=Progresso').locator('..').locator('span').last().textContent()
    
    const completeButton = page.locator('button:has-text("✓ Completar")').first()
    
    if (await completeButton.isVisible()) {
      await completeButton.click()
      
      await page.waitForTimeout(1000)
      
      const newProgress = await page.locator('text=Progresso').locator('..').locator('span').last().textContent()
      expect(newProgress).not.toBe(initialProgress)
      
      // Recarregar para verificar se o progresso persiste
      await page.reload()
      await page.waitForLoadState('networkidle')
      await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
      
      await expect(page.locator('.border-green-500').first()).toBeVisible()
    }
  })

  test('should delete plan and clear storage', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.waitForTimeout(500)
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
    
    page.on('dialog', dialog => dialog.accept())
    
    await page.locator('button:has-text("🗑️ Excluir")').click()
    
    await page.waitForTimeout(1000)
    
    await expect(page.locator('text=Plano de Estudos Personalizado')).toBeVisible()
    await expect(page.locator('text=📅 Gerar Plano de Estudos')).toBeVisible()
  })

  test('should save plan after generating with different strategies', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    
    await page.waitForTimeout(500)
    await page.selectOption('select', 'INTENSIVE')
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
    
    page.on('dialog', dialog => dialog.accept())
    await page.locator('button:has-text("🗑️ Excluir")').click()
    await page.waitForTimeout(500)
    
    await page.selectOption('select', 'LIGHT')
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
  })

  test('should restore from history (memento)', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.waitForTimeout(500)
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
    
    const completeButton = page.locator('button:has-text("✓ Completar")').first()
    if (await completeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await completeButton.click()
      await page.waitForTimeout(1000)
    }
    
    await page.locator('button:has-text("📜 Histórico")').click()
    
    await expect(page.locator('text=Histórico de Versões')).toBeVisible()
    
    const historyItems = await page.locator('button:has-text("sessões")').count()
    expect(historyItems).toBeGreaterThan(0)
  })

  test('should handle loading state', async ({ page }) => {
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.waitForTimeout(500)
    
    const loadingIndicator = page.locator('text=Carregando...')
    
    if (await loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(loadingIndicator).not.toBeVisible({ timeout: 3000 })
    }
    
    await page.waitForTimeout(500)
    await expect(page.locator('text=Plano de Estudos Personalizado')).toBeVisible()
  })

  test('should isolate plans by userId', async ({ page, context }) => {
    await page.evaluate(() => {
      localStorage.setItem('study-plan-user-1', JSON.stringify({
        id: 'plan-1',
        userId: 'user-1',
        topics: [],
        sessions: [],
        strategy: 'REGULAR',
        createdAt: new Date().toISOString()
      }))
    })
    
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.waitForTimeout(500)
    
    await page.locator('text=📅 Gerar Plano de Estudos').click()
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
    
    // Verificar que o plano do guest-user não afeta o user-1
    const user1Storage = await page.evaluate(() => {
      return localStorage.getItem('study-plan-user-1')
    })
    expect(user1Storage).not.toBeNull()
  })

  test('should handle corrupted storage gracefully', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('study-plan-guest-user', 'corrupted-json-data')
    })
    
    await page.locator('button[aria-label="Abrir Plano de Estudos"]').click()
    await page.waitForTimeout(500)
    
    await expect(page.locator('text=Plano de Estudos Personalizado')).toBeVisible()
    
    await page.locator('text=📅 Gerar Plano de Estudos').click({ force: true })
    
    await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible({ timeout: 10000 })
  })
})
