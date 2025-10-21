import { NavComponent } from './types'

export class NavLeaf implements NavComponent {
  constructor(
    private readonly id: string,
    private readonly label: string,
    private readonly href: string
  ) {}

  getId(): string {
    return this.id
  }

  getLabel(): string {
    return this.label
  }

  getHref(): string {
    return this.href
  }

  getChildren(): NavComponent[] {
    return []
  }

  isComposite(): boolean {
    return false
  }
}

export class NavComposite implements NavComponent {
  private children: NavComponent[] = []

  constructor(
    private readonly id: string,
    private readonly label: string,
    private readonly href?: string
  ) {}

  add(component: NavComponent): void {
    this.children.push(component)
  }

  remove(component: NavComponent): void {
    const index = this.children.indexOf(component)
    if (index !== -1) {
      this.children.splice(index, 1)
    }
  }

  getId(): string {
    return this.id
  }

  getLabel(): string {
    return this.label
  }

  getHref(): string | undefined {
    return this.href
  }

  getChildren(): NavComponent[] {
    return this.children
  }

  isComposite(): boolean {
    return true
  }
}
