import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // All paths except: api routes, admin back-office, Next.js internals, Vercel, static files
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
}
