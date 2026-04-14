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
  const priors = await prisma.shipCert.findMany({
    where: { ftProjectId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: { status: true, yswsReturnedAt: true, proofVideoUrl: true },
    take: 50,
  })

  const mostRecent = priors[0]
  const wasApproved =
    mostRecent?.status === 'approved' ||
    (mostRecent?.status === 'pending' && mostRecent?.yswsReturnedAt !== null)

  return {
    needsAdminReview: !mostRecent || !wasApproved,
    previousVideoUrl: priors.find((p) => p.proofVideoUrl)?.proofVideoUrl ?? null,
  }
}
