import { test, expect, devices } from '@playwright/test'
import { NavigationPage } from './pages/NavigationPage'
import { HomePage } from './pages/HomePage'

test.use({ ...devices['iPhone 12'] })

test.describe('Mobile Navigation', () => {
  let homePage: HomePage
  let navigationPage: NavigationPage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    navigationPage = new NavigationPage(page)
    await homePage.goto()
  })

  test('should hide desktop navigation on mobile', async () => {
    await expect(navigationPage.mainNav).not.toBeVisible()
  })

  test('should show mobile menu toggle button', async () => {
    await expect(navigationPage.mobileNavToggle).toBeVisible()
  })

  test('should open mobile menu on toggle click', async () => {
    await navigationPage.openMobileMenu()
    const isVisible = await navigationPage.isMobileMenuVisible()
    expect(isVisible).toBe(true)
  })

  test('should close mobile menu on second toggle click', async () => {
    await navigationPage.openMobileMenu()
    await navigationPage.openMobileMenu()
    const isVisible = await navigationPage.isMobileMenuVisible()
    expect(isVisible).toBe(false)
  })

  test('should display menu items in mobile menu', async ({ page }) => {
    await navigationPage.openMobileMenu()
    
    const homeLink = page.getByRole('link', { name: /Início/i })
    const sobreLink = page.getByRole('link', { name: /Sobre/i })
    
    await expect(homeLink).toBeVisible()
    await expect(sobreLink).toBeVisible()
  })

  test('should navigate from mobile menu', async ({ page }) => {
    await navigationPage.openMobileMenu()
    const sobreLink = page.getByRole('link', { name: /Sobre/i })
    await sobreLink.click()
    await expect(page).toHaveURL('/sobre')
  })

  test('should support touch gestures', async ({ page }) => {
    await navigationPage.mobileNavToggle.tap()
    const isVisible = await navigationPage.isMobileMenuVisible()
    expect(isVisible).toBe(true)
  })

  test('should expand nested items on mobile', async ({ page }) => {
    await navigationPage.openMobileMenu()
    
    const direitoItem = page.getByRole('link', { name: /Direito/i }).first()
    await direitoItem.tap()
    
    await page.waitForTimeout(300)
    const submenu = page.locator('.mobile-nav .nav-submenu')
    const isVisible = await submenu.isVisible().catch(() => false)
    
    expect(isVisible).toBe(true)
  })
})

test.describe('Responsive Behavior', () => {
  test('should adapt layout for tablet', async ({ page, browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro'],
    })
    const tabletPage = await context.newPage()
    const homePage = new HomePage(tabletPage)
    await homePage.goto()

    const title = await homePage.getTitle()
    expect(title).toContain('Boa Prova')

    await context.close()
  })

  test('should maintain functionality across viewports', async ({ page }) => {
    await page.goto('/')
    
    await page.setViewportSize({ width: 375, height: 667 })
    let navPage = new NavigationPage(page)
    await expect(navPage.mobileNavToggle).toBeVisible()

    await page.setViewportSize({ width: 1920, height: 1080 })
    navPage = new NavigationPage(page)
    await expect(navPage.mainNav).toBeVisible()
  })
})
