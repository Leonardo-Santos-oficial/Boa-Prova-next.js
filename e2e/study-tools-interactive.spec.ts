import { test, expect } from '@playwright/test'

test.describe('Ferramentas de Estudo Interativas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    const firstPostLink = page.locator('article a').first()
    if (await firstPostLink.isVisible()) {
      await firstPostLink.click()
      await page.waitForLoadState('networkidle')
    }
  })

  test.describe('Painel de Ferramentas', () => {
    test('deve exibir botões flutuantes das ferramentas', async ({ page }) => {
      const quizButton = page.locator('button[aria-label="Abrir Quiz"]')
      const pomodoroButton = page.locator('button[aria-label="Abrir Pomodoro"]')
      const studyPlanButton = page.locator('button[aria-label="Abrir Plano de Estudos"]')

      await expect(quizButton).toBeVisible()
      await expect(pomodoroButton).toBeVisible()
      await expect(studyPlanButton).toBeVisible()
    })

    test('deve abrir e fechar o painel lateral', async ({ page }) => {
      await page.click('button[aria-label="Abrir Quiz"]')
      
      await expect(page.locator('text=Ferramentas de Estudo')).toBeVisible()
      
      await page.click('button[aria-label="Fechar painel"]')
      
      await expect(page.locator('text=Ferramentas de Estudo')).not.toBeVisible()
    })

    test('deve fechar painel ao clicar no overlay', async ({ page }) => {
      await page.click('button[aria-label="Abrir Quiz"]')
      await expect(page.locator('text=Ferramentas de Estudo')).toBeVisible()
      
      await page.locator('.fixed.inset-0.bg-black\\/50').click({ position: { x: 10, y: 10 } })
      
      await expect(page.locator('text=Ferramentas de Estudo')).not.toBeVisible()
    })
  })

  test.describe('Mini-Quiz com IA', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button[aria-label="Abrir Quiz"]')
      await expect(page.locator('text=Gerar Mini-Quiz')).toBeVisible()
    })

    test('deve gerar quiz a partir do conteúdo', async ({ page }) => {
      await page.click('text=🎯 Gerar Quiz')
      
      await expect(page.locator('text=Gerando...')).toBeVisible()
      
      await expect(page.locator('text=Quiz Pronto!')).toBeVisible({ timeout: 10000 })
      await expect(page.locator('text=questões geradas')).toBeVisible()
    })

    test('deve permitir cancelar geração do quiz', async ({ page }) => {
      await page.click('text=Cancelar')
      
      await expect(page.locator('text=Gerar Mini-Quiz')).not.toBeVisible()
    })

    test('deve iniciar o quiz e exibir primeira questão', async ({ page }) => {
      await page.click('text=🎯 Gerar Quiz')
      await expect(page.locator('text=Quiz Pronto!')).toBeVisible({ timeout: 10000 })
      
      await page.click('text=🚀 Começar Quiz')
      
      await expect(page.locator('text=Questão 1 de')).toBeVisible()
    })

    test('deve permitir responder questões', async ({ page }) => {
      await page.click('text=🎯 Gerar Quiz')
      await expect(page.locator('text=Quiz Pronto!')).toBeVisible({ timeout: 10000 })
      await page.click('text=🚀 Começar Quiz')
      
      const firstOption = page.locator('button.w-full.p-4.text-left.rounded-lg.border-2').first()
      await firstOption.click()
      
      await page.waitForTimeout(1000)
      
      const questionText = await page.locator('text=Questão').textContent()
      expect(questionText).toBeTruthy()
    })

    test('deve exibir resultado ao completar quiz', async ({ page }) => {
      await page.click('text=🎯 Gerar Quiz')
      await expect(page.locator('text=Quiz Pronto!')).toBeVisible({ timeout: 10000 })
      await page.click('text=🚀 Começar Quiz')
      
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500)
        const option = page.locator('button.w-full.p-4.text-left.rounded-lg.border-2').first()
        if (await option.isVisible()) {
          await option.click()
          await page.waitForTimeout(1000)
        }
      }
      
      await expect(page.locator('text=Quiz Concluído!')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=%')).toBeVisible()
    })

    test('deve permitir revisar respostas', async ({ page }) => {
      await page.click('text=🎯 Gerar Quiz')
      await expect(page.locator('text=Quiz Pronto!')).toBeVisible({ timeout: 10000 })
      await page.click('text=🚀 Começar Quiz')
      
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500)
        const option = page.locator('button.w-full.p-4.text-left.rounded-lg.border-2').first()
        if (await option.isVisible()) {
          await option.click()
          await page.waitForTimeout(1000)
        }
      }
      
      await expect(page.locator('text=Quiz Concluído!')).toBeVisible({ timeout: 5000 })
      
      await page.click('text=📝 Ver Respostas')
      
      await expect(page.locator('text=Modo Revisão')).toBeVisible()
      await expect(page.locator('text=Questão 1 de')).toBeVisible()
    })
  })

  test.describe('Cronômetro Pomodoro', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button[aria-label="Abrir Pomodoro"]')
      await expect(page.locator('text=Cronômetro Pomodoro')).toBeVisible()
    })

    test('deve exibir configurações iniciais do Pomodoro', async ({ page }) => {
      await expect(page.locator('text=⏰ Foco')).toBeVisible()
      await expect(page.locator('text=25:00')).toBeVisible()
      await expect(page.locator('text=🍅 Sessões completadas: 0')).toBeVisible()
    })

    test('deve iniciar o cronômetro', async ({ page }) => {
      await page.click('text=▶️ Iniciar')
      
      await expect(page.locator('text=⏸️ Pausar')).toBeVisible()
      
      await page.waitForTimeout(2000)
      const timeText = await page.locator('text=/\\d{2}:\\d{2}/').first().textContent()
      expect(timeText).not.toBe('25:00')
    })

    test('deve pausar o cronômetro', async ({ page }) => {
      await page.click('text=▶️ Iniciar')
      await page.waitForTimeout(1000)
      
      await page.click('text=⏸️ Pausar')
      
      await expect(page.locator('text=▶️ Retomar')).toBeVisible()
    })

    test('deve retomar o cronômetro pausado', async ({ page }) => {
      await page.click('text=▶️ Iniciar')
      await page.waitForTimeout(1000)
      await page.click('text=⏸️ Pausar')
      
      await page.click('text=▶️ Retomar')
      
      await expect(page.locator('text=⏸️ Pausar')).toBeVisible()
    })

    test('deve reiniciar o cronômetro', async ({ page }) => {
      await page.click('text=▶️ Iniciar')
      await page.waitForTimeout(2000)
      
      await page.click('text=🔄 Reiniciar')
      
      await expect(page.locator('text=▶️ Iniciar')).toBeVisible()
      await expect(page.locator('text=25:00')).toBeVisible()
    })

    test('deve permitir pular fase', async ({ page }) => {
      await page.click('text=▶️ Iniciar')
      await page.waitForTimeout(1000)
      
      await page.click('text=⏭️ Pular')
      
      await page.waitForTimeout(500)
      const phaseText = await page.locator('text=/⏰|☕|🌟/').first().textContent()
      expect(phaseText).toBeTruthy()
    })

    test('deve mostrar informações sobre os intervalos', async ({ page }) => {
      await expect(page.locator('text=⏰ Foco: 25min')).toBeVisible()
      await expect(page.locator('text=☕ Intervalo: 5min')).toBeVisible()
      await expect(page.locator('text=🌟 Intervalo Longo: 15min')).toBeVisible()
    })
  })

  test.describe('Plano de Estudos Personalizado', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button[aria-label="Abrir Plano de Estudos"]')
      await expect(page.locator('text=Plano de Estudos Personalizado')).toBeVisible()
    })

    test('deve exibir opções de estratégia', async ({ page }) => {
      const strategySelect = page.locator('select')
      await expect(strategySelect).toBeVisible()
      
      const options = await strategySelect.locator('option').allTextContents()
      expect(options).toContain('Leve (2h/dia)')
      expect(options).toContain('Regular (4h/dia)')
      expect(options).toContain('Intensivo (8h/dia)')
    })

    test('deve exibir tópicos padrão', async ({ page }) => {
      await expect(page.locator('text=Introdução ao Tema')).toBeVisible()
      await expect(page.locator('text=Conceitos Intermediários')).toBeVisible()
      await expect(page.locator('text=Prática e Exercícios')).toBeVisible()
    })

    test('deve gerar plano de estudos', async ({ page }) => {
      await page.click('text=📅 Gerar Plano de Estudos')
      
      await expect(page.locator('text=Meu Plano de Estudos')).toBeVisible()
      await expect(page.locator('text=Progresso')).toBeVisible()
    })

    test('deve exibir progresso do plano', async ({ page }) => {
      await page.click('text=📅 Gerar Plano de Estudos')
      
      await expect(page.locator('text=0%')).toBeVisible()
      await expect(page.locator('text=Sessões')).toBeVisible()
      await expect(page.locator('text=Horas')).toBeVisible()
    })

    test('deve permitir completar sessão', async ({ page }) => {
      await page.click('text=📅 Gerar Plano de Estudos')
      
      const completeButton = page.locator('text=✓ Concluir').first()
      if (await completeButton.isVisible()) {
        await completeButton.click()
        
        await expect(page.locator('text=✅')).toBeVisible()
      }
    })

    test('deve permitir alternar estratégias', async ({ page }) => {
      await page.selectOption('select', 'INTENSIVE')
      
      const selected = await page.locator('select').inputValue()
      expect(selected).toBe('INTENSIVE')
    })

    test('deve mostrar histórico de versões', async ({ page }) => {
      await page.click('text=📅 Gerar Plano de Estudos')
      
      await page.click('text=📜 Histórico')
      
      await expect(page.locator('text=Histórico de Versões:')).toBeVisible()
    })

    test('deve permitir criar novo plano', async ({ page }) => {
      await page.click('text=📅 Gerar Plano de Estudos')
      
      await page.click('text=🔄 Novo Plano')
      
      await expect(page.locator('text=Plano de Estudos Personalizado')).toBeVisible()
      await expect(page.locator('text=📅 Gerar Plano de Estudos')).toBeVisible()
    })
  })

  test.describe('Integração e Responsividade', () => {
    test('deve funcionar em dispositivos móveis', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const quizButton = page.locator('button[aria-label="Abrir Quiz"]')
      await expect(quizButton).toBeVisible()
      
      await quizButton.click()
      
      const panel = page.locator('text=Ferramentas de Estudo')
      await expect(panel).toBeVisible()
      
      const panelWidth = await panel.boundingBox()
      expect(panelWidth?.width).toBeGreaterThan(300)
    })

    test('deve manter estado ao alternar entre ferramentas', async ({ page }) => {
      await page.click('button[aria-label="Abrir Pomodoro"]')
      await page.click('text=▶️ Iniciar')
      await page.waitForTimeout(2000)
      
      await page.click('button[aria-label="Fechar painel"]')
      
      await page.click('button[aria-label="Abrir Pomodoro"]')
      
      const timeText = await page.locator('text=/\\d{2}:\\d{2}/').first().textContent()
      expect(timeText).not.toBe('25:00')
    })

    test('deve ser acessível via teclado', async ({ page }) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
      expect(focusedElement).toBeTruthy()
    })
  })

  test.describe('Modo Foco', () => {
    test('deve ativar modo foco', async ({ page }) => {
      const focusButton = page.locator('text=🎯 Modo Foco')
      
      if (await focusButton.isVisible()) {
        await focusButton.click()
        
        await expect(page.locator('text=👁️ Sair do Modo Foco')).toBeVisible()
      }
    })

    test('deve desativar modo foco', async ({ page }) => {
      const focusButton = page.locator('text=🎯 Modo Foco')
      
      if (await focusButton.isVisible()) {
        await focusButton.click()
        await page.waitForTimeout(500)
        
        await page.click('text=👁️ Sair do Modo Foco')
        
        await expect(page.locator('text=🎯 Modo Foco')).toBeVisible()
      }
    })
  })
})
