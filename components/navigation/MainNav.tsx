import React from 'react'
import { NavComponent } from './types'
import { NavItem } from './NavItem'

interface MainNavProps {
  items: NavComponent[]
  className?: string
}

export const MainNav: React.FC<MainNavProps> = ({ items, className = '' }) => {
  return (
    <nav className={`main-nav ${className}`} aria-label="Main navigation">
      <ul className="nav-list">
        {items.map(item => (
          <NavItem key={item.getId()} component={item} />
        ))}
      </ul>
    </nav>
  )
}
