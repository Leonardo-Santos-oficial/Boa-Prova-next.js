import { Page, Locator } from '@playwright/test'

export class NavigationPage {
  readonly page: Page
  readonly mainNav: Locator
  readonly mobileNavToggle: Locator
  readonly mobileNav: Locator

  constructor(page: Page) {
    this.page = page
    this.mainNav = page.locator('.main-nav')
    this.mobileNavToggle = page.locator('.mobile-nav-toggle')
    this.mobileNav = page.locator('.mobile-nav')
  }

  async hoverOnMenuItem(label: string): Promise<void> {
    const item = this.page.getByRole('link', { name: label }).first()
    await item.hover()
  }

  async clickMenuItem(label: string): Promise<void> {
    const item = this.page.getByRole('link', { name: label }).first()
    await item.click()
  }

  async isSubmenuVisible(parentLabel: string): Promise<boolean> {
    const parent = this.mainNav.locator(`text=${parentLabel}`).first()
    const submenu = parent.locator('..').locator('.nav-submenu')
    return await submenu.isVisible()
  }

  async getSubmenuItems(parentLabel: string): Promise<string[]> {
    const parent = this.mainNav.locator(`text=${parentLabel}`).first()
    const submenu = parent.locator('..').locator('.nav-submenu')
    const items = submenu.locator('.nav-link')
    return await items.allTextContents()
  }

  async openMobileMenu(): Promise<void> {
    await this.mobileNavToggle.click()
  }

  async isMobileMenuVisible(): Promise<boolean> {
    return await this.mobileNav.isVisible()
  }

  async navigateToSubmenuItem(parentLabel: string, childLabel: string): Promise<void> {
    await this.hoverOnMenuItem(parentLabel)
    await this.page.waitForTimeout(300)
    const childLink = this.page.getByRole('link', { name: childLabel })
    await childLink.click()
  }
}
