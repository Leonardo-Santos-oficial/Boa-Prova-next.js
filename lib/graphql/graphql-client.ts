import { GraphQLClient } from 'graphql-request'

export interface IGraphQLClient {
  request<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T>
}

export class GraphQLClientAdapter implements IGraphQLClient {
  private client: GraphQLClient

  constructor(endpoint: string) {
    this.client = new GraphQLClient(endpoint)
  }

  async request<T = unknown>(
    query: string, 
    variables?: Record<string, unknown>
  ): Promise<T> {
    return this.client.request<T>(query, variables)
  }
}
