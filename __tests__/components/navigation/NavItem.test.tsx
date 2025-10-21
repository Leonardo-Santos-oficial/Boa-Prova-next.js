import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { NavItem } from '../../../components/navigation/NavItem'
import { NavLeaf, NavComposite } from '../../../components/navigation/NavComposite'

describe('NavItem Component', () => {
  describe('Rendering leaf nodes', () => {
    it('should render a simple leaf with link', () => {
      const leaf = new NavLeaf('home', 'Início', '/')

      render(<NavItem component={leaf} />)

      const link = screen.getByRole('link', { name: /Início/ })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/')
    })

    it('should apply correct CSS classes', () => {
      const leaf = new NavLeaf('home', 'Início', '/')

      const { container } = render(<NavItem component={leaf} />)
      const listItem = container.querySelector('.nav-item')

      expect(listItem).toHaveClass('depth-0')
    })
  })

  describe('Rendering composite nodes', () => {
    it('should render composite with children on hover', () => {
      const composite = new NavComposite('direito', 'Direito')
      const child1 = new NavLeaf('const', 'Constitucional', '/direito-constitucional')
      const child2 = new NavLeaf('admin', 'Administrativo', '/direito-administrativo')

      composite.add(child1)
      composite.add(child2)

      const { container } = render(<NavItem component={composite} />)
      
      expect(screen.getByText('Direito')).toBeInTheDocument()
      
      const submenu = container.querySelector('.nav-submenu')
      expect(submenu).not.toBeInTheDocument()

      const navItem = container.querySelector('.nav-item')
      fireEvent.mouseEnter(navItem!)

      expect(screen.getByRole('link', { name: 'Constitucional' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Administrativo' })).toBeInTheDocument()
    })

    it('should show arrow indicator for composite with children', () => {
      const composite = new NavComposite('direito', 'Direito')
      const child = new NavLeaf('const', 'Constitucional', '/direito-constitucional')

      composite.add(child)

      const { container } = render(<NavItem component={composite} />)
      const arrow = container.querySelector('.nav-arrow')

      expect(arrow).toBeInTheDocument()
      expect(arrow).toHaveTextContent('▼')
    })

    it('should hide submenu on mouse leave', () => {
      const composite = new NavComposite('direito', 'Direito')
      const child = new NavLeaf('const', 'Constitucional', '/direito-constitucional')

      composite.add(child)

      const { container } = render(<NavItem component={composite} />)
      const navItem = container.querySelector('.nav-item')

      fireEvent.mouseEnter(navItem!)
      expect(screen.getByRole('link', { name: 'Constitucional' })).toBeInTheDocument()

      fireEvent.mouseLeave(navItem!)
      expect(screen.queryByRole('link', { name: 'Constitucional' })).not.toBeInTheDocument()
    })

    it('should not show submenu when composite has no children', () => {
      const composite = new NavComposite('direito', 'Direito')

      const { container } = render(<NavItem component={composite} />)
      const navItem = container.querySelector('.nav-item')

      fireEvent.mouseEnter(navItem!)

      const submenu = container.querySelector('.nav-submenu')
      expect(submenu).not.toBeInTheDocument()
    })

    it('should render composite with href as link', () => {
      const composite = new NavComposite('direito', 'Direito', '/direito')
      const child = new NavLeaf('const', 'Constitucional', '/direito-constitucional')

      composite.add(child)

      render(<NavItem component={composite} />)

      const link = screen.getByRole('link', { name: /Direito/ })
      expect(link).toHaveAttribute('href', '/direito')
    })
  })

  describe('Nested navigation', () => {
    it('should render nested structure with correct depth', () => {
      const root = new NavComposite('direito', 'Direito')
      const level1 = new NavComposite('const', 'Constitucional', '/direito-constitucional')
      const level2 = new NavLeaf('principios', 'Princípios', '/direito-constitucional/principios')

      level1.add(level2)
      root.add(level1)

      const { container } = render(<NavItem component={root} />)

      const depth0 = container.querySelector('.depth-0')
      expect(depth0).toBeInTheDocument()

      fireEvent.mouseEnter(depth0!)
      const depth1 = container.querySelector('.depth-1')
      expect(depth1).toBeInTheDocument()
    })
  })
})
