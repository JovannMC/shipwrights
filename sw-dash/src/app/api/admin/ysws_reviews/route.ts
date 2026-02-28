import { NextResponse } from 'next/server'
import { yswsApi } from '@/lib/api'
import { getYsws } from '@/lib/ysws'

export const GET = yswsApi(async (req) => {
  const p = req.nextUrl.searchParams
  const status = p.get('status') || null
  const sortBy = p.get('sortBy') || 'newest'
  const lbMode = p.get('lbMode') || 'weekly'
  const hours = p.get('hours') ? parseInt(p.get('hours')!) : null
  const ftId = p.get('ftId') || null
  const shipCertId = p.get('shipCertId') ? parseInt(p.get('shipCertId')!) : null
  const includeReviewers = p.get('includeReviewers') ? p.get('includeReviewers')!.split(',') : []
  const excludeReviewers = p.get('excludeReviewers') ? p.get('excludeReviewers')!.split(',') : []
  const from = p.get('from') || null
  const to = p.get('to') || null

  const data = await getYsws({
    status,
    sortBy,
    lbMode,
    hours,
    ftId,
    shipCertId,
    includeReviewers,
    excludeReviewers,
    from,
    to,
  })
  return NextResponse.json(data)
})
