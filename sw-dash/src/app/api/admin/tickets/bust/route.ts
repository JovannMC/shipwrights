import { NextRequest, NextResponse } from 'next/server'
import { bust } from '@/lib/cache'
import { safeCompare } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-api-key')
  const botKey = process.env.SW_BOT_KEY
  if (!key || !botKey || !safeCompare(key, botKey)) {
    return NextResponse.json({ error: 'nope' }, { status: 401 })
  }
  await bust('cache:tickets*')
  return NextResponse.json({ ok: true })
}
