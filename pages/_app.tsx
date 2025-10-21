import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Layout from '@/components/layout/Layout'
import { FocusModeProvider } from '@/contexts/FocusModeContext'
import '@/styles/globals.css'
import '@/styles/navigation.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <FocusModeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FocusModeProvider>
    </ThemeProvider>
  )
}
