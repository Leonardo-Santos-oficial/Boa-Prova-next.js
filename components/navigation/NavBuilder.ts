import { NavComponent, NavItemData } from './types'
import { NavLeaf, NavComposite } from './NavComposite'

export class NavBuilder {
  build(data: NavItemData): NavComponent {
    if (!data.children || data.children.length === 0) {
      return this.buildLeaf(data)
    }
    
    return this.buildComposite(data)
  }

  buildMany(dataList: NavItemData[]): NavComponent[] {
    return dataList.map(data => this.build(data))
  }

  private buildLeaf(data: NavItemData): NavLeaf {
    if (!data.href) {
      throw new Error(`NavLeaf requires href: ${data.id}`)
    }
    
    return new NavLeaf(data.id, data.label, data.href)
  }

  private buildComposite(data: NavItemData): NavComposite {
    const composite = new NavComposite(data.id, data.label, data.href)
    
    if (data.children) {
      data.children.forEach(childData => {
        const child = this.build(childData)
        composite.add(child)
      })
    }
    
    return composite
  }
}
