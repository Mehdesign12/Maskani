import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // All paths except: api routes, Next.js internals, Vercel, static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
