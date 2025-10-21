import { PropsWithChildren } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useFocusMode } from '@/contexts/FocusModeContext'

export default function Layout({ children }: PropsWithChildren) {
  const { isActive: isFocusMode } = useFocusMode()

  return (
    <div className={`min-h-screen flex flex-col ${isFocusMode ? 'focus-mode' : ''}`}>
      <Header />
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {!isFocusMode && <Footer />}
    </div>
  )
}
