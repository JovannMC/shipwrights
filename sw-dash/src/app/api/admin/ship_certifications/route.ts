import { NextResponse } from 'next/server'
import { can, PERMS } from '@/lib/perms'
import { getCerts } from '@/lib/certs'
import { api } from '@/lib/api'

export const GET = api(PERMS.certs_view)(async ({ user, req }) => {
  try {
    const { searchParams } = new URL(req.url)
    const rawType = searchParams.get('type')
    const type = rawType ? rawType.split(',').filter(Boolean) : null
    const ftType = searchParams.get('ftType')
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const lbMode = searchParams.get('lbMode') || 'weekly'
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const search = searchParams.get('search')
    const adminReview = searchParams.get('adminReview') === 'true'

    if (adminReview && !can(user.role, PERMS.certs_admin)) {
      return NextResponse.json({ error: 'nice try bozo' }, { status: 403 })
    }

    const data = await getCerts({
      type,
      ftType,
      status,
      sortBy,
      lbMode,
      from,
      to,
      search,
      adminReview,
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'shit hit the fan loading certifications' }, { status: 500 })
  }
})
