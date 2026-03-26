import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSlackUser } from '@/lib/slack'
import { safeCompare } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const internalApiKey = process.env.API_KEY

    if (!internalApiKey || !apiKey || !safeCompare(apiKey, internalApiKey)) {
      return NextResponse.json({ error: 'unauthorized bruh' }, { status: 401 })
    }

    const { slackId } = await request.json()

    if (!slackId) {
      return NextResponse.json({ error: 'need a slack ID man' }, { status: 400 })
    }

    const found = await prisma.user.findFirst({
      where: { slackId },
    })

    if (found) {
      return NextResponse.json(
        {
          success: true,
          user: {
            id: found.id,
            slackId: found.slackId,
            username: found.username,
            role: found.role,
          },
          alreadyExisted: true,
        },
        { status: 200 }
      )
    }

    const slackUser = await getSlackUser(slackId)
    const newUser = await prisma.user.create({
      data: {
        slackId: slackId,
        username: slackUser.real_name || slackUser.name || 'unknown',
        avatar:
          slackUser.profile?.image_512 ||
          slackUser.profile?.image_192 ||
          slackUser.profile?.image_72 ||
          null,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        slackId: newUser.slackId,
        username: newUser.username,
        role: newUser.role,
      },
      alreadyExisted: false,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'shit broke' },
      { status: 500 }
    )
  }
}
