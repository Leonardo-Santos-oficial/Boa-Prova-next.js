import { ContentNode } from '@/types/wordpress'
import { wordpressAPI } from '@/lib/api/wordpress-facade'
import { BasePageRenderer, PageParams } from './BasePageRenderer'

export interface ContentPageProps {
  node: ContentNode
  breadcrumbs: Array<{ label: string; uri: string }>
  relatedPosts: Array<{
    id: string
    title: string
    uri: string
    excerpt?: string
  }>
}

export class ContentPageRenderer extends BasePageRenderer<
  ContentNode | null,
  ContentPageProps
> {
  protected async fetchData(params: PageParams): Promise<ContentNode | null> {
    const slug = params.slug || []
    const uri = Array.isArray(slug) ? slug.join('/') : slug

    if (this.shouldIgnoreUri(uri)) {
      return null
    }

    return wordpressAPI.getContentByUri(uri)
  }

  protected validateData(data: ContentNode | null): boolean {
    if (!data) return false

    return Boolean(
      data.id &&
      data.title &&
      data.content &&
      data.uri
    )
  }

  protected transformData(data: ContentNode | null): ContentPageProps {
    if (!data) {
      throw new Error('Cannot transform null data')
    }

    // Build breadcrumbs from URI
    const breadcrumbs = this.buildBreadcrumbs(data.uri, data.title)
    
    // For now, return empty related posts (can be enhanced later)
    const relatedPosts: ContentPageProps['relatedPosts'] = []

    return { 
      node: data,
      breadcrumbs,
      relatedPosts
    }
  }

  private buildBreadcrumbs(uri: string, title: string): Array<{ label: string; uri: string }> {
    const breadcrumbs = [{ label: 'Início', uri: '/' }]
    
    const segments = uri.split('/').filter(Boolean)
    let currentPath = ''
    
    for (let i = 0; i < segments.length - 1; i++) {
      currentPath += `/${segments[i]}`
      breadcrumbs.push({
        label: this.formatBreadcrumbLabel(segments[i]),
        uri: currentPath
      })
    }
    
    // Add current page
    breadcrumbs.push({
      label: title,
      uri: uri
    })
    
    return breadcrumbs
  }

  private formatBreadcrumbLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private shouldIgnoreUri(uri: string): boolean {
    const ignoredPatterns = [
      '_next',
      'favicon.ico',
      'robots.txt',
      'sitemap.xml',
    ]

    return ignoredPatterns.some(pattern => 
      uri.includes(pattern) || uri.startsWith(pattern)
    )
  }
}
