import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

export const SESSION_TTL = 7 * 24 * 60 * 60 * 1000
export const CLEANUP_INTERVAL = 60000

export function parseId(id: string, name: string = 'ID'): number | null {
  const parsed = parseInt(id)
  if (isNaN(parsed) || parsed <= 0) {
    return null
  }
  return parsed
}

export function idErr(name: string = 'ID') {
  return NextResponse.json({ error: `${name} is fucked` }, { status: 400 })
}

export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    timingSafeEqual(Buffer.from(a), Buffer.from(a))
    return false
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
