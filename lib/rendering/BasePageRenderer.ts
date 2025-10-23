import { GetStaticPropsResult } from 'next'

export interface PageParams {
  slug?: string[]
  [key: string]: unknown
}

export interface RenderOptions {
  revalidate?: number | false
  notFoundOnNull?: boolean
}

export abstract class BasePageRenderer<TData, TProps> {
  protected readonly defaultRevalidate: number = 3600

  constructor(protected readonly options: RenderOptions = {}) {
    this.options = {
      revalidate: this.defaultRevalidate,
      notFoundOnNull: true,
      ...options,
    }
  }

  async render(params: PageParams): Promise<GetStaticPropsResult<TProps>> {
    try {
      const data = await this.fetchData(params)

      if (!this.validateData(data)) {
        return this.handleInvalidData(data)
      }

      const transformedProps = this.transformData(data)

      return this.buildSuccessResponse(transformedProps)
    } catch (error) {
      return this.handleError(error, params)
    }
  }

  protected abstract fetchData(params: PageParams): Promise<TData>

  protected abstract validateData(data: TData): boolean

  protected abstract transformData(data: TData): TProps

  protected handleInvalidData(_data: TData): GetStaticPropsResult<TProps> {
    void _data
    if (this.options.notFoundOnNull) {
      return { notFound: true }
    }
    throw new Error('Invalid data received')
  }

  protected handleError(error: unknown, _params: PageParams): GetStaticPropsResult<TProps> {
    void _params
    console.error('PageRenderer: Error rendering page', { error, params: _params })
    return { notFound: true }
  }

  protected buildSuccessResponse(props: TProps): GetStaticPropsResult<TProps> {
    return {
      props,
      revalidate: this.options.revalidate || this.defaultRevalidate,
    }
  }
}
