import React, { useState } from 'react'
import Link from 'next/link'
import { NavComponent } from './types'

interface NavItemProps {
  component: NavComponent
  depth?: number
}

export const NavItem: React.FC<NavItemProps> = ({ component, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = component.isComposite() && component.getChildren().length > 0
  const href = component.getHref()
  const label = component.getLabel()

  const handleMouseEnter = () => {
    if (hasChildren) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (hasChildren) {
      setIsOpen(false)
    }
  }

  return (
    <li 
      className={`nav-item depth-${depth}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {href ? (
        <Link href={href} className="nav-link">
          {label}
          {hasChildren && <span className="nav-arrow">▼</span>}
        </Link>
      ) : (
        <span className="nav-label">
          {label}
          {hasChildren && <span className="nav-arrow">▼</span>}
        </span>
      )}
      
      {hasChildren && isOpen && (
        <ul className="nav-submenu">
          {component.getChildren().map(child => (
            <NavItem key={child.getId()} component={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

