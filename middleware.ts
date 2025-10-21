import { NextRequest, NextResponse } from 'next/server'
import { createRedirectChain } from './lib/redirects/redirect-chain'
import { LoopPreventionDecorator } from './lib/redirects/loop-prevention-decorator'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const query = Object.fromEntries(request.nextUrl.searchParams.entries())

  const baseChain = createRedirectChain()
  const protectedChain = new LoopPreventionDecorator(baseChain)
  
  const redirectResult = await protectedChain.handle({ path, query })

  if (redirectResult) {
    return NextResponse.redirect(
      new URL(redirectResult.destination, request.url),
      { status: redirectResult.permanent ? 301 : 302 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
