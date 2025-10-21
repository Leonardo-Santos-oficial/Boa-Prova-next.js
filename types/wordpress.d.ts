// ISP: Base interfaces segregadas para evitar dependências desnecessárias

export interface NodeBase {
  __typename: string
  id: string
  title: string
  uri: string
}

export interface Timestamped {
  date: string
  modified: string
}

export interface WithContent {
  content: string
  excerpt?: string
}

export interface WithSEO {
  seo: SEO
}

export interface WithAuthor {
  author?: Author
}

export interface WithFeaturedImage {
  featuredImage?: FeaturedImage
}

export interface WithTaxonomies {
  categories?: CategoryConnection
  tags?: TagConnection
}

export interface ContentNode 
  extends NodeBase, 
          Timestamped, 
          WithContent, 
          WithSEO {
  __typename: 'Post' | 'Page'
}

export interface Post 
  extends ContentNode,
          WithAuthor,
          WithFeaturedImage,
          WithTaxonomies {
  __typename: 'Post'
}

export interface Page extends ContentNode {
  __typename: 'Page'
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
  slug?: string
}

export interface TagConnection {
  nodes: Tag[]
}

export interface Tag {
  name: string
  uri: string
  slug?: string
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

export interface UriNode {
  uri: string
}

export interface AllUrisResponse {
  posts: { nodes: UriNode[] }
  pages: { nodes: UriNode[] }
}
