import React, { useState } from 'react'
import { NavComponent } from './types'
import { NavItem } from './NavItem'

interface MobileNavProps {
  items: NavComponent[]
}

export const MobileNav: React.FC<MobileNavProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        className="mobile-nav-toggle"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {isOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <ul className="mobile-nav-list">
            {items.map(item => (
              <NavItem key={item.getId()} component={item} />
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
