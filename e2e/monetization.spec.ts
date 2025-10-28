import { test, expect } from '@playwright/test'

test.describe('Monetization - Ad Display', () => {
  test('should display ads on article page without CLS issues', async ({ page }) => {
    await page.goto('/artigos/teste-monetizacao')

    const clsPromise = page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsScore = 0
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              const layoutShiftEntry = entry as PerformanceEntry & { 
                hadRecentInput?: boolean
                value?: number 
              }
              if (!layoutShiftEntry.hadRecentInput) {
                clsScore += layoutShiftEntry.value || 0
              }
            }
          }
        })
        
        observer.observe({ entryTypes: ['layout-shift'] })
        
        setTimeout(() => {
          observer.disconnect()
          resolve(clsScore)
        }, 5000)
      })
    })

    await page.waitForTimeout(5000)
    const clsScore = await clsPromise

    expect(clsScore).toBeLessThan(0.1)
  })

  test('should lazy load sidebar ads only when visible', async ({ page }) => {
    await page.goto('/artigos/teste-monetizacao')

    const sidebarAd = page.locator('[data-ad-id="sidebar-top-001"]')
    await expect(sidebarAd).toBeVisible()

    const hasPlaceholder = await sidebarAd.locator('.ad-placeholder').isVisible()
    expect(hasPlaceholder).toBe(true)

    await page.evaluate(() => {
      document.querySelector('[data-ad-id="sidebar-top-001"]')?.scrollIntoView()
    })

    await page.waitForTimeout(1000)
  })

  test('should not display desktop ads on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/artigos/teste-monetizacao')

    const desktopBanner = page.locator('[data-ad-id="header-banner-001"]')
    await expect(desktopBanner).not.toBeVisible()

    const mobileBanner = page.locator('[data-ad-id="mobile-banner-001"]')
    await expect(mobileBanner).toBeVisible()
  })

  test('should maintain Core Web Vitals with ads', async ({ page }) => {
    await page.goto('/artigos/teste-monetizacao')

    const metrics = await page.evaluate(() => {
      return new Promise<{ lcp: number; fid: number; cls: number }>((resolve) => {
        let lcp = 0
        let fid = 0
        let cls = 0

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              lcp = entry.startTime
            }
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'first-input') {
              const firstInputEntry = entry as PerformanceEntry & { 
                processingStart?: number 
              }
              fid = (firstInputEntry.processingStart || 0) - entry.startTime
            }
          }
        }).observe({ entryTypes: ['first-input'] })

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              const layoutShiftEntry = entry as PerformanceEntry & { 
                hadRecentInput?: boolean
                value?: number 
              }
              if (!layoutShiftEntry.hadRecentInput) {
                cls += layoutShiftEntry.value || 0
              }
            }
          }
        }).observe({ entryTypes: ['layout-shift'] })

        setTimeout(() => resolve({ lcp, fid, cls }), 5000)
      })
    })

    expect(metrics.lcp).toBeLessThan(2500)
    expect(metrics.cls).toBeLessThan(0.1)
  })
})

test.describe('Media Kit Page', () => {
  test('should display media kit page correctly', async ({ page }) => {
    await page.goto('/media-kit')

    await expect(page.locator('h1')).toContainText('Anuncie no Boa Prova')

    const statsCards = page.locator('[class*="grid"] > div')
    await expect(statsCards).toHaveCount(4)

    await expect(page.locator('text=Pageviews/Mês')).toBeVisible()
    await expect(page.locator('text=Usuários/Mês')).toBeVisible()
  })

  test('should show audience statistics', async ({ page }) => {
    await page.goto('/media-kit')

    await expect(page.locator('text=Nossa Audiência')).toBeVisible()
    await expect(page.locator('text=Concursos Públicos')).toBeVisible()
    await expect(page.locator('text=Direito')).toBeVisible()
  })

  test('should display ad format options', async ({ page }) => {
    await page.goto('/media-kit')

    await expect(page.locator('text=Formatos de Anúncios Disponíveis')).toBeVisible()
    await expect(page.locator('text=Banner Superior')).toBeVisible()
    await expect(page.locator('text=Sidebar')).toBeVisible()
    await expect(page.locator('text=In-Content')).toBeVisible()
  })

  test('should show performance metrics', async ({ page }) => {
    await page.goto('/media-kit')

    await expect(page.locator('text=Performance Técnica')).toBeVisible()
    await expect(page.locator('text=PageSpeed Score')).toBeVisible()
    await expect(page.locator('text=95+')).toBeVisible()
  })

  test('should have contact buttons', async ({ page }) => {
    await page.goto('/media-kit')

    const emailButton = page.locator('button:has-text("Enviar E-mail")')
    const whatsappButton = page.locator('button:has-text("WhatsApp")')

    await expect(emailButton).toBeVisible()
    await expect(whatsappButton).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/media-kit')

    await expect(page.locator('h1')).toBeVisible()
    
    const statsCards = page.locator('[class*="grid"] > div')
    await expect(statsCards.first()).toBeVisible()
  })
})
