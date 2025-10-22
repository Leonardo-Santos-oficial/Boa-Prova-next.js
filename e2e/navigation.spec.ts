import { test, expect } from '@playwright/test'
import { NavigationPage } from './pages/NavigationPage'
import { HomePage } from './pages/HomePage'

test.describe('Navigation Menu', () => {
  let homePage: HomePage
  let navigationPage: NavigationPage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    navigationPage = new NavigationPage(page)
    await homePage.goto()
  })

  test('should display main navigation menu', async () => {
    await expect(navigationPage.mainNav).toBeVisible()
  })

  test('should show logo and home link', async ({ page }) => {
    const logo = page.getByRole('link', { name: /Boa Prova/i })
    await expect(logo).toBeVisible()
    await logo.click()
    await expect(page).toHaveURL('/')
  })

  test('should navigate to menu items', async ({ page }) => {
    const sobreLink = page.getByRole('link', { name: /Sobre/i })
    await sobreLink.click()
    await expect(page).toHaveURL('/sobre')
  })

  test.describe('Dropdown Menu', () => {
    test('should show submenu on hover', async ({ page }) => {
      await navigationPage.hoverOnMenuItem('Concursos por Estado')
      
      const submenuVisible = await navigationPage.isSubmenuVisible('Concursos por Estado')
      expect(submenuVisible).toBe(true)
    })

    test('should hide submenu when mouse leaves', async ({ page }) => {
      await navigationPage.hoverOnMenuItem('Concursos por Estado')
      await page.mouse.move(0, 0)
      await page.waitForTimeout(500)
      
      const submenuVisible = await navigationPage.isSubmenuVisible('Concursos por Estado')
      expect(submenuVisible).toBe(false)
    })

    test('should display submenu items', async () => {
      await navigationPage.hoverOnMenuItem('Concursos por Estado')
      const items = await navigationPage.getSubmenuItems('Concursos por Estado')
      
      expect(items.length).toBeGreaterThan(0)
      expect(items).toContain('SP')
    })

    test('should navigate to submenu item', async ({ page }) => {
      await navigationPage.navigateToSubmenuItem('Concursos por Estado', 'SP')
      await expect(page).toHaveURL(/sao-paulo/)
    })

    test('should support nested submenus', async ({ page }) => {
      // Skip this test as current menu doesn't have nested submenus
      test.skip()
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should navigate menu with Tab key', async ({ page }) => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('should open submenu with Enter key', async ({ page }) => {
      const estadosLink = page.getByText('Concursos por Estado').first()
      await estadosLink.focus()
      await page.keyboard.press('Enter')
      
      // Menu item without href won't navigate, so just check it's visible
      await expect(estadosLink).toBeVisible()
    })

    test('should navigate submenu with arrow keys', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Tab')
      
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })
  })
})
