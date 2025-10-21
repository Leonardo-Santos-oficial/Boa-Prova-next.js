import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BaseArticle } from '@/components/article/BaseArticle'
import { ArticleComponent } from '@/components/article/types'
import { BreadcrumbsDecorator } from '@/components/article/decorators/BreadcrumbsDecorator'
import { TableOfContentsDecorator } from '@/components/article/decorators/TableOfContentsDecorator'
import { RelatedPostsDecorator } from '@/components/article/decorators/RelatedPostsDecorator'
import { ContentNode } from '@/types/wordpress'

// Mock child components
jest.mock('@/components/article/ArticleHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="article-header">Article Header</div>
}))

jest.mock('@/components/article/ArticleContent', () => ({
  __esModule: true,
  default: () => <div data-testid="article-content">Article Content</div>
}))

jest.mock('@/components/article/ArticleFooter', () => ({
  __esModule: true,
  default: () => <div data-testid="article-footer">Article Footer</div>
}))

jest.mock('@/components/core/Card', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>
}))

const mockContentNode: ContentNode = {
  id: '1',
  title: 'Test Article',
  content: '<h2>Section 1</h2><p>Content 1</p><h3>Subsection 1.1</h3><p>Content 1.1</p>',
  uri: '/test-article',
  date: '2024-01-01',
  modified: '2024-01-01',
  __typename: 'Post',
  seo: {
    title: 'Test Article',
    metaDesc: 'Test description',
    canonical: 'https://example.com/test-article',
    opengraphTitle: undefined,
    opengraphDescription: undefined,
    opengraphImage: undefined,
    schema: undefined
  }
}

