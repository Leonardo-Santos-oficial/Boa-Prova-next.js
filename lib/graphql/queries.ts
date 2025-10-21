import { gql } from 'graphql-request'

export const GET_NODE_BY_URI = gql`
  query GetNodeByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Post {
        id
        title
        content
        excerpt
        uri
        date
        modified
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            uri
            slug
          }
        }
        tags {
          nodes {
            name
            uri
            slug
          }
        }
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          schema {
            raw
          }
        }
      }
      ... on Page {
        id
        title
        content
        uri
        date
        modified
        seo {
          title
          metaDesc
          canonical
        }
      }
    }
  }
`

export const GET_ALL_URIS = gql`
  query GetAllUris {
    posts(first: 10000, where: { status: PUBLISH }) {
      nodes {
        uri
      }
    }
    pages(first: 1000, where: { status: PUBLISH }) {
      nodes {
        uri
      }
    }
  }
`
