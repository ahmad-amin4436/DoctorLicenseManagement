import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Doctor License Management',
  description: 'Medical SaaS platform for managing doctor licenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
