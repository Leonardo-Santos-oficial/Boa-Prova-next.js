import { render, screen } from '@testing-library/react'
import ArticleHeader from '../ArticleHeader'

describe('ArticleHeader', () => {
  const mockProps = {
    title: 'Título do Artigo de Teste',
    date: '2024-01-15T10:00:00Z',
  }

  it('should render article title', () => {
    render(<ArticleHeader {...mockProps} />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Título do Artigo de Teste')
  })

  it('should format date correctly', () => {
    render(<ArticleHeader {...mockProps} />)
    
    const dateElement = screen.getByText(/15 de janeiro de 2024/i)
    expect(dateElement).toBeInTheDocument()
  })

  it('should render author when provided', () => {
    const propsWithAuthor = {
      ...mockProps,
      author: {
        node: {
          name: 'Leonardo Santos',
          avatar: {
            url: 'https://example.com/avatar.jpg'
          }
        }
      }
    }

    render(<ArticleHeader {...propsWithAuthor} />)
    
    expect(screen.getByText(/Por Leonardo Santos/i)).toBeInTheDocument()
  })

  it('should render categories when provided', () => {
    const propsWithCategories = {
      ...mockProps,
      categories: [
        { name: 'Direito Constitucional', uri: '/direito-constitucional/' },
        { name: 'Concursos', uri: '/concursos/' }
      ]
    }

    render(<ArticleHeader {...propsWithCategories} />)
    
    expect(screen.getByText('Direito Constitucional')).toBeInTheDocument()
    expect(screen.getByText('Concursos')).toBeInTheDocument()
  })

  it('should not render categories section when empty', () => {
    render(<ArticleHeader {...mockProps} />)
    
    expect(screen.queryByText('Direito Constitucional')).not.toBeInTheDocument()
  })
})
