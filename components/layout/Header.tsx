import Link from 'next/link'
import ThemeToggle from '../navigation/ThemeToggle'
import { MainNav } from '../navigation/MainNav'
import { MobileNav } from '../navigation/MobileNav'
import { NavBuilder } from '../navigation/NavBuilder'
import { navigationData } from '../navigation/navigation-data'

export default function Header() {
  const navBuilder = new NavBuilder()
  const navItems = navBuilder.buildMany(navigationData)

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Boa Prova
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <MainNav items={navItems} />
          </div>

          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <MobileNav items={navItems} />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
