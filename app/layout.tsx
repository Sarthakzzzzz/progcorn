import '../styles/globals.css'
import type { ReactNode } from 'react'
import Providers from '../components/Providers'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export const metadata = {
  title: 'ProgCorn',
  description: 'Programming Resources Hub',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <div className="mx-auto max-w-6xl px-4 py-6">
            <Navbar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <main className="lg:col-span-2">{children}</main>
              <aside className="lg:col-span-1"><Sidebar /></aside>
            </div>
            <footer className="mt-8 border-t pt-6 text-sm text-gray-500">© {new Date().getFullYear()} ProgCorn</footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