describe('Article Decorator Pattern', () => {
  describe('BaseArticle', () => {
    it('should render basic article structure', () => {
      const article = new BaseArticle(mockContentNode)
      render(article.render())

      expect(screen.getByTestId('card')).toBeInTheDocument()
      expect(screen.getByTestId('article-header')).toBeInTheDocument()
      expect(screen.getByTestId('article-content')).toBeInTheDocument()
      expect(screen.getByTestId('article-footer')).toBeInTheDocument()
    })

    it('should return content node via getContent()', () => {
      const article = new BaseArticle(mockContentNode)
      expect(article.getContent()).toBe(mockContentNode)
    })

    it('should apply prose classes for typography', () => {
      const article = new BaseArticle(mockContentNode)
      const { container } = render(article.render())
      
      const articleElement = container.querySelector('article')
      expect(articleElement).toHaveClass('prose', 'prose-lg')
    })
  })

  describe('BreadcrumbsDecorator', () => {
    it('should render breadcrumbs before article', () => {
      const breadcrumbs = [
        { label: 'Início', uri: '/' },
        { label: 'Concursos', uri: '/concursos' },
        { label: 'Test Article', uri: '/concursos/test-article' }
      ]

      const article = new BaseArticle(mockContentNode)
      const decorated = new BreadcrumbsDecorator(article, breadcrumbs)
      render(decorated.render())

      expect(screen.getByText('Início')).toBeInTheDocument()
      expect(screen.getByText('Concursos')).toBeInTheDocument()
      expect(screen.getByText('Test Article')).toBeInTheDocument()
    })

    it('should mark last breadcrumb as current page', () => {
      const breadcrumbs = [
        { label: 'Início', uri: '/' },
        { label: 'Test Article', uri: '/test-article' }
      ]

      const article = new BaseArticle(mockContentNode)
      const decorated = new BreadcrumbsDecorator(article, breadcrumbs)
      const { container } = render(decorated.render())

      const currentPage = container.querySelector('[aria-current="page"]')
      expect(currentPage).toHaveTextContent('Test Article')
    })

    it('should render breadcrumb separators', () => {
      const breadcrumbs = [
        { label: 'Início', uri: '/' },
        { label: 'Concursos', uri: '/concursos' },
        { label: 'Test', uri: '/concursos/test' }
      ]

      const article = new BaseArticle(mockContentNode)
      const decorated = new BreadcrumbsDecorator(article, breadcrumbs)
      const { container } = render(decorated.render())

      const separators = container.querySelectorAll('[aria-hidden="true"]')
      expect(separators.length).toBe(2) // 3 items = 2 separators
    })
  })

  describe('TableOfContentsDecorator', () => {
    it('should render table of contents', () => {
      const article = new BaseArticle(mockContentNode)
      const decorated = new TableOfContentsDecorator(article)
      render(decorated.render())

      expect(screen.getByText('Índice')).toBeInTheDocument()
    })

    it('should extract h2 and h3 headings', () => {
      const article = new BaseArticle(mockContentNode)
      const decorated = new TableOfContentsDecorator(article)
      render(decorated.render())

      expect(screen.getByText('Section 1')).toBeInTheDocument()
      expect(screen.getByText('Subsection 1.1')).toBeInTheDocument()
    })

    it('should create anchor links for headings', () => {
      const article = new BaseArticle(mockContentNode)
      const decorated = new TableOfContentsDecorator(article)
      const { container } = render(decorated.render())

      const links = container.querySelectorAll('a[href^="#"]')
      expect(links.length).toBeGreaterThan(0)
    })

    it('should hide TOC when no headings exist', () => {
      const noHeadingsNode = {
        ...mockContentNode,
        content: '<p>Just a paragraph</p>'
      }

      const article = new BaseArticle(noHeadingsNode)
      const decorated = new TableOfContentsDecorator(article)
      render(decorated.render())

      expect(screen.queryByText('Índice')).not.toBeInTheDocument()
    })
  })

  describe('RelatedPostsDecorator', () => {
    const relatedPosts = [
      {
        id: '2',
        title: 'Related Post 1',
        uri: '/related-1',
        excerpt: '<p>Excerpt 1</p>'
      },
      {
        id: '3',
        title: 'Related Post 2',
        uri: '/related-2',
        excerpt: '<p>Excerpt 2</p>'
      }
    ]

    it('should render related posts section', () => {
      const article = new BaseArticle(mockContentNode)
      const decorated = new RelatedPostsDecorator(article, relatedPosts)
      render(decorated.render())

      expect(screen.getByText('Posts Relacionados')).toBeInTheDocument()
      expect(screen.getByText('Related Post 1')).toBeInTheDocument()
      expect(screen.getByText('Related Post 2')).toBeInTheDocument()
    })

    it('should strip HTML from excerpts', () => {
      const article = new BaseArticle(mockContentNode)
      const decorated = new RelatedPostsDecorator(article, relatedPosts)
      render(decorated.render())

      expect(screen.getByText('Excerpt 1')).toBeInTheDocument()
      expect(screen.getByText('Excerpt 2')).toBeInTheDocument()
    })

    it('should hide section when no related posts', () => {
      const article = new BaseArticle(mockContentNode)
      const decorated = new RelatedPostsDecorator(article, [])
      render(decorated.render())

      expect(screen.queryByText('Posts Relacionados')).not.toBeInTheDocument()
    })

    it('should create clickable links to related posts', () => {
      const article = new BaseArticle(mockContentNode)
      const decorated = new RelatedPostsDecorator(article, relatedPosts)
      const { container } = render(decorated.render())

      const links = container.querySelectorAll('a[href="/related-1"]')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Decorator Composition', () => {
    it('should compose multiple decorators correctly', () => {
      const breadcrumbs = [
        { label: 'Início', uri: '/' },
        { label: 'Test', uri: '/test' }
      ]
      const relatedPosts = [
        { id: '2', title: 'Related', uri: '/related' }
      ]

      let article: ArticleComponent = new BaseArticle(mockContentNode)
      article = new BreadcrumbsDecorator(article, breadcrumbs)
      article = new TableOfContentsDecorator(article)
      article = new RelatedPostsDecorator(article, relatedPosts)

      render(article.render())

      // All decorators should render
      expect(screen.getByText('Início')).toBeInTheDocument()
      expect(screen.getByText('Índice')).toBeInTheDocument()
      expect(screen.getByText('Posts Relacionados')).toBeInTheDocument()
      expect(screen.getByTestId('article-content')).toBeInTheDocument()
    })

    it('should preserve getContent() through decoration chain', () => {
      let article: ArticleComponent = new BaseArticle(mockContentNode)
      article = new BreadcrumbsDecorator(article, [])
      article = new TableOfContentsDecorator(article)

      expect(article.getContent()).toBe(mockContentNode)
    })
  })
})
