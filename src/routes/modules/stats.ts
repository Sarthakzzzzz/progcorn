import { Router } from 'express'
import { prisma } from '../../services/db'

const router = Router()

router.get('/sidebar', async (_req, res) => {
  // Popular tags (by number of approved resources)
  const tagCounts = await prisma.resourceTag.groupBy({
    by: ['tagId'],
    _count: { tagId: true },
  })
  const tagMap = new Map<string, number>(tagCounts.map((t: { tagId: string; _count: { tagId: number } }) => [t.tagId, t._count.tagId]))
  const popularTagsRaw = await prisma.tag.findMany({
    where: { id: { in: Array.from(tagMap.keys()) } },
    select: { id: true, name: true, slug: true },
  })
  const popularTags = popularTagsRaw
    .map((t: { id: string; name: string; slug: string }) => ({ ...t, count: tagMap.get(t.id) || 0 }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)

  // Categories with counts
  const categoryCounts = await prisma.resource.groupBy({
    by: ['categoryId'],
    where: { deletedAt: null, status: 'APPROVED' as any },
    _count: { categoryId: true },
  })
  const categoriesRaw = await prisma.category.findMany({
    where: { id: { in: categoryCounts.map((c: any) => c.categoryId) } },
    select: { id: true, name: true, slug: true },
  })
  const categories = categoriesRaw
    .map((c: { id: string; name: string; slug: string }) => ({ ...c, count: categoryCounts.find((cc: any) => cc.categoryId === c.id)?._count.categoryId || 0 }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)

  // Top contributors (by approved resources)
  const topAuthorsCounts = await prisma.resource.groupBy({
    by: ['authorId'],
    where: { deletedAt: null, status: 'APPROVED' as any },
    _count: { authorId: true },
  })
  const authorsRaw = await prisma.user.findMany({
    where: { id: { in: topAuthorsCounts.map((a: any) => a.authorId) } },
    select: { id: true, username: true },
  })
  const authors = authorsRaw
    .map((u: { id: string; username: string }) => ({ ...u, count: topAuthorsCounts.find((aa: any) => aa.authorId === u.id)?._count.authorId || 0 }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)

  // Announcements (static for now; can be moved to DB later)
  const announcements = [
    { id: 'a1', title: 'Welcome to PRHub', url: '#' },
    { id: 'a2', title: 'Submit your favorite resources!', url: '/submit' },
  ]

  res.json({ popularTags, categories, topAuthors: authors, announcements })
})

export default router
