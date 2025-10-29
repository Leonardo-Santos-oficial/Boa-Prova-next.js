/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Card from '@/components/core/Card'

describe('Card Component', () => {
  it('should render with children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('custom-class')
    expect(card.className).toContain('bg-white')
  })

  it('should render as div element', () => {
    const { container } = render(<Card>Content</Card>)
    
    const card = container.firstChild as HTMLElement
    expect(card.tagName).toBe('DIV')
  })

  it('should render nested elements', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
      </Card>
    )
    
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})
