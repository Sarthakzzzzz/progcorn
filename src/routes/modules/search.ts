import { Router } from 'express'
import { prisma } from '../../services/db'

const router = Router()

router.get('/', async (req, res) => {
  const { query, tag, category, sort } = req.query as any
  const where: any = { deletedAt: null, status: 'APPROVED' }
  if (query) where.OR = [
    { title: { contains: String(query), mode: 'insensitive' } },
    { description: { contains: String(query), mode: 'insensitive' } }
  ]
  if (category) where.category = { slug: String(category) }
  if (tag) where.tags = { some: { tag: { slug: String(tag) } } }
  const orderBy: any = sort === 'newest' ? { createdAt: 'desc' } : { upvotes: { _count: 'desc' } }
  const results = await prisma.resource.findMany({ where, orderBy, include: { category: true, tags: { include: { tag: true } }, _count: { select: { upvotes: true, comments: true } } } })
  res.json({ results })
})

export default router
