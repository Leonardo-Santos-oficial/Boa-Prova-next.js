import { ContentNode } from '@/types/wordpress'
import { wordpressAPI } from '@/lib/api/wordpress-facade'
import { BasePageRenderer, PageParams } from './BasePageRenderer'

export interface ContentPageProps {
  node: ContentNode
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

    return { node: data }
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
