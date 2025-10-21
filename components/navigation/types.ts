import { ReactElement } from 'react'

export interface NavItemData {
  id: string
  label: string
  href?: string
  children?: NavItemData[]
}

export interface NavComponent {
  getId(): string
  getLabel(): string
  getHref(): string | undefined
  getChildren(): NavComponent[]
  isComposite(): boolean
}

export interface NavRenderer {
  render(component: NavComponent): ReactElement
}
