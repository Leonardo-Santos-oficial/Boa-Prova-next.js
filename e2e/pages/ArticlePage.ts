import { Page, Locator } from '@playwright/test'

export class ArticlePage {
  readonly page: Page
  readonly articleTitle: Locator
  readonly articleContent: Locator
  readonly breadcrumbs: Locator
  readonly shareButtons: Locator

  constructor(page: Page) {
    this.page = page
    this.articleTitle = page.locator('article h1, .article-title')
    this.articleContent = page.locator('article .prose, .article-content')
    this.breadcrumbs = page.locator('[aria-label="breadcrumb"], .breadcrumbs')
    this.shareButtons = page.locator('.share-buttons, [aria-label*="share" i]')
  }

  async goto(slug: string): Promise<void> {
    await this.page.goto(`/${slug}`)
  }

  async getArticleTitle(): Promise<string> {
    return await this.articleTitle.textContent() || ''
  }

  async isContentVisible(): Promise<boolean> {
    return await this.articleContent.isVisible()
  }

  async getBreadcrumbPath(): Promise<string[]> {
    const breadcrumbLinks = this.breadcrumbs.locator('a')
    return await breadcrumbLinks.allTextContents()
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  }

  async getReadingTime(): Promise<number> {
    const content = await this.articleContent.textContent()
    const wordCount = content?.split(/\s+/).length || 0
    return Math.ceil(wordCount / 200)
  }
}
