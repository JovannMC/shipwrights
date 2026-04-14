import { prisma } from '@/lib/db'

// Detect whether a new reship should be flagged for admin review, and
// find a proof video to carry forward from a prior cert. Used by both
// webhook ingestion routes so detection stays consistent.
//
// A reship is anomalous (needsAdminReview=true) unless the most recent
// prior cert for the same ftProjectId was approved — either outright
// (status='approved') or approved-then-returned by YSWS (status='pending'
// with yswsReturnedAt set).
export async function detectReshipAnomaly(ftProjectId: string): Promise<{
  needsAdminReview: boolean
  previousVideoUrl: string | null
}> {
  const [mostRecent, mostRecentWithVideo] = await Promise.all([
    prisma.shipCert.findFirst({
      where: { ftProjectId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { status: true, yswsReturnedAt: true },
    }),
    prisma.shipCert.findFirst({
      where: { ftProjectId, proofVideoUrl: { not: null } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { proofVideoUrl: true },
    }),
  ])

  const wasApproved =
    mostRecent?.status === 'approved' ||
    (mostRecent?.status === 'pending' && mostRecent?.yswsReturnedAt !== null)

  return {
    needsAdminReview: !mostRecent || !wasApproved,
    previousVideoUrl: mostRecentWithVideo?.proofVideoUrl ?? null,
  }
}
