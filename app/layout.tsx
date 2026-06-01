import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Maskani — Immobilier Maroc',
  description: 'La plateforme immobilière de référence au Maroc',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://maskani.ma'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
