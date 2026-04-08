import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUser } from '@/lib/server-auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user || !['megawright', 'hq'].includes(user.role)) {
    return NextResponse.json({ error: 'nope' }, { status: 403 })
  }

  const { id: rawId } = await params
  const id = parseInt(rawId)
  if (isNaN(id)) return NextResponse.json({ error: 'bad id' }, { status: 400 })

  const { shipped } = await req.json()

  const updated = await prisma.stickerRequest.update({
    where: { id },
    data: {
      shipped: !!shipped,
      shippedAt: shipped ? new Date() : null,
    },
    include: { requester: { select: { id: true, username: true, avatar: true } } },
  })

  return NextResponse.json(updated)
}
