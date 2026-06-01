import { redirect } from 'next/navigation'

// Middleware handles / → /fr redirect, this is a safety fallback
export default function RootPage() {
  redirect('/fr')
}
