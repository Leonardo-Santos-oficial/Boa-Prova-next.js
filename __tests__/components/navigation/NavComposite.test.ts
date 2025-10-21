import { NavLeaf, NavComposite } from '../../../components/navigation/NavComposite'

describe('NavComposite Pattern', () => {
  describe('NavLeaf', () => {
    it('should create a leaf node with required properties', () => {
      const leaf = new NavLeaf('home', 'Início', '/')

      expect(leaf.getId()).toBe('home')
      expect(leaf.getLabel()).toBe('Início')
      expect(leaf.getHref()).toBe('/')
      expect(leaf.isComposite()).toBe(false)
      expect(leaf.getChildren()).toEqual([])
    })

    it('should have no children', () => {
      const leaf = new NavLeaf('about', 'Sobre', '/sobre')

      expect(leaf.getChildren().length).toBe(0)
    })
  })

  describe('NavComposite', () => {
    it('should create a composite node without href', () => {
      const composite = new NavComposite('direito', 'Direito')

      expect(composite.getId()).toBe('direito')
      expect(composite.getLabel()).toBe('Direito')
      expect(composite.getHref()).toBeUndefined()
      expect(composite.isComposite()).toBe(true)
      expect(composite.getChildren()).toEqual([])
    })

    it('should create a composite node with href', () => {
      const composite = new NavComposite('direito', 'Direito', '/direito')

      expect(composite.getHref()).toBe('/direito')
    })

    it('should add children to composite', () => {
      const composite = new NavComposite('direito', 'Direito')
      const child1 = new NavLeaf('const', 'Constitucional', '/direito-constitucional')
      const child2 = new NavLeaf('admin', 'Administrativo', '/direito-administrativo')

      composite.add(child1)
      composite.add(child2)

      expect(composite.getChildren().length).toBe(2)
      expect(composite.getChildren()[0]).toBe(child1)
      expect(composite.getChildren()[1]).toBe(child2)
    })

    it('should remove children from composite', () => {
      const composite = new NavComposite('direito', 'Direito')
      const child1 = new NavLeaf('const', 'Constitucional', '/direito-constitucional')
      const child2 = new NavLeaf('admin', 'Administrativo', '/direito-administrativo')

      composite.add(child1)
      composite.add(child2)
      composite.remove(child1)

      expect(composite.getChildren().length).toBe(1)
      expect(composite.getChildren()[0]).toBe(child2)
    })

    it('should handle nested composites', () => {
      const root = new NavComposite('direito', 'Direito')
      const subCategory = new NavComposite('const', 'Constitucional', '/direito-constitucional')
      const leaf = new NavLeaf('principios', 'Princípios', '/direito-constitucional/principios')

      subCategory.add(leaf)
      root.add(subCategory)

      expect(root.getChildren().length).toBe(1)
      expect(root.getChildren()[0].isComposite()).toBe(true)
      expect(root.getChildren()[0].getChildren().length).toBe(1)
    })
  })

  describe('Composite Pattern - LSP Compliance', () => {
    it('should treat leaf and composite uniformly', () => {
      const items = [
        new NavLeaf('home', 'Início', '/'),
        new NavComposite('direito', 'Direito'),
      ]

      items.forEach(item => {
        expect(item.getId()).toBeTruthy()
        expect(item.getLabel()).toBeTruthy()
        expect(item.getChildren()).toBeInstanceOf(Array)
      })
    })
  })
})
