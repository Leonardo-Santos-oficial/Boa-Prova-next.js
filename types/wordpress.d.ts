export interface ContentNode {
  __typename: 'Post' | 'Page'
  id: string
  title: string
  content: string
  excerpt?: string
  uri: string
  date: string
  modified: string
  author?: Author
  featuredImage?: FeaturedImage
  categories?: CategoryConnection
  tags?: TagConnection
  seo: SEO
}

export interface Author {
  node: {
    name: string
    avatar: {
      url: string
    }
  }
}

export interface FeaturedImage {
  node: {
    sourceUrl: string
    altText: string
    mediaDetails: {
      width: number
      height: number
    }
  }
}

export interface CategoryConnection {
  nodes: Category[]
}

export interface Category {
  name: string
  uri: string
}

export interface TagConnection {
  nodes: Tag[]
}

export interface Tag {
  name: string
  uri: string
}

export interface SEO {
  title: string
  metaDesc: string
  canonical?: string
  opengraphTitle?: string
  opengraphDescription?: string
  opengraphImage?: {
    sourceUrl: string
  }
  schema?: {
    raw: string
  }
}
