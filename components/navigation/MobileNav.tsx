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
        className="mobile-nav-toggle md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Abrir menu de navegação"
        aria-controls="mobile-navigation"
      >
        <span className="hamburger-icon flex flex-col gap-1">
          <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all"></span>
          <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all"></span>
          <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all"></span>
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
            aria-hidden="true"
            role="presentation"
          />
          <nav 
            id="mobile-navigation"
            className="mobile-nav fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 md:hidden shadow-lg"
            aria-label="Menu de navegação mobile"
          >
            <ul className="mobile-nav-list p-4 space-y-2">
              {items.map(item => (
                <NavItem key={item.getId()} component={item} />
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  )
}
