import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Maskani Admin',
    template: '%s | Maskani Admin',
  },
  description: 'Back-office Maskani — gestion de la plateforme (immobilier, ameublement, prestataires)',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body className="bg-[#f7f7f7] text-[#222222]">{children}</body>
    </html>
  )
}
