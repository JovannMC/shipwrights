import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { rateLimit } from '@/lib/ratelimit'

const loginLimiter = rateLimit('login-redirect', 10, 60 * 1000)

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!loginLimiter(ip).success) {
    return NextResponse.json({ error: 'slow down' }, { status: 429 })
  }

  const slackClientId = process.env.SLACK_CLIENT_ID
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/slack/callback`

  if (!slackClientId) {
    return NextResponse.json({ error: 'slack setup is fucked' }, { status: 500 })
  }

  const scopes = 'openid,profile,email'
  const state = randomUUID()

  const slackAuthUrl =
    `https://slack.com/openid/connect/authorize?` +
    `client_id=${slackClientId}&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${encodeURIComponent(state)}`

  const response = NextResponse.redirect(slackAuthUrl)
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300,
    path: '/',
  })
  return response
}
