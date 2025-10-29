/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import Spinner from '@/components/core/Spinner'

describe('Spinner Component', () => {
  it('should render spinner with default size', () => {
    const { container } = render(<Spinner />)
    
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('should render with small size', () => {
    const { container } = render(<Spinner size="sm" />)
    
    const spinner = container.querySelector('.w-4')
    expect(spinner).toBeInTheDocument()
  })

  it('should render with large size', () => {
    const { container } = render(<Spinner size="lg" />)
    
    const spinner = container.querySelector('.w-12')
    expect(spinner).toBeInTheDocument()
  })

  it('should have spin animation', () => {
    const { container } = render(<Spinner />)
    
    const spinner = container.querySelector('.animate-spin')
    expect(spinner?.className).toContain('animate-spin')
  })
})
