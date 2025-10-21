import { NavBuilder } from '../../../components/navigation/NavBuilder'
import { NavItemData } from '../../../components/navigation/types'

describe('NavBuilder', () => {
  let builder: NavBuilder

  beforeEach(() => {
    builder = new NavBuilder()
  })

  describe('buildLeaf', () => {
    it('should build a leaf node from data', () => {
      const data: NavItemData = {
        id: 'home',
        label: 'Início',
        href: '/',
      }

      const component = builder.build(data)

      expect(component.getId()).toBe('home')
      expect(component.getLabel()).toBe('Início')
      expect(component.getHref()).toBe('/')
      expect(component.isComposite()).toBe(false)
    })

    it('should throw error when leaf has no href', () => {
      const data: NavItemData = {
        id: 'invalid',
        label: 'Invalid',
      }

      expect(() => builder.build(data)).toThrow('NavLeaf requires href: invalid')
    })
  })

  describe('buildComposite', () => {
    it('should build a composite with children', () => {
      const data: NavItemData = {
        id: 'direito',
        label: 'Direito',
        children: [
          {
            id: 'const',
            label: 'Constitucional',
            href: '/direito-constitucional',
          },
          {
            id: 'admin',
            label: 'Administrativo',
            href: '/direito-administrativo',
          },
        ],
      }

      const component = builder.build(data)

      expect(component.isComposite()).toBe(true)
      expect(component.getChildren().length).toBe(2)
      expect(component.getChildren()[0].getLabel()).toBe('Constitucional')
      expect(component.getChildren()[1].getLabel()).toBe('Administrativo')
    })

    it('should build nested composites', () => {
      const data: NavItemData = {
        id: 'direito',
        label: 'Direito',
        children: [
          {
            id: 'const',
            label: 'Constitucional',
            href: '/direito-constitucional',
            children: [
              {
                id: 'principios',
                label: 'Princípios',
                href: '/direito-constitucional/principios',
              },
            ],
          },
        ],
      }

      const component = builder.build(data)

      expect(component.getChildren().length).toBe(1)
      expect(component.getChildren()[0].isComposite()).toBe(true)
      expect(component.getChildren()[0].getChildren().length).toBe(1)
      expect(component.getChildren()[0].getChildren()[0].getLabel()).toBe('Princípios')
    })

    it('should allow composite with href', () => {
      const data: NavItemData = {
        id: 'direito',
        label: 'Direito',
        href: '/direito',
        children: [
          {
            id: 'const',
            label: 'Constitucional',
            href: '/direito-constitucional',
          },
        ],
      }

      const component = builder.build(data)

      expect(component.getHref()).toBe('/direito')
      expect(component.isComposite()).toBe(true)
    })
  })

  describe('buildMany', () => {
    it('should build multiple components', () => {
      const dataList: NavItemData[] = [
        { id: 'home', label: 'Início', href: '/' },
        { id: 'sobre', label: 'Sobre', href: '/sobre' },
      ]

      const components = builder.buildMany(dataList)

      expect(components.length).toBe(2)
      expect(components[0].getId()).toBe('home')
      expect(components[1].getId()).toBe('sobre')
    })

    it('should build mixed leaf and composite nodes', () => {
      const dataList: NavItemData[] = [
        { id: 'home', label: 'Início', href: '/' },
        {
          id: 'direito',
          label: 'Direito',
          children: [
            { id: 'const', label: 'Constitucional', href: '/const' },
          ],
        },
      ]

      const components = builder.buildMany(dataList)

      expect(components.length).toBe(2)
      expect(components[0].isComposite()).toBe(false)
      expect(components[1].isComposite()).toBe(true)
    })
  })
})
