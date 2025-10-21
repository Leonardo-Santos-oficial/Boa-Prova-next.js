import { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly heading: Locator
  readonly heroSection: Locator
  readonly themeToggle: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.locator('h1')
    this.heroSection = page.locator('.hero-section')
    this.themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="tema" i]')
  }

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click()
  }

  async getCurrentTheme(): Promise<'light' | 'dark'> {
    const html = this.page.locator('html')
    const classList = await html.getAttribute('class')
    return classList?.includes('dark') ? 'dark' : 'light'
  }
}
