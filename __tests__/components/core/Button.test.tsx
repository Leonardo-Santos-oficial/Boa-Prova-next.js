/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/core/Button'

describe('Button Component', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('should call onClick when clicked', () => {
    const onClickMock = jest.fn()
    render(<Button onClick={onClickMock}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not call onClick when disabled', () => {
    const onClickMock = jest.fn()
    render(<Button onClick={onClickMock} disabled>Disabled</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(onClickMock).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  it('should render as different type', () => {
    render(<Button type="submit">Submit</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should forward additional props', () => {
    render(<Button data-testid="test-button">Button</Button>)
    
    expect(screen.getByTestId('test-button')).toBeInTheDocument()
  })
})
