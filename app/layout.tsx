// Minimal root layout — html/body + lang/dir handled in app/[locale]/layout.tsx
// next-intl middleware auto-redirects / → /fr
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children as React.JSX.Element
}
